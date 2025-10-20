import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../configs/line-list-configs/subwayLinesRouteConfig.js";
import LINE_COLORS from "../../configs/lineColors.js";
import "./LinesDetail.css";


function LinesDetail() {

  const navigate = useNavigate();


  // 호선 표기 url에서 빼서 화면에 표시
  const { lineId } = useParams();
  const lineNum = lineId.replace('line', '') + '호선';


    // detail 링크
  const goToDetails = (station) => {
    navigate(`/linesdetail/${lineId}/details/${station}`)
  }
  

  // 색상 호선 별로 나누기
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
    return matchResult ? 
    { num: matchResult[1], label: "호선" } : 
    { num: String(name), label: "" };

  };

  const { num: lineNumOnly, label: lineLabel } = readLineTag(lineNum);


  // Refs
  const linesDetailStationsRef = useRef(null);


  // 드래그/리사이즈/그라디언트 해제 등 보정 로직
 useEffect(() => {
  const el = linesDetailStationsRef.current;
  if (!el) return;


  // hidebox 래퍼/박스들
  const hideboxDisplays = el.closest('.linesdetail-hideboxesverticallength') ?? el;
  const hidebox1 = hideboxDisplays.querySelector('.linesdetail-hidebox1');
  const hidebox2 = hideboxDisplays.querySelector('.linesdetail-hidebox2');

  const SCROLL_TOLERANCE = 12;

  const isAtTop = () => el.scrollTop <= SCROLL_TOLERANCE;
  const isAtBottom = () =>
    Math.ceil(el.scrollTop + el.clientHeight) >= Math.floor(el.scrollHeight) - SCROLL_TOLERANCE;


  // 최신 하단 상태를 유지(클로저 고정 방지)
  const wasAtBottomRef = { current: isAtBottom() };

  const scrollBottomDisplay = () => {
    const top = isAtTop();
    const bottom = isAtBottom();

    hideboxDisplays.classList.toggle('at-top', top);
    hideboxDisplays.classList.toggle('at-bottom', bottom);

    if (hidebox1) hidebox1.classList.toggle('at-top', top);
    if (hidebox2) hidebox2.classList.toggle('at-bottom', bottom);
  };

  const onScroll = () => {
    wasAtBottomRef.current = isAtBottom();
    scrollBottomDisplay();
  };

  // 리사이즈/리플로우 후 scrollHeight 안정될 때까지 기다렸다가 바닥 고정
  const pinBottomSafely = () => {
    let lastH = -1, stable = 0;
    const step = () => {
      const h = el.scrollHeight;
      if (h !== lastH) { lastH = h; stable = 0; requestAnimationFrame(step); }
      else if (stable < 2) { stable++; requestAnimationFrame(step); }
      else { el.scrollTop = el.scrollHeight; }
    };
    requestAnimationFrame(step);
  };

  const onResizeLike = () => {
    if (wasAtBottomRef.current) pinBottomSafely();
    requestAnimationFrame(scrollBottomDisplay);
  };

  // 스크롤 컨테이너만
  const scrollContainerDisplay = new ResizeObserver(onResizeLike);
 scrollContainerDisplay.observe(el);

  el.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResizeLike);

  // 초기/리소스 로드 후 상태 적용
  requestAnimationFrame(scrollBottomDisplay);
  if (document.fonts?.ready) document.fonts.ready.then(scrollBottomDisplay).catch(()=>{});
  if (document.readyState === 'complete') requestAnimationFrame(scrollBottomDisplay);
  else window.addEventListener('load', scrollBottomDisplay, { once: true });

  return () => {
    scrollContainerDisplay.disconnect();
    window.removeEventListener('resize', onResizeLike);
    el.removeEventListener('scroll', onScroll);
  };
}, []);

  // hidebox 스크롤 최상단/최하단 
  useEffect(() => {
  const baseStationsDisplay = document.querySelector('.linesdetail-stations');
  const hidebox1 = document.querySelector('.linesdetail-hidebox1');
  const hidebox2 = document.querySelector('.linesdetail-hidebox2');
  if (!baseStationsDisplay || !hidebox1 || !hidebox2) return;

  const scrollMargin = 12; 

  const isAtTop = () => baseStationsDisplay.scrollTop <= scrollMargin;

  const isAtBottom = () => {

    // 소수점 반올림/내림으로 안전판
    const topPlusView = Math.ceil(baseStationsDisplay.scrollTop + baseStationsDisplay.clientHeight);
    const full = Math.floor(baseStationsDisplay.scrollHeight);
    return topPlusView >= full - scrollMargin;
  };

  const hideboxScrolls = () => {
    hidebox1.classList.toggle('at-top', isAtTop());
    hidebox2.classList.toggle('at-bottom', isAtBottom());
  };

  const onScroll = () => hideboxScrolls();
  baseStationsDisplay.addEventListener('scroll', onScroll, { passive: true });

  // 초기 1회 적용 + 레이아웃 확정 후 한 번 더
  requestAnimationFrame(hideboxScrolls);
  if (document.fonts?.ready) document.fonts.ready.then(hideboxScrolls);
  if (document.readyState === 'complete') hideboxScrolls();
  else window.addEventListener('load', hideboxScrolls, { once: true });

  return () => {
    baseStationsDisplay.removeEventListener('scroll', onScroll);
  };
}, []);

  // 스크롤 맨하단 시 튕기는 문제 해결
