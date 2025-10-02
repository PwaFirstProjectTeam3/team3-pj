import './RouteSearch.css';

function RouteSearch() {

  return(
    <>
      <div className="route-container">
        <form action="" className='path-search-box'>
          <input type="search" placeholder='출발역'/>
          <input type="search" placeholder='도착역'/>
          <button type="reset">리셋</button>
          <button type="submit">길찾기</button>
        </form>

        <div className="route-card">
          <div className="route-summary">
            <h2 className='time-taken'>16분 <span className='shortest-time'>최단시간</span></h2>
            <p>6개역 환승 2회</p>
          </div>

          <ul className="route-list">
            <li className="route-item">
              <p className="route-arrival-time">09:53</p>
              <div className="route-line">
                <span class="line-top"></span>
                <span class="line-circle"></span>
                <span class="line-bottom"></span>
              </div>
              <p className="route-station-name">망원역</p>
            </li>

            <li className="route-item">
              <p className="route-arrival-time">09:53</p>
              <div className="route-line">
                <span className="line-circle"></span>
                <span className="connector-line"></span>
              </div>
              <p className="route-station-name">망원역</p>
            </li>

            <li className="route-item">
              <p className="route-arrival-time">09:53</p>
              <div className="route-line">
                <span className="line-circle"></span>
                <span className="connector-line"></span>
              </div>
              <p className="route-station-name">망원역</p>
            </li>

          </ul>
        </div>
      </div>
    </>
  )
}

export default RouteSearch;