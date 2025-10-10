import './SearchIndex.css';

function SearchIndex() {

  return (
    <>
      <div className="search-container">
        <div className='search-box'>
          <input className='departure-station' type="text" placeholder='출발지' />
          <button className='reverse-btn' type="button">
            <img src="/btn/reverse-btn.svg" alt="출발지와 도착지 교환 기능" />
          </button>
          <input className='arrival-station' type="text" placeholder='도착지' />
          <div className='search-btns'>
            <button className='reset-btn' type="button">리셋</button>
            <button className='search-btn' type="button">길찾기</button>
          </div>
        </div>
        <div className='search-card-container'>
          <div className="card">
            <p className='card-running-time'>16분</p>
            <p className='card-content-group'>최단시간</p>
            <p className='card-process'>6개역 환승 2회</p>
            <div className='card-route-container'>
              <div className='card-estimated-time-container'>
                <p className='card-estimated-time'>09:53</p>
                <p className='card-estimated-time'>09:56</p>
                <p className='card-estimated-time'>10:07</p>
                <p className='card-estimated-time'>10:09</p>
              </div>
              <div className='card-route-map'>
                <div className='card-route-group'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='card-route-group'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='card-route-group'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='card-route-group'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
              </div>
              <div className='card-current-station'>
                <div>
                  <p className='card-line-number'>6</p>
                  <p className='card-station-name'>망원역</p>
                </div>
                <div>
                  <p className='card-line-number'>2</p>
                  <p className='card-station-name'>합정역</p>
                </div>
                <div>
                  <p className='card-line-number'>1</p>
                  <p className='card-station-name'>신도림역</p>
                </div>
                <div>
                  <p className='card-line-number'>1</p>
                  <p className='card-station-name'>구로역</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default SearchIndex;