useEffect(() => {
  const baseStationsDisplay = document.querySelector('.linesdetail-stations');
  if (!baseStationsDisplay) return;

  const isAtBottom = () =>
    baseStationsDisplay.scrollHeight - baseStationsDisplay.scrollTop - baseStationsDisplay.clientHeight <= 2;

  let wasAtBottom = isAtBottom(); // 초기 상태 기록

  const handleScroll = () => {
    wasAtBottom = isAtBottom();   // ← 스크롤할 때마다 갱신
  };

  const handleResize = () => {
    if (wasAtBottom) {
      // 레이아웃 확정 뒤에 적용
      requestAnimationFrame(() => {
        baseStationsDisplay.scrollTop = baseStationsDisplay.scrollHeight;
      });
    }
  };

  const scrollBottomDisplay = new ResizeObserver(handleResize);
  scrollBottomDisplay.observe(baseStationsDisplay);

  window.addEventListener('resize', handleResize);
  baseStationsDisplay.addEventListener('scroll', handleScroll, { passive: true });

  return () => {
    scrollBottomDisplay.disconnect();
    window.removeEventListener('resize', handleResize);
    baseStationsDisplay.removeEventListener('scroll', handleScroll);
  };
}, []);


  return (
    <div className="linesdetail-web-container" 
         style={{ "--line-color": lineColor }}>

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
                <div className="linesdetail-line" />

              {/* 역들(7자 이상 ... 붙임) */}
              <div className="linesdetail-stationscontainer">

                <div className="stations-responsive-height">
                  <div className="linesdetail-stations-height">
                    <div className="linesdetail-stations linesdetail-hide-scrollbar" 
                         ref={linesDetailStationsRef}>
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
                      "stationDrag",
                      idx === 6 && "linesdetail-station7",
                      idx === 7 && "linesdetail-station8",
                      ]
                      .filter(Boolean)
                      .join(" ");

                      return (
                            <div
                          className={linesDetailClassStation}
                          key={`${lineNum}-${name}-${idx}`}
                          onClick={() => goToDetails(name)}
                            >
                          {linesDetailDisplayName}
                            </div>
                            );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* 제일 위/아래 스크롤 시 튀어나온 선 없애주는 박스들 */}
              <div className="linesdetail-hideboxes">
                <div className="linesdetail-hideboxesverticallength">
                  <div className="linesdetail-hidebox1" />
                  <div className="linesdetail-hidebox2" />
                </div>
              </div>
    
            </div>
          </div>
        </div>
    </div>
  );
}

export default LinesDetail;
