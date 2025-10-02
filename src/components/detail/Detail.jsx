import './Detail.css';

function Detail() {
  return (
    <>
      <div className="container">
        <div className="station-container">
          <div className="next-station left"><p>〈 종각</p></div>
          <div className="now-station"><span className='line-num' >➊</span><span>시청</span></div>
          <div className="next-station right"><p>서울역 〉</p></div>
        </div>

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
                <span>광운대</span>
                <span>6분</span>
                <span>청량리</span>
                <span>12분</span>
              </div>
            </div>
            <div>
              <div className="arrival-direction">
                <p>인천,신창 방면</p>
              </div>
              <div className="arrival-info">
                <span>신창</span>
                <span>3분</span>
                <span>서동탄</span>
                <span>6분</span>
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
              <p>서울 중구 서소문로 127</p>
            </div>
            <div className="station-info-tel">
              <p className='color-gray' >전화번호</p>
              <p>02-6110-2011</p>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Detail;