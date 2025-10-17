import { useEffect, useRef, useState } from 'react';
import './SearchIndex.css';
import { useDispatch, useSelector } from 'react-redux';
import { setArrivalStationFrCord, setArrivalStationId, setDepartureStationFrCord, setDepartureStationId } from '../../store/slices/searchSlice';
import { searchIndex } from '../../store/thunks/searchThunk';

function SearchIndex() {
  const dispatch = useDispatch();

  const departureRef = useRef(null);
  const arrivalRef = useRef(null);

  const searchStationList = useSelector(state => state.search.list);
  const searchDepartureStationId = useSelector(state => state.search.departureStationId);
  const searchArrivalStationId = useSelector(state => state.search.arrivalStationId);
  const searchDepartureStationFrCord = useSelector(state => state.search.departureStationFrCord);
  const searchArrivalStationFrCord = useSelector(state => state.search.arrivalStationFrCord);

  const [departureInputValue, setDepartureInputValue] = useState(""); // 출발지 input에 입력된 역 명
  const [arrivalInputValue, setArrivalInputValue] = useState(""); // 도착지 input에 입력된 역 명
  const [activeField, setActiveField] = useState(null); // 출발지, 도착지 검색창 중 어떤 것이 활성화 되어있는지
 
  // 드롭다운 열기
  const searchOpenDropdown = (field) => {
    setActiveField(field); // 어떤 input이 활성화 되었는지
  };
  
  // 드롭다운 닫기
  function searchCloseDropdown() {
    setActiveField(null);
  }
  
  // 드롭다운 아이템 클릭 시 input에 값 넣고 드랍다운 닫기
  function handleSearchSelectStation(station) {
    if (activeField === "departure") {
      setDepartureInputValue(station.STATION_NM);
      dispatch(setDepartureStationId(station.STATION_CD));
      dispatch(setDepartureStationFrCord(station.FR_CODE));
    } else if (activeField === "arrival") {
      setArrivalInputValue(station.STATION_NM);
      dispatch(setArrivalStationId(station.STATION_CD));
      dispatch(setArrivalStationFrCord(station.FR_CODE));
    }
    searchCloseDropdown();
  }
  
  // input 클릭 시 입력값 초기화 및 드랍박스 오픈
  // 출발지
  function handleDepartureInputValuereset() {
    setDepartureInputValue('');
    searchOpenDropdown("departure");
  }
  // 도착지
  function handleArrivalInputValuereset() {
    setArrivalInputValue('');
    searchOpenDropdown("arrival");
  }
  
  // 드롭다운 렌더링 함수
  const renderDropdown = (stations) => {
    return stations.map(station => {
      // 중복 역 정보 가져오기
      const duplicationStation = searchStationList.filter(s => s.STATION_NM === station.STATION_NM).length > 1;

      // LINE_NUM 화면용 포맷: "01호선" → "1호선"
      const displayLineNum = station.LINE_NUM.replace(/^0/, '');

      // 각 매칭 객체를 <li>로 반환
      return (
        <li
          key={station.STATION_CD}
          onClick={() => handleSearchSelectStation(station)}
          onMouseDown={e => e.preventDefault()}
        >
          <div className='dropdown-station-info'>
            <span>{station.STATION_NM}</span>
            <span className='dropdown-station-frcord'>{`(${station.FR_CODE})`}</span>
          </div>
          {duplicationStation && <span className="dropdown-station-line">{displayLineNum}</span>}
        </li>
      );
    });
  };

  // 역 이름 입력 시 상태 갱신
  function handleSearchInputChange(e, field) {
    if (field === "departure") {
      setDepartureInputValue(e.target.value);
    } else {
      setArrivalInputValue(e.target.value);
      searchOpenDropdown(field);
    }
  }
  
  // 입력값 기반 실시간 필터링
  const searchFilteredStations = activeField
  ? searchStationList
      .filter(station => {
        const searchInputValue = activeField === "departure" ? departureInputValue : arrivalInputValue;
        return station.STATION_NM.toLowerCase().includes(searchInputValue.toLowerCase());
      })
      .filter(station => /^0[1-9]호선/.test(station.LINE_NUM)) // LINE_NUM이 1호선~9호선만 통과
      .sort(function(a, b) {
        return a.STATION_NM.localeCompare(
          b.STATION_NM,       // 비교할 문자열
          'ko',               // 한국어 기준
          { sensitivity: 'base' } // 대소문자 구분 없이
        );
      }) // 드랍다운 목록 가나다순으로 정렬 처리
  : [];
  
  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    dispatch(searchIndex());

    function handleSearchClickOutside(event) {
      if (departureRef.current && !departureRef.current.contains(event.target) && arrivalRef.current && !arrivalRef.current.contains(event.target)) {
        searchCloseDropdown();
      }
    }
    document.addEventListener("mousedown", handleSearchClickOutside);
    return () => document.removeEventListener("mousedown", handleSearchClickOutside);
  }, []);

  // 리버스 버튼
  function reverseBtn() {
    if(departureInputValue && arrivalInputValue) {
      setDepartureInputValue(arrivalInputValue);
      setArrivalInputValue(departureInputValue);
      dispatch(setDepartureStationId(searchArrivalStationId));
      dispatch(setArrivalStationId(searchDepartureStationId));
      dispatch(setDepartureStationFrCord(searchArrivalStationFrCord));
      dispatch(setArrivalStationFrCord(searchDepartureStationFrCord));
    }
  }

  // 리셋 버튼
  function resetBtn() {
    if(departureInputValue || arrivalInputValue) {
      setDepartureInputValue("");
      setArrivalInputValue("");
      dispatch(setDepartureStationId(''));
      dispatch(setArrivalStationId(''));
      dispatch(setDepartureStationFrCord(''));
      dispatch(setArrivalStationFrCord(''));
    }
  }

  return (
    <>
      <div className="search-container">
        <div className='search-box'>
          <div className='search-departure-station' ref={departureRef}>
            <input className='departure-station'
              value={departureInputValue}
              onChange={e => handleSearchInputChange(e, "departure")}
              onFocus={() => searchOpenDropdown("departure")}
              onClick={handleDepartureInputValuereset}
              autoComplete='off' // 브라우저 기본 자동완성 기능 끄기
              type="text" placeholder='출발지'
            />
            {activeField === "departure" && searchFilteredStations.length > 0 && (
              <ul className="search-dropdown">
                {renderDropdown(searchFilteredStations)}
              </ul>
            )}
          </div>
          <button className='reverse-btn' onClick={reverseBtn} type="button">
            <img src="/btn/reverse-btn.svg" alt="출발지와 도착지 교환 기능" />
          </button>
          <div className='search-arrival-station' ref={arrivalRef}>
            <input className='arrival-station'
              value={arrivalInputValue}
              onChange={e => handleSearchInputChange(e, "arrival")}
              onFocus={() => searchOpenDropdown("arrival")}
              onClick={handleArrivalInputValuereset}
              autoComplete='off' // 브라우저 기본 자동완성 기능 끄기
              type="text" placeholder='도착지'
            />
            {activeField === "arrival" && searchFilteredStations.length > 0 && (
              <ul className="search-dropdown">
                {renderDropdown(searchFilteredStations)}
              </ul>
            )}
          </div>
          <div className='search-btns'>
            <button className='reset-btn' onClick={resetBtn} type="button">리셋</button>
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