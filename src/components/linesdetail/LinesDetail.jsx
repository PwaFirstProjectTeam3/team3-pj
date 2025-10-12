import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubwayLineStations } from "../../store/thunks/subwayLinesThunk.js";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_DISPLAY, ROUTE_ORDER } from "../../configs/lines-route.js";
import "./LinesDetail.css"; 
import backBtn from "../../assets/back-btn.svg";
import headerImg from "../../assets/header.svg";

const LINE_COLORS = {
  "1호선": "#163191",
  "2호선": "#35A344",
  "3호선": "#E88200",
  "4호선": "#39A6E1",
  "5호선": "#9C4A9D",
  "6호선": "#AD7A00",
  "7호선": "#637531",
  "8호선": "#DF4C71",
  "9호선": "#BA9300",
};

function LinesDetail() {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.lines);

  // ★ 강력 정규화: 괄호/공백/중점/하이픈 제거 + '역' 접미사 제거
const normalizeName = (s) => String(s ?? "")
  .normalize("NFKC")
  .replace(/\(.*?\)/g, "")
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .replace(/[·•・]/g, "")
  .replace(/-/g, "")
  .replace(/\s+/g, " ")
  .trim()
  .replace(/역$/u, "")
  .replace(/\s+/g, "");

// 표시/UI용 (사람이 보기 좋게)
  const displayName = (s) => String(s ?? "")
  .normalize("NFKC")
  .replace(/\(.*?\)\s*$/g, "")
  .replace(/[\u200B-\u200D\uFEFF]/g, "")
  .trim()
  .replace(/\s*역\s*$/u, "");

  const { num } = useParams();            // "1" | "2" | ...
  const lineNum = `${num}호선`;           // "1호선" 형태로 변환

  // 1) 데이터 로드 (마운트 1회)
  useEffect(() => {
    if (num) dispatch(fetchSubwayLineStations(lineNum));
  }, [num, lineNum, dispatch]);

  const lineColor = useMemo(
    () => LINE_COLORS[lineNum] ?? "#acacacff",
    [lineNum]
  );

  // "1호선" → { num:"1", label:"호선" }
  const m = String(lineNum).match(/(\d+)\s*호선/);

  // 2) 정렬/앵커 계산
