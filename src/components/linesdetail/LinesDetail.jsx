import { useEffect, useMemo, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ROUTE_DISPLAY } from "../../configs/line-list-configs/subwayLinesRouteConfig.js";
import LINE_COLORS from "../../configs/lineColors.js";
import "./LinesDetail.css";


function LinesDetailCopy() {

  const navigate = useNavigate();


  // 호선 표기 url에서 빼서 화면에 표시
  const { lineId } = useParams();
  const lineNum = lineId.replace('line', '') + '호선';


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
  const stationRef = useRef(null);
  const linesDetailStationsRef = useRef(null);
  const linesDetailLineRef = useRef(null);
  const scopeRef = useRef(null);

  // 드래그/리사이즈/그라디언트 해제 등 보정 로직
 useEffect(() => {
  const linesDetailStations = linesDetailStationsRef.current;
  const linesDetailLine     = linesDetailLineRef.current;
  const scope               = scopeRef.current; // .linesdetail-hideboxesverticallength
  if (!linesDetailStations || !linesDetailLine || !scope) return;

  const apply = () => {
    const lineH    = linesDetailLine.getBoundingClientRect().height;
    const viewH    = linesDetailStations.clientHeight;
    const extra    = Math.max(0, lineH - viewH);
    const maxScroll= Math.max(1, linesDetailStations.scrollHeight - linesDetailStations.clientHeight);
    const progress = linesDetailStations.scrollTop / maxScroll;

    // CSS 변수 전달
    scope.style.setProperty("--extra", String(extra));
    scope.style.setProperty("--scroll-progress", String(progress));

    // 최상/최하 판정 (약간의 여유)
    const atTop    = linesDetailStations.scrollTop <= 0;
    const atBottom = linesDetailStations.scrollTop >= (maxScroll - 1);

    // hidebox 보너스용 클래스 (scope에!)
    scope.classList.toggle("at-top",    atTop && !atBottom);
    scope.classList.toggle("at-bottom", atBottom && !atTop);

    // (그라디언트용) 리스트에도 at-top 유지하고 싶다면 그대로 두기
    linesDetailStations.classList.toggle("at-top", atTop);
  };

  const ro = new ResizeObserver(apply);
  ro.observe(linesDetailStations);
  ro.observe(linesDetailLine);
  linesDetailStations.addEventListener("scroll", apply, { passive: true });
  if (document.fonts?.ready) document.fonts.ready.then(apply);
  apply();

  return () => {
    ro.disconnect();
    linesDetailStations.removeEventListener("scroll", apply);
  };
}, []);




  // 지하철 실시간 api ui만
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

  // 지하철 실시간 api ui만(자세한 지하철 정보)
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


  // detail 링크
  const goToDetails = (station) => {
    navigate(`/linesdetail/${lineId}/details/${station}`)
  }


  // 그라디언트 반영/해제
  const linesDetailGradientRef = useRef(null);

  useEffect(() => {
    const linesDetailGradient = linesDetailGradientRef.current;
    if (!linesDetailGradient) return;

    const handleScroll = () => {
      const isTop = linesDetailGradient.scrollTop <= 0;

      // 스크롤이 맨 위면 at-top 클래스 추가, 아니면 제거
      if (isTop) {
        linesDetailGradient.classList.add("at-top");
      } else {
        linesDetailGradient.classList.remove("at-top");
      }
    };

    // 초기 상태 반영
    handleScroll();
    linesDetailGradient.addEventListener("scroll", handleScroll, { passive: true });
    return () => linesDetailGradient.removeEventListener("scroll", handleScroll);
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
              <div className="linesdetail-line" ref={linesDetailLineRef} />
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
              <div className="linesdetail-hideboxesverticallength" ref={scopeRef}>
                <div className="linesdetail-hidebox1" />
                <div className="linesdetail-hidebox2" />
            {/* 역들(7자 이상 ... 붙임) */}
                <div className="linesdetail-stationscontainer">
                  <div className="linesdetail-stations linesdetail-hide-scrollbar" ref={linesDetailStationsRef}>
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
                    idx === 6 && "station7",
                    idx === 7 && "station8",
                    ].join(" ");

                    return (
                         <div
                        className={linesDetailClassStation}
                        key={`${lineNum}-${name}-${idx}`}
                        ref={idx === 0 ? stationRef : null}
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default LinesDetailCopy;
