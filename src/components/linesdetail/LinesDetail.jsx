import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../configs/line-list-configs/subwayLinesRouteConfig.js";
import "./LinesDetail.css";
import backBtn from "../../../public/btn/back-btn.svg";
import headerImg from "../../../public/base/header.svg";
import LINE_COLORS from "../../configs/lineColors.js";

function LinesDetail() {
  const { num } = useParams();                // "1" | "2" | ...
  const lineNum = `${num}호선`;               // "1호선"

  const lineColor = useMemo(
    () => LINE_COLORS[lineNum] ?? "#acacacff",
    [lineNum]
  );

  // ✅ ROUTE_DISPLAY만 사용
  const stations = useMemo(() => {
    const names = Array.isArray(ROUTE_DISPLAY[lineNum]) ? ROUTE_DISPLAY[lineNum] : [];
    return names.map((nm, i) => ({ name: String(nm), idx: i })); // 렌더용 단순 구조
  }, [lineNum]);

  // 헤더 표기
  const parseLineName = (name) => {
    const m = String(name).match(/(\d+)\s*호선/);
    return m ? { num: m[1], label: "호선" } : { num: String(name), label: "" };
  };
  const { num: lineNumOnly, label: lineLabel } = parseLineName(lineNum);

  // Refs
  const stRef = useRef(null);
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const hideTopRef = useRef(null);
  const hideBotRef = useRef(null);
  const recalcRef = useRef(() => {});

  // 드래그/리사이즈 등 보정 로직
  useEffect(() => {
    const st1 = stRef.current;
    const sts = listRef.current;
    const line = lineRef.current;
    const hbTop = hideTopRef.current;
    const hbBot = hideBotRef.current;
    if (!st1 || !sts || !line || !hbTop || !hbBot) return;

    // 드래그 스크롤
    st1.setAttribute("draggable", "true");
    let lastY = null;
    const onStart = () => { lastY = null; };
    const onDrag = (e) => {
      if (e.clientY === 0) return;
      if (lastY !== null) sts.scrollTop -= (e.clientY - lastY);
      lastY = e.clientY;
      recalcRef.current();
    };
    const onEnd = () => { lastY = null; };

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
  }, [stations.length]); // ← 역 개수 변동에 반응

  useEffect(() => {
    recalcRef.current && recalcRef.current();
  }, [stations.length]);

  const navigate = useNavigate();

  return (
    <div className="linesdetail-web-container" style={{ "--line-color": lineColor }}>
      <div className="linesdetail-container">
        <div className="linesdetail-box">
          <div className="linesdetail-backbutton">
            <img
              className="linesdetail-back"
              src={backBtn}
              alt="back-button"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="linesdetail-header">
            <img
              className="linesdetail-MetroinSeoul"
              src={headerImg}
              alt="Metro인서울"
              onClick={() => navigate("/")}
            />
          </div>

          <div className="linesdetail-textbox">
            <div className="linesdetail-line-number">
              {lineNumOnly}{lineLabel}
            </div>
          </div>

          <div className="linesdetail-frame">
            <div className="linesdetail-linebox">
              <div className="linesdetail-line" ref={lineRef} />
            </div>

            <div className="linesdetail-hideboxes">
              <div className="linesdetail-hideboxesverticallength">
                <div className="linesdetail-hidebox1" ref={hideTopRef} />
                <div className="linesdetail-hidebox2" ref={hideBotRef} />

                <div className="linesdetail-stationscontainer">
                  <div className="linesdetail-stations linesdetail-hide-scrollbar" ref={listRef}>
                    {stations.map(({ name }, idx) => (
                      <div
                        className={`linesdetail-station linesdetail-station${idx + 1}`}
                        key={`${lineNum}-${name}-${idx}`}
                        ref={idx === 0 ? stRef : null}
                      >
                        {name}
                      </div>
                    ))}
                    {stations.length === 0 && (
                      <div className="linesdetail-empty">해당 호선 데이터가 없습니다.</div>
                    )}
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