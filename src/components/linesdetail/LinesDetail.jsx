import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../configs/line-list-configs/subwayLinesRouteConfig.js";
import LINE_COLORS from "../../configs/lineColors.js";
import "./LinesDetail.css";


function LinesDetail() {

  const navigate = useNavigate();

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

  // 호선 표기
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
    let position = 0;
    let reversePosition = 0;
    const onClicked = () => {
      position += 10;
      reversePosition -= 10;
      imageUp.style.transform = `translateY(${position}px)`;
      imageDown.style.transform =`translateY(${reversePosition}px)`;
    };
    stations.forEach((el) => (el.addEventListener('click', onClicked)));
    return () => stations.forEach((el) => el.removeEventListener('click', onClicked));
  },[]);

  const goToDetails = (station) => {
    navigate(`/linesdetail/${lineId}/details/${station}`)
  }

  useEffect(() => {
  const popPop = document.querySelector('.linesdetail-subway-up-p');
  const image1 = document.querySelector('.linesdetail-subway-up-image');
  if (!popPop || !image1) return;

  const onEnter = () => (popPop.style.visibility = 'visible');
  const onLeave = () => (popPop.style.visibility = 'hidden');

  image1.addEventListener('mouseenter', onEnter);
  image1.addEventListener('mouseleave', onLeave);

  return () => {
    image1.removeEventListener('mouseenter', onEnter);
    image1.removeEventListener('mouseleave', onLeave);
  };
}, []); // ✅ mount/unmount 시 한 번만 등록

useEffect(() => {
  const topToScroll = document.querySelector(".linesdetail-stations");
  const basis = document.querySelector(".linesdetail-stationscontainer"); // 필요 시
  if (!topToScroll) return;

  const apply = () => {
    const width = (basis ?? topToScroll).getBoundingClientRect().width;
    const isSmallPage = width <= 789.5;
    const atTop = topToScroll.scrollTop <= 0;

    // 초기화
    topToScroll.querySelectorAll(".station7, .station8").forEach(el => {
      el.style.removeProperty("clip-path");
      el.style.removeProperty("overflow");
    });

    if (!atTop) 
      return;

    const loopAndBranchLinePageWidth = isSmallPage ? ".station7" : ".station8";
    const target = topToScroll.querySelector(loopAndBranchLinePageWidth);

    if (target) {
      target.style.overflow = "hidden";
      target.style.setProperty("clip-path", "inset(0 0 50% 0)", "important");
    }
  };

  const checkStationMask = new ResizeObserver(apply);
  checkStationMask.observe(topToScroll);
  topToScroll.addEventListener("scroll", apply, { passive: true });
  apply();
  return () => { checkStationMask.disconnect(); topToScroll.removeEventListener("scroll", apply); };
}, []);

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

                    const branchLine = name.includes("지선");
                    const loopLine = name.includes("순환선");
                    
                    const linesDetailDisplayName = (branchLine || loopLine)
                    ? name
                    : (name.length >= 7 ? name.slice(0, 5) + "..." : name );

                    const linesDetailClassStation = [
                    "linesdetail-station",
                    branchLine && "linesdetail-branchLine",
                    loopLine && "linesdetail-loopLine",
                    "station1",
                    idx === 6 && "station7",
                    idx === 7 && "station8",
                    ].join(" ");

                    return (
                         <div
                        className={linesDetailClassStation}
                        key={`${lineNum}-${name}-${idx}`}
                        ref={idx === 0 ? stationRef : null}
                        onClick={() => goToDetails(linesDetailDisplayName)}
                          >
                        {linesDetailDisplayName}
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
