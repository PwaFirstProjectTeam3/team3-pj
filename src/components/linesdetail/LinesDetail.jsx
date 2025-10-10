import { useEffect, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubwayLineStations } from "../../store/thunks/subwayLinesThunk.js";
import { setSeoulLines } from "../../store/slices/subwayLinesSlice.js";
import { useNavigate } from "react-router-dom";
import "./LinesDetail.css"; 

function LinesDetail( {lineNum} ) {
  const dispatch = useDispatch();
  const { list } = useSelector((s) => s.lines);

  // 1) 데이터 로드 (마운트 1회)
  useEffect(() => {
    dispatch(fetchSubwayLineStations("1호선"))
      .unwrap()
      .then(({ stations }) => dispatch(setSeoulLines(stations)))
      .catch(() => {});
  }, [dispatch]);

  // 2) 정렬/앵커 계산 (메모)
  const stationsSorted = useMemo(() => {
    const src = Array.isArray(list) ? list : [];
    const onlyNum = (v) => Number(String(v ?? "").replace(/\D/g, ""));

    const cmp = (a, b) => {
      const af = onlyNum(a?.FR_CODE), bf = onlyNum(b?.FR_CODE);
      if (Number.isFinite(af) && Number.isFinite(bf) && af !== bf) return af - bf;
      const ac = onlyNum(a?.STATION_CD ?? a?.station_cd ?? a?.STATION_CODE);
      const bc = onlyNum(b?.STATION_CD ?? b?.station_cd ?? b?.STATION_CODE);
      if (Number.isFinite(ac) && Number.isFinite(bc) && ac !== bc) return ac - bc;
      return String(a?.STATION_NM ?? "").localeCompare(String(b?.STATION_NM ?? ""), "ko");
    };

    const keyOf = (s) =>
      `${s?.STATION_CD ?? s?.station_cd ?? s?.STATION_CODE}-${s?.LINE_NUM ?? ""}-${s?.STATION_NM ?? ""}`;
    const uniq = [...new Map(src.map((s) => [keyOf(s), s])).values()];

    const FIRST_ANCHOR = /^연천$/;
    const LAST_ANCHOR  = /^신창(\(.*\))?$/;

    const firsts = uniq.filter((s) => FIRST_ANCHOR.test(String(s?.STATION_NM || "")));
    const lasts  = uniq.filter((s) => LAST_ANCHOR.test(String(s?.STATION_NM || "")));
    const rest   = uniq.filter(
      (s) => !FIRST_ANCHOR.test(String(s?.STATION_NM || "")) && !LAST_ANCHOR.test(String(s?.STATION_NM || ""))
    );

    rest.sort(cmp);
    const pickFirst = (arr) => (arr.length ? [...arr].sort(cmp)[0] : null);
    const pickLast  = (arr) => (arr.length ? [...arr].sort(cmp).at(-1) : null);

    const first = pickFirst(firsts);
    const last  = pickLast(lasts);
    return [...(first ? [first] : []), ...rest, ...(last ? [last] : [])];
  }, [list]);

  // 3) 헤더 파싱
  const rawLineName = "1호선";
  const parseLineName = (name) => {
    const m = String(name).match(/(\d+)\s*호선/);
    return m ? { num: m[1], label: "호선" } : { num: String(name), label: "" };
  };
  const { num: lineNumOnly, label: lineLabel } = parseLineName(rawLineName);

  // 4) DOM refs
  const stRef      = useRef(null);
  const listRef    = useRef(null);
  const lineRef    = useRef(null);
  const hideTopRef = useRef(null);
  const hideBotRef = useRef(null);

  // ▼ 최신 recalc를 보관할 ref
  const recalcRef = useRef(() => {});

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
      recalcRef.current();          // 드래그 중에도 즉시 갱신
    };
    const onEnd   = () => { lastY = null; };

    st1.addEventListener("dragstart", onStart);
    st1.addEventListener("drag", onDrag);
    st1.addEventListener("dragend", onEnd);

    // hidebox 높이 계산
    const MIN = 35, BLEED = 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

    const recalc = () => {
      // rAF 1프레임 보장: 빌드 환경에서 레이아웃 0 이슈 회피
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

    // 최신 함수 보관
    recalcRef.current = recalc;

    // 스크롤/리사이즈/리사이즈옵저버
    const onScroll = () => recalc();
    sts.addEventListener("scroll", onScroll);

    const ro = new ResizeObserver(() => recalc());
    ro.observe(line);
    ro.observe(sts);
    window.addEventListener("resize", recalc);

    // DOM 내용 변동(역 목록 mount 후 높이 변함) 감지
    const mo = new MutationObserver(() => recalc());
    mo.observe(sts, { childList: true, subtree: true });

    // 폰트 로드 완료 후 다시
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => recalc());
    }

    // 최초 2프레임 보장
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
  }, []); // 핸들러 설치는 1회

  // ★ 데이터가 도착(정렬된 역 수가 변함)할 때마다 재계산
  useEffect(() => {
    recalcRef.current && recalcRef.current();
  }, [stationsSorted.length]);

  const navigate = useNavigate();

  return (
    <div className="container">
      <div className="box">
      <div className="backbutton">
        <img className="back" src="../../src/components/assets/back-btn.svg" alt="back-button" onClick={ () => { navigate('/')} } />
      </div>
      <div className="header">
        <img className="MetroinSeoul" src="../../src/components/assets/header.svg" alt="Metro인서울" onClick={ () => { navigate('/')} }  />
      </div>
        <div className="textbox">
          <div className="line-number">{lineNumOnly}{lineNum}</div>
          <div className="line-text">{lineLabel}</div>
        </div>

        <div className="frame">
          <div className="linebox">
            <div className="line"/>
          </div>

          <div className="hideboxes">
            <div className="hideboxesverticallength">
              {/* ★ 이 두 덮개 높이만 JS에서 바꾼다 */}
              <div className="hidebox1" ref={hideTopRef} />
              <div className="hidebox2" ref={hideBotRef} />

              <div className="stationscontainer">
                <div className="stations hide-scrollbar" ref={listRef}>
                  {stationsSorted.map((st, idx) => (
                    <div
                      className={`station station${idx + 1}`}
                      key={st.STATION_CD || st.station_cd || idx}
                      ref={idx === 0 ? stRef : null}
                    >
                      {st.STATION_NM || st.station_nm}
                    </div>
                  ))}
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