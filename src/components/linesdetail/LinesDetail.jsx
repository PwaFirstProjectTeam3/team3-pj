import { useMemo, useEffect, useRef, useState } from "react";
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


  // 역 목록
  const stations = useMemo(() => {

    const names = Array.isArray(ROUTE_DISPLAY[lineNum])
      ? ROUTE_DISPLAY[lineNum]
      : [];

    return names.map((stationName, i) => 
      ({ name: String(stationName), idx: i }));

  }, [lineNum]);

  // "n호선" 텍스트
  const readLineHeader = (name) => {

    const matchResult = String(name).match(/([0-9]+)[ ]*호선/);

    return matchResult
      ? { num: matchResult[1], label: "호선" }
      : { num: String(name), label: "" };
  };
  
  const { num: lineNumOnly, label: lineLabel } = readLineHeader(lineNum);


  // 스크롤 상태
  const scrollerRef = useRef(null);

  const [atTop, setAtTop] = useState(true);
  const [atBottom, setAtBottom] = useState(false);
  const [hasScrollOverflow, setHasScrollOverflow] = useState(false);


  // 스크롤/리사이즈에 따라 상태 갱신
  useEffect(() => {
    const scrollArea = scrollerRef.current;
    if (!scrollArea) return;

    const scrollUpdateState = () => {
      const maxScroll = Math.max(0, scrollArea.scrollHeight - scrollArea.clientHeight);
      const yHeight = scrollArea.scrollTop;

      setAtTop(yHeight <= 0);
      setAtBottom(maxScroll > 0 ? yHeight >= maxScroll - 1 : true);
      setHasScrollOverflow(maxScroll > 0);
      
    };

    scrollUpdateState();
    scrollArea.addEventListener("scroll", scrollUpdateState, 
      { passive: true });

    const scrollDisplay = new ResizeObserver(scrollUpdateState);
    scrollDisplay.observe(scrollArea);

    return () => { scrollArea.removeEventListener("scroll", scrollUpdateState); scrollDisplay.disconnect(); };
  }, []);


  // 그라데이션
  const fadeTopStyle = {
    position: "absolute",
    left: 0, 
    right: 0, 
    top: 0,
    height: 80,            // 필요 시 조절
    pointerEvents: "none",
    background: "linear-gradient(to bottom, rgba(255,255,255,1), rgba(255,255,255,0))",
    opacity: atTop || !hasScrollOverflow ? 0 : 1,
    transition: "opacity 160ms",
    zIndex: 9,
  };

  const fadeBottomStyle = {
    position: "absolute",
    left: 0, 
    right: 0, 
    bottom: 0,
    height: 80,            // 필요 시 조절
    pointerEvents: "none",
    background: "linear-gradient(to top, rgba(255,255,255,1), rgba(255,255,255,0))",
    opacity: atBottom || !hasScrollOverflow ? 0 : 1,
    transition: "opacity 160ms",
    zIndex: 9,
  };


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
        
        {/* 흰배경 검은바탕선 박스틀 */}
        <div className="linesdetail-frame">


          <div className="stations-responsive-height">

            {/* 최상단/최하단 스크롤 아닐 시 상/하단 그라디언트 마스크 적용 */}
            <div style={fadeTopStyle} />
            <div style={fadeBottomStyle} /> 

            <div className="linesdetail-stations-height" ref={scrollerRef}>
               <div
                className={`linesdetail-stations linesdetail-hide-scrollbar
                  ${atTop ? "at-top" : ""} ${atBottom ? "at-bottom" : ""}`}
              >

                {stations.map(({ name }, idx) => {

                  {/* 지선/순환선 레이아웃 및 이름 표시용 */}
                  const branchLine = name.includes("지선");
                  const loopLine = name.includes("순환선");

                  const linesDetailDisplayName = (branchLine || loopLine)
                    ? name
                    : 
                    (
                      name.length >= 7 
                      ? 
                      name.slice(0, 5) + "..." : name
                    );

                  {/* css 클래스명이랑 jsx 코드 연결해서 스타일 적용하고 싶은 부분에만 스타일 적용 */}
                  const linesDetailClassStation = [
                    "linesdetail-station",
                    branchLine && "linesdetail-branchLine",
                    loopLine && "linesdetail-loopLine",
                    fadeTopStyle && "linesdetail-station",
                  ]
                    .filter(Boolean)
                    .join(" ");

                  return (
                    <div className="line-box" key={`${lineNum}-${name}-${idx}`}>
                      <div
                        className={`top-line-color ${idx === 0 ? "first" : ""}`}
                      />
                      <div
                        className={linesDetailClassStation}
                        onClick={() => goToDetails(name)}
                      >
                        {linesDetailDisplayName}
                      </div>
                      <div
                        className={`bottom-line-color ${idx === stations.length - 1 ? "last" : ""}`}
                      />

                    </div>
                    
                  );
                })}
              </div>
            </div>
          </div>

          </div>
          <div className="grid-spacer" aria-hidden="true" />
        </div>
      </div>
  );
}

export default LinesDetail;