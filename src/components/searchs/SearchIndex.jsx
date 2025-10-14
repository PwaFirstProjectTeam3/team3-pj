import { useDispatch, useSelector } from 'react-redux';
import './SearchIndex.css';
import { useEffect, useState } from 'react';
import { clearEndResults, clearStartResults, pickEndStation, pickStartStation, setEndStation, setStartStation } from '../../store/slices/searchIndexSlice.js';
import { searchIndexList } from '../../store/thunks/searchIndexListThunk.js';

function SearchIndex() {
  // 드랍다운 바깥 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.search-box')) {
        setShowStartDropdown(false)
        setShowEndDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const dispatch = useDispatch();
  const {
    startStation, endStation,
    startSearchResults, endSearchResults,
  } = useSelector(state => state.searchIndex);

  const [showStartDropdown, setShowStartDropdown] = useState(false);
  const [showEndDropdown, setShowEndDropdown] = useState(false);



  // 출발역 검색 핸들러
  const handleStartStationSearch = (e) => {
    const query = e.target.value;
    dispatch(setStartStation(query));

    if (query.trim().length > 0) {
      setShowStartDropdown(true);
      dispatch(searchIndexList({ field: 'start', query }));
    } else {
      setShowStartDropdown(false);
      dispatch(clearStartResults());
    }
  };
  // 도착역 검색 핸들러
  const handleEndStationSearch = (e) => {
    const query = e.target.value;
    dispatch(setEndStation(query));

    if (query.trim().length > 0) {
      setShowEndDropdown(true);
      dispatch(searchIndexList({ field: 'end', query }));
    } else {
      setShowEndDropdown(false);
      dispatch(clearEndResults());
    }
  };

  // 출발역 목록 클릭 핸들러
  const handleStartStationSelect = (station) => {
    dispatch(pickStartStation({
      name: station.station_nm,
      id: station.station_cd,
    }));
    setShowStartDropdown(false);
  };

  // 도착역 목록 클릭 핸들러
  const handleEndStationSelect = (station) => {
    dispatch(pickEndStation({
      name: station.station_nm,
      id: station.station_cd,
    }));
    setShowEndDropdown(false);
  };

  return (
    <>
      <div className="search-container">
        <div className='search-box'>
          <input className='departure-station' value={startStation} onChange={handleStartStationSearch} type="text" placeholder='출발지' />
          {showStartDropdown && (
            <ul className="start-dropdown">
              {startSearchResults.length > 0 && (
                startSearchResults.map((state) => (
                  <li
                    key={state.STATION_CD}
                    onClick={() => handleStartStationSelect(state)}
                  >
                    <span className="station-name">{state.STATION_NM}</span>
                    <span className="station-line">{state.LINE_NUM}</span>
                  </li>
                ))
              )}
            </ul>
          )}
          <button className='reverse-btn' type="button">
            <img src="/btn/reverse-btn.svg" alt="출발지와 도착지 교환 기능" />
          </button>
          <input className='arrival-station' value={endStation} onChange={handleEndStationSearch} type="text" placeholder='도착지' />
          {showEndDropdown && (
            <ul className="dropdown-end">
              {endSearchResults.length > 0 && (
                endSearchResults.map((state) => (
                  <li
                    key={state.STATION_CD}
                    onClick={() => handleEndStationSelect(state)}
                  >
                    <span className="station-name">{state.STATION_NM}</span>
                    <span className="station-line">{state.LINE_NUM}</span>
                  </li>
                ))
              )}
            </ul>
          )}
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
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
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
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
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
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
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
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
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
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
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
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>6</p>
                  <p className='station-name'>망원역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>09:56</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>2</p>
                  <p className='station-name'>합정역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:07</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
                  <p className='station-name'>신도림역</p>
                </div>
              </div>
              <div className='route-group'>
                <p className='estimated-time'>10:09</p>
                <div className='route-map'>
                  <div className='search-circle'></div>
                  <div className='search-line'></div>
                </div>
                <div className='apply-station'>
                  <p className='search-line-number'>1</p>
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