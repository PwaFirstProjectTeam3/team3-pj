import { useDispatch, useSelector } from 'react-redux';
import './Detail.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { arrivalInfoIndex, convenienceInfoIndex, stationInfoIndex } from '../../store/thunks/detailThunk';

function Detail() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { lineId, station } = useParams();

  const lines = useSelector((state) => state.detail.lines);
  const stationInfo = useSelector((state) => state.detail.stationInfo);
  const convenienceInfo = useSelector((state) => state.detail.convenienceInfo);
  const arrivalInfo = useSelector((state) => state.detail.arrivalInfo);
  
  // 도착 정보 불러오기
  // useEffect(() => {
  //   dispatch(arrivalInfoIndex());
  // }, []);
  // // 현재역의 도착 정보
  // const currentArrivalList = Array.isArray(arrivalInfo) ? arrivalInfo.filter(info => info.statnNm === station) : [];
  // // 도착방면(trainLineNm)별로 그룹화
  // const groupedArrival = {};
  // currentArrivalList.forEach((train) => {
  //   const key = train.trainLineNm;
  //   if (!groupedArrival[key]) {
  //   groupedArrival[key] = [];
  //   }
  //   groupedArrival[key].push(train);
  // });
  // // 각 도착방면별 첫번째, 두번째 열차만 정렬
  // Object.keys(groupedArrival).forEach((key) => {
  //   groupedArrival[key].sort((a,b) => Number(a.barvlDt) - Number(b.barvlDt));
  // });
  // // barvlDt의 초 단위를 '분'으로 변환
  // const formatSecondsToMinutes = (sec) => {
  //   const num = Number(sec);
  //   if (isNaN(num) || num < 0) return "-"; // 유효하지 않은 입력 처리
  //   if (num < 60) return "곧 도착"; // 60초 미만일 때
  //   return `${Math.floor(num / 60)}분`; // 60초 이상일 때 분 단위로 변환
  // };
  // console.log("arrivalInfo:", arrivalInfo);

  // 편의시설 정보 불러오기
  useEffect(() => {
    dispatch(convenienceInfoIndex());
  }, []);

  const currentConvenienceInfo = Array.isArray(convenienceInfo) ? convenienceInfo.find(info => info.STATION_NAME === station) : null;

  const getConvenienceInfo = (key) => {
    const value = currentConvenienceInfo?.[key];
    const convenienceAvailable = value === 'Y';

    const convenienceIconName = {
      EL: "elevator",
      WL: "wheelchairlift",
      PARKING: "parking",
      BICYCLE: "bicycleshed",
      FDROOM: "nursingroom",
    };

    const iconName = convenienceIconName[key];
    const iconSrc = convenienceAvailable ? `/icons/${iconName}-icon-y.svg` : `/icons/${iconName}-icon-n.svg`;
    const textColor = convenienceAvailable ? "black" : "gray";

    return { iconSrc, textColor };
  };

  // 역 정보 불러오기
  useEffect(() => {
    dispatch(stationInfoIndex());
  }, []);

  const currentStationInfo = Array.isArray(stationInfo) ? stationInfo.find(info => info.SBWY_STNS_NM === station) : null;

  // 현재역(station)이 포함된 노선, 역리스트 찾기
  const foundLine = Object.entries(lines).find(([, list]) => list.includes(station));
  const currentLineName = foundLine ? foundLine[0] : undefined;
  const stationList = foundLine ? foundLine[1] : undefined;
  if (!stationList) {
    return <p> ⚠️ "{station}" 역을 찾을 수 없습니다. </p>
  }

  // 현재역의 index, 이전/다음역 찾기
  const currentIndex = stationList.indexOf(station);
  const prevStation = currentIndex > 0 ? stationList[currentIndex - 1] : null;
  const nextStation = currentIndex < stationList.length - 1 ? stationList[currentIndex + 1] : null;

  // 노선 번호 표시용 특수문자
  // TODO : 시간되면 특수문자 말고 div로 자동설정되기 수정
  const lineSymbolMap = {
    line1List: "➊",
    line2List: "➋",
    line3List: "➌",
    line4List: "➍",
    line5List: "➎",
    line6List: "➏",
    line7List: "➐",
    line8List: "➑",
    line9List: "➒",
  }
    // 객체에서 특정 키에 해당하는 값을 꺼내는 문법
  const lineSymbol = lineSymbolMap[currentLineName] || "";

  const MovePrevStation = () => {
    if(prevStation) navigate(`/linesdetail/${lineId}/details/${prevStation}`);
  }
  const MoveNextStation = () => {
    if(prevStation) navigate(`/linesdetail/${lineId}/details/${nextStation}`);
  }

  return (
    <>
      <div className="detail-container">

        {/* 이전역-현재역-다음역 표시 */}
        <div className='next-station-container' >
          {/* <div className="prev-station left"><p>〈 종각</p></div> */}
          {/* <div className="next-station right"><p>서울역 〉</p></div> */}
          <div className="prev-station left" onClick={MovePrevStation} ><p>〈 {prevStation || ""}</p></div>
          <div className="next-station right" onClick={MoveNextStation} ><p>{nextStation || ""} 〉</p></div>
        </div>
        {/* <div className="now-station"><span className='line-num' >➊</span><span>시청</span></div> */}
        <div className="now-station"><span className='line-num' >{lineSymbol}</span><span>{station}</span></div>

        {/* 도착정보 */}
        <div>
          <div className="arrival-title">
            <p>도착 정보</p>
          </div>
          <div className="arrival-container">
            <div>
              <div className="arrival-direction">
                <p>연천 방면</p>
              </div>
              <div className="arrival-info">
                <div className="arrival-info-1">
                  <span>광운대</span>
                  <span>6분</span>
                </div>
                <div className="arrival-info-2">
                  <span>청량리</span>
                  <span>12분</span>
                </div>
              </div>
            </div>
            <div>
              <div className="arrival-direction">
                <p>인천,신창 방면</p>
              </div>
              <div className="arrival-info">
                <div className="arrival-info-1">
                  <span>신창</span>
                  <span>3분</span>
                </div>
                <div className="arrival-info-1">
                  <span>서동탄</span>
                  <span>6분</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <div>
          <div className="arrival-title">
            <p>도착 정보</p>
          </div>
          <div className="arrival-container">
            {Object.keys(groupedArrival).length > 0 ? (
              Object.entries(groupedArrival).map(([direction, trains]) => (
                <div key={direction}>
                  <div className="arrival-direction">
                    <p>{direction}</p>
                  </div>
                  <div className="arrival-info">
                    {trains[0] ? (
                      <div className="arrival-info-1">
                        <span>{trains[0].bstatnNm}</span>
                        <span>{formatSecondsToMinutes(trains[0].barvlDt)}</span>
                      </div>
                    ) : (
                      <div className="arrival-info-1">
                        <span>-</span>
                        <span>-</span>
                      </div>
                    )}
                    {trains[1] ? (
                      <div className="arrival-info-2">
                        <span>{trains[1].bstatnNm}</span>
                        <span>{formatSecondsToMinutes(trains[1].barvlDt)}</span>
                      </div>
                    ) : (
                      <div className="arrival-info-2">
                        <span>-</span>
                        <span>-</span>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: "center", color: "gray" }}>도착 정보 없음</p>
            )}
          </div>
        </div> */}
        
        {/* 편의시설 유무 */}
        <div>
          <div className="convenience-title">
            <p>편의시설</p>
          </div>
          <div className="convenience-container">
            <div className="convenience-info">
              <img src={getConvenienceInfo("EL").iconSrc} alt="엘리베이터" />
              <p style={{color: getConvenienceInfo("EL").textColor}}>엘리베이터</p>
            </div>
            <div className="convenience-info">
              <img src={getConvenienceInfo("FDROOM").iconSrc} alt="수유실" />
              <p style={{color: getConvenienceInfo("FDROOM").textColor}}>수유실</p>
            </div>
            <div className="convenience-info">
              <img src={getConvenienceInfo("PARKING").iconSrc} alt="환승주차장" />
              <p style={{color: getConvenienceInfo("PARKING").textColor}}>환승주차장</p>
            </div>
            <div className="convenience-info">
              {/* TODO : 공공api에 자전거보관소(BICYCLE) 값이 모두 빈칸"" */}
              {/* <img src={getConvenienceInfo("BICYCLE").iconSrc} alt="자전거보관소" />
              <p style={{color: getConvenienceInfo("BICYCLE").textColor}}>자전거보관소</p> */}
              <img src={`/icons/bicycleshed-icon-y.svg`} alt="자전거보관소" />
              <p>자전거보관소</p>
            </div>
            <div className="convenience-info">
              <img src={getConvenienceInfo("WL").iconSrc} alt="휠체어리프트" />
              <p style={{color: getConvenienceInfo("WL").textColor}}>휠체어리프트</p>
            </div>
          </div>
        </div>

        {/* 역 정보(주소, 전화번호) */}
        <div>
          <div className="station-info-title">
            <p>역 정보</p>
          </div>
          <div className="station-info-container">
            <div className="station-info-addr">
              <p className='color-gray' >주소</p>
              {/* <p>서울특별시 중구 세종대로 지하2(남대문로 5가)</p> */}
              <p>{currentStationInfo?.ROAD_NM_ADDR || "정보 없음"}</p>
            </div>
            <div className="station-info-tel">
              <p className='color-gray' >전화번호</p>
              {/* <p>02-6110-1331</p> */}
              <p>{currentStationInfo?.TELNO || "정보 없음"}</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Detail;