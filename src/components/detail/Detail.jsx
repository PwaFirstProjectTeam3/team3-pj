import { useDispatch, useSelector } from 'react-redux';
import './Detail.css';
// import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { stationInfoIndex } from '../../store/thunks/detailThunk';

function Detail() {
  const dispatch = useDispatch();

  // const station = useParams();
  const station = '경찰병원'; // TODO: 윤희님 호선정보-노선도 작업 완성되면 추가 작업 후 위의 useParams로 수정 변경해야 함
  const lines = useSelector((state) => state.detail.lines);
  const stationInfo = useSelector((state) => state.detail.stationInfo);
  
  // 역 정보 불러오기
  useEffect(() => {
    dispatch(stationInfoIndex());
  }, []);

  const currentStationInfo = Array.isArray(stationInfo) ? stationInfo.find(info => info.SBWY_STNS_NM === station) : null;

  // 현재역(station)이 포함된 노선 찾기
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

  return (
    <>
      <div className="detail-container">
          <div className='next-station-container' >
            {/* <div className="prev-station left"><p>〈 종각</p></div> */}
            {/* <div className="next-station right"><p>서울역 〉</p></div> */}
            <div className="prev-station left"><p>〈 {prevStation || "없음"}</p></div>
            <div className="next-station right"><p>{nextStation || "없음"} 〉</p></div>
          </div>
          {/* <div className="now-station"><span className='line-num' >➊</span><span>시청</span></div> */}
          <div className="now-station"><span className='line-num' >{lineSymbol}</span><span>{station}</span></div>

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
                <div className="arrival-info-1">
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
        
        <div>
          <div className="convenience-title">
            <p>편의시설</p>
          </div>
          <div className="convenience-container">
            <div className="convenience-info">
              <img src="/icons/elevator-icon-y.svg" alt="" />
              <p>엘리베이터</p>
            </div>
            <div className="convenience-info">
              <img src="/icons/nursingroom-icon-y.svg" alt="" />
              <p>수유실</p>
            </div>
            <div className="convenience-info">
              <img src="/icons/parking-icon-y.svg" alt="" />
              <p>환승주차장</p>
            </div>
            <div className="convenience-info">
              <img src="/icons/bicycleshed-icon-y.svg" alt="" />
              <p>자전거보관소</p>
            </div>
            <div className="convenience-info">
              <img src="/icons/wheelchairlift-icon-y.svg" alt="" />
              <p>휠체어리프트</p>
            </div>
          </div>
        </div>

        <div>
          <div className="station-info-title">
            <p>역 정보</p>
          </div>
          <div className="station-info-container">
            <div className="station-info-addr">
              <p className='color-gray' >주소</p>
              {/* <p>서울특별시 중구 세종대로 지하2(남대문로 5가)</p> */}
              <p>서울특별시 송파구 송파대로 지하257(가락동)</p>
            </div>
            <div className="station-info-tel">
              <p className='color-gray' >전화번호</p>
              <p>02-6110-3501</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Detail;