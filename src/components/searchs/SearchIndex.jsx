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
              <div className='route-group'>
                <p className='estimated-time'>09:53</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>구로역</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <p className='card-running-time'>16분</p>
            <p className='card-content-group'>최소환승</p>
            <p className='card-process'>6개역 환승 2회</p>
            <div className='card-route-container'>
              <div className='route-group'>
                <p className='estimated-time'>09:53</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>구로역</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <p className='card-running-time'>16분</p>
            <p className='card-content-group'>최소요금</p>
            <p className='card-process'>6개역 환승 2회</p>
            <div className='card-route-container'>
              <div className='route-group'>
                <p className='estimated-time'>09:53</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>구로역</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <p className='card-running-time'>16분</p>
            <p className='card-content-group'></p>
            <p className='card-process'>6개역 환승 2회</p>
            <div className='card-route-container'>
              <div className='route-group'>
                <p className='estimated-time'>09:53</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>구로역</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <p className='card-running-time'>16분</p>
            <p className='card-content-group'></p>
            <p className='card-process'>6개역 환승 2회</p>
            <div className='card-route-container'>
              <div className='route-group'>
                <p className='estimated-time'>09:53</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>구로역</p>
                </div>
              </div>
            </div>
          </div>
          <div className="card">
            <p className='card-running-time'>16분</p>
            <p className='card-content-group'></p>
            <p className='card-process'>6개역 환승 2회</p>
            <div className='card-route-container'>
              <div className='route-group'>
                <p className='estimated-time'>09:53</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='circle'></div>
                  <div className='line'></div>
                </div>
                <div className='apply-station'>
                  <p className='line-number'>1</p>
                  <p className='station-name'>구로역</p>
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