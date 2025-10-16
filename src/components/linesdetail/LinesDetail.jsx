import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../configs/line-list-configs/subwayLinesRouteConfig.js";
import LINE_COLORS from "../../configs/lineColors.js";
import "./LinesDetail.css";


function LinesDetail() {
  const { lineId } = useParams();
  const lineNum = lineId.replace('line', '') + '호선';

  const lineColor = useMemo(
    () => LINE_COLORS[lineNum] ?? "#000000",
    [lineNum]
  );

  // ROUTE_DISPLAY만 사용
  const stations = useMemo(() => {
    const names =
    Array.isArray(ROUTE_DISPLAY[lineNum]) ? ROUTE_DISPLAY[lineNum] : [];
    return names.map((stationName, i) => ({ name: String(stationName), idx: i }));
  }, [lineNum]);

  // 헤더 표기
  const readLineTag = (name) => {
    const matchResult =
    String(name).match(/([0-9]+)[ ]*호선/);
    return matchResult ? { num: matchResult[1], label: "호선" } : { num: String(name), label: "" };
  };
  const { num: lineNumOnly, label: lineLabel } = readLineTag(lineNum);
  // Refs
  const stationRef = useRef(null);
  const listRef = useRef(null);
  const lineRef = useRef(null);
  const hideTopRef = useRef(null);
  const hideBottomRef = useRef(null);
  const recalculateRef = useRef(() => {});
  // 드래그/리사이즈 등 보정 로직
  useEffect(() => {
    const station1 = stationRef.current;
    const stations = listRef.current;
    const line = lineRef.current;
    const hideboxTop = hideTopRef.current;
    const hideboxBottom = hideBottomRef.current;
    if (!station1 || !stations || !line || !hideboxTop || !hideboxBottom) return;
    // 드래그 스크롤
    station1.setAttribute("draggable", "true");
    let lastY = null;
    const onStart = () => { lastY = null; };
    const onDrag = (e) => {
      if (e.clientY === 0) return;
      if (lastY !== null) stations.scrollTop -= (e.clientY - lastY);
      lastY = e.clientY;
      recalculateRef.current();
    };
    const onEnd = () => { lastY = null; };
    station1.addEventListener("dragstart", onStart);
    station1.addEventListener("drag", onDrag);
    station1.addEventListener("dragend", onEnd);
    // hidebox 높이 계산
    const MIN = 35, BLEED = 0;
    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const recalc = () => {
      requestAnimationFrame(() => {
        const lineH = line.getBoundingClientRect().height;
        const viewH = stations.getBoundingClientRect().height;
        const extra = Math.max(0, lineH - viewH);
        const half  = extra / 2;
        const maxScroll  = stations.scrollHeight - stations.clientHeight;
        const topScroll  = stations.scrollTop;
        const bottomGap  = maxScroll - topScroll;
        const topNeed    = half - topScroll + BLEED;
        const bottomNeed = half - bottomGap + BLEED;
        const topH = clamp(Math.ceil(topNeed + MIN), MIN, extra + MIN);
        const botH = clamp(Math.ceil(bottomNeed + MIN), MIN, extra + MIN);
        hideboxTop.style.height = `${topH}px`;
        hideboxBottom.style.height = `${botH}px`;
      });
    };
    recalculateRef.current = recalc;
    const onScroll = () => recalc();
    stations.addEventListener("scroll", onScroll);
    const ro = new ResizeObserver(() => recalc());
    ro.observe(line);
    ro.observe(stations);
    window.addEventListener("resize", recalc);
    const mo = new MutationObserver(() => recalc());
    mo.observe(stations, { childList: true, subtree: true });
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => recalc());
    }
    recalc();
    requestAnimationFrame(recalc);
    return () => {
      station1.removeEventListener("dragstart", onStart);
      station1.removeEventListener("drag", onDrag);
      station1.removeEventListener("dragend", onEnd);
      stations.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", recalc);
      ro.disconnect();
      mo.disconnect();
    };
  }, [stations.length]); // ← 역 개수 변동에 반응
  useEffect(() => {
    recalculateRef.current && recalculateRef.current();
  }, [stations.length]);
  useEffect(() => {
    const imageUp = document.querySelector('.linesdetail-subway-up-image')
    const imageDown =document.querySelector('.linesdetail-subway-down-image')
    const stations = document.querySelectorAll('.linesdetail-station')
    if (!imageUp || !imageDown || stations.length === 0) return;
    let pos = 0;
    let reversePos = 0;
    const onClicked = () => {
      pos += 10;
      reversePos -= 10;
      imageUp.style.transform = `translateY(${pos}px)`;
      imageDown.style.transform =`translateY(${reversePos}px)`;
    };
    stations.forEach((el) => (el.addEventListener('click', onClicked)));
    return () => stations.forEach((el) => el.removeEventListener('click', onClicked));
  },[]);
  const navigate = useNavigate();
  const goToDetails = (station) => {
    navigate(`/linesdetail/${lineId}/details/${station}`)
  }
  useEffect(() => {
    const popPop = document.querySelector('.linesdetail-subway-up-p')
    const image1 = document.querySelector('.linesdetail-subway-up-image')
    image1.addEventListener("mouseenter", () => {
      popPop.style.visibility ='visible';
    });
    image1.addEventListener('mouseleave', () => {
    popPop.style.visibility = 'hidden';
  });
  })
  return (
    <div className="linesdetail-web-container" style={{ "--line-color": lineColor }}>
      <div className="linesdetail-container">
          {/* 바깥 박스틀 */}
        <div className="linesdetail-box">
          {/* n호선 표시 */}
          <div className="linesdetail-textbox">
            <div className="linesdetail-line-number">
              {lineNumOnly}{lineLabel}
            </div>
          </div>
          <div className="linesdetail-frame">
            {/* 안쪽 박스틀 */}
            <div className="linesdetail-linebox">
              {/* 노선  */}
              <div className="linesdetail-line" ref={lineRef} />
            </div>
            {/* 실시간 지하철 위치 */}
            <div className="linesdetail-subwaysbox">
              <div className="linesdetail-subways">
                <div className="linesdetail-subway-line-up">
                  <img className="linesdetail-subway-up-image" src="../../icon-subway.png" alt="지하철 이미지 상행선"></img>
                  <img className="linesdetail-subway-up-image2" src="../../icon-subway.png" alt="지하철 이미지 상행선2" />
                </div>
                <p className="linesdetail-subway-up-p">1호선 상행 일반</p>
                <div className="linesdetail-subway-line-down">
                  <img className="linesdetail-subway-down-image" src="../../icon-subway.png" alt="지하철 이미지 하행선" />
                  <img className="linesdetail-subway-down-image2" src="../../icon-subway.png" alt="지하철 이미지 하행선2" />
                </div>
              </div>
            </div>
            {/* 제일 위/아래 스크롤 시 튀어나온 선 없애주는 박스들 */}
            <div className="linesdetail-hideboxes">
              <div className="linesdetail-hideboxesverticallength">
                <div className="linesdetail-hidebox1" ref={hideTopRef} />
                <div className="linesdetail-hidebox2" ref={hideBottomRef} />
            {/* 역들(7자 이상 ... 붙임) */}
                <div className="linesdetail-stationscontainer">
                  <div className="linesdetail-stations linesdetail-hide-scrollbar" ref={listRef}>
                    {stations.map(({ name }, idx) => {
                    // 글자 수가 7자 이상인지 판단
                     const lengthForCheck = name.length;
                    // 표시용: '-'는 그대로 둠
                    const isLongName = lengthForCheck >= 7;
                    const displayName = isLongName ? name.slice(0, 5) + "..." : name;
                    const branchLine = name.includes("지선");
                    const loopLine = name.includes("순환선");
                    const classStation = [
                    "linesdetail-station",
                    branchLine && "linesdetail-branchLine",
                    loopLine && "linesdetail-loopLine",
                    "station1",
                    ]
                    .join(" ");
                    return (
                         <div
                        className={classStation}
                        key={`${lineNum}-${name}-${idx}`}
                        ref={idx === 0 ? stationRef : null}
                        onClick={() => goToDetails(displayName)}
                          >
                        {displayName}
                          </div>
                          );
                    })}
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