// 2) 정렬/앵커 계산
const stationsSorted = useMemo(() => {
  const src = Array.isArray(list) ? list : [];

  const nameOf = (s) => String(s?.STATION_NM ?? s?.station_nm ?? "");
  const keyOf  = (s) =>
    `${s?.STATION_CD ?? s?.station_cd ?? s?.STATION_CODE}-${s?.LINE_NUM ?? ""}-${nameOf(s)}`;
  const uniq = [...new Map(src.map((s) => [keyOf(s), s])).values()];

  // ★ ROUTE_ORDER 기반 정렬 (정규화 사용 + 누락분은 뒤에 붙이기)
  const routeRaw = ROUTE_ORDER[lineNum];
  if (Array.isArray(routeRaw) && routeRaw.length) {
    // 1) 경로 인덱스(정규화) 생성
    const routeNorm = routeRaw.map((nm) => normalizeName(nm));
    const index = new Map(routeNorm.map((nm, i) => [nm, i]));

    // 2) inRoute / notInRoute 분리
    const inRoute = [];
    const notInRoute = [];

    for (const s of uniq) {
      const nmNorm = normalizeName(nameOf(s));
      const idx = index.get(nmNorm);
      if (idx !== undefined) {
        inRoute.push([idx, s]);
      } else {
        notInRoute.push(s); // ← 경로표에 없으면 버리지 말고 남겨둔다
      }
    }

    // 3) 경로 순서대로 정렬 + 누락분은 뒤에(원래 순서 보존)
    inRoute.sort((a, b) => a[0] - b[0]);
    return [...inRoute.map(([, s]) => s), ...notInRoute];
  }

  return uniq;
}, [list, lineNum]);

  // 3) 헤더 파싱: 프롭 사용
  const parseLineName = (name) => {
    const m = String(name).match(/(\d+)\s*호선/);
    return m ? { num: m[1], label: "호선" } : { num: String(name), label: "" };
  };
  const { num: lineNumOnly, label: lineLabel } = parseLineName(lineNum);

  // 4) Refs
  const stRef      = useRef(null);
  const listRef    = useRef(null);
  const lineRef    = useRef(null);         // ← 실제로 JSX에 연결해야 함
  const hideTopRef = useRef(null);
  const hideBotRef = useRef(null);

  const recalcRef = useRef(() => {});

  // ★ 핸들러/옵저버 설치: 역 목록이 렌더된 후에도 재시도되도록 length를 의존성으로 둔다
  useEffect(() => {
    const st1   = stRef.current;
    const sts   = listRef.current;
    const line  = lineRef.current;
    const hbTop = hideTopRef.current;
    const hbBot = hideBotRef.current;
    if (!st1 || !sts || !line || !hbTop || !hbBot) return;

    // 드래그 스크롤
    st1.setAttribute("draggable", "true");
    let lastY = null;
    const onStart = () => { lastY = null; };
    const onDrag  = (e) => {
      if (e.clientY === 0) return;
      if (lastY !== null) sts.scrollTop -= (e.clientY - lastY);
      lastY = e.clientY;
      recalcRef.current();
    };
    const onEnd   = () => { lastY = null; };

    st1.addEventListener("dragstart", onStart);
    st1.addEventListener("drag", onDrag);
    st1.addEventListener("dragend", onEnd);

    // hidebox 높이 계산
    const MIN = 35, BLEED = 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const recalc = () => {
      requestAnimationFrame(() => {
        const lineH = line.getBoundingClientRect().height;
        const viewH = sts.getBoundingClientRect().height;
        const extra = Math.max(0, lineH - viewH);
        const half  = extra / 2;

        const maxScroll  = sts.scrollHeight - sts.clientHeight;
        const topScroll  = sts.scrollTop;
        const bottomGap  = maxScroll - topScroll;

        const topNeed    = half - topScroll + BLEED;
        const bottomNeed = half - bottomGap + BLEED;

        const topH = clamp(Math.ceil(topNeed + MIN), MIN, extra + MIN);
        const botH = clamp(Math.ceil(bottomNeed + MIN), MIN, extra + MIN);

        hbTop.style.height = `${topH}px`;
        hbBot.style.height = `${botH}px`;
      });
    };
    recalcRef.current = recalc;

    const onScroll = () => recalc();
    sts.addEventListener("scroll", onScroll);

    const ro = new ResizeObserver(() => recalc());
    ro.observe(line);
    ro.observe(sts);
    window.addEventListener("resize", recalc);

    const mo = new MutationObserver(() => recalc());
    mo.observe(sts, { childList: true, subtree: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => recalc());
    }
    recalc();
    requestAnimationFrame(recalc);

    return () => {
      st1.removeEventListener("dragstart", onStart);
      st1.removeEventListener("drag", onDrag);
      st1.removeEventListener("dragend", onEnd);
      sts.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recalc);
      ro.disconnect();
      mo.disconnect();
    };
  }, [stationsSorted.length]);  // ← 핵심 변경

  // 데이터 변동 시 강제 재계산(보강)
  useEffect(() => {
    recalcRef.current && recalcRef.current();
  }, [stationsSorted.length]);

  const navigate = useNavigate();

  return (
    <div className="web-container" style={{ "--line-color": lineColor }}>
      <div className="container">
        <div className="box">
          <div className="backbutton">
            <img className="back" src={backBtn} alt="back-button" onClick={() => navigate('/')} />
          </div>
          <div className="header">
            <img className="MetroinSeoul" src={headerImg} alt="Metro인서울" onClick={() => navigate('/')} />
          </div>

          <div className="textbox">
            <div className="line-number">{lineNumOnly}{lineLabel}</div> 
          </div>

          <div className="frame">
            <div className="linebox">
              <div className="line" ref={lineRef} />  
            </div>

            <div className="hideboxes">
              <div className="hideboxesverticallength">
                <div className="hidebox1" ref={hideTopRef} />
                <div className="hidebox2" ref={hideBotRef} />

                <div className="stationscontainer">
                  <div className="stations hide-scrollbar" ref={listRef}>
                    {stationsSorted.map((st, idx) => (
                      <div
                        className={`station station${idx + 1}`}
                        key={st.STATION_CD || idx}
                        ref={idx === 0 ? stRef : null}
                      >
                        {ROUTE_DISPLAY[lineNum]?.[idx] ??
                          (st.STATION_NM || st.station_nm)}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default LinesDetail;