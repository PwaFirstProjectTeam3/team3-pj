import { useEffect, useRef, useState } from 'react';
import './SearchIndex.css';
import { ANNOTATION_VER_ROUTE_DISPLAY } from '../../configs/line-list-configs/subwayLinesRouteConfig';
import { useSelector } from 'react-redux';

// 역 이름 → 호선 맵 생성
const stationMap = (() => {
  const map = {};
  Object.entries(ANNOTATION_VER_ROUTE_DISPLAY).forEach(([line, stations]) => {
    stations.forEach(name => {
      if (!map[name]) map[name] = [];
      map[name].push(line);
    });
  });
  return map;
})();

// 자동완성 검색에 사용할 모든 역 이름 배열
const searchStations = Object.keys(stationMap);

function SearchIndex() {
  const departureRef = useRef(null);
  const arrivalRef = useRef(null);

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
    if (activeField === "departure") setDepartureInputValue(station);
    else if (activeField === "arrival") setArrivalInputValue(station);
    searchCloseDropdown();
  }

  // input 클릭 시 입력값 초기화 및 드랍박스 오픈
  // 출발지
  function handleDepartureInputValuereset() {
    if (departureInputValue) {
      setDepartureInputValue('');

      searchOpenDropdown("departure");
    }
  }
  // 도착지
  function handleArrivalInputValuereset() {
    if (arrivalInputValue) {
      setArrivalInputValue('');

      searchOpenDropdown("arrival");
    }
  }

  // 역 이름 입력 시 상태 갱신
  function handleSearchInputChange(e, field) {
    if (field === "departure") setDepartureInputValue(e.target.value);
    else setArrivalInputValue(e.target.value);
    searchOpenDropdown(field);
  }

  // 입력값 기반 실시간 필터링
  const searchFilteredStations = activeField === "departure" ? searchStations.filter(station => station.includes(departureInputValue)) : activeField === "arrival" ? searchStations.filter(station => station.includes(arrivalInputValue)) : [];

  // 카드 출력 
  const parsedData = useSelector((state) => state.searchRoute.parsedRoutes || []);

  const sKindLabel = (sKind) => {
    const kind = String(sKind);
    if (k === '1') return '최단시간';
    if (k === '2') return '최소환승';
    if (k === '3') return '최소요금';
    return '경로';
  };

  // 노선 시각화에 쓰는 보조 로직들(파일 내부에만 존재)
  const buildNodes = (pathList) => {
    if (!pathList?.length) return [];
    const out = [pathList[0].startStation];
    for (const section of pathList) out.push(section.endStation);
    return out;
  };

  const buildMinutesByNode = (pathList) => {
    let acc = 0;
    const arr = [0]; // 시작역은 0분
    for (const section of pathList || []) {
      const raw = Number(section.runTime ?? 0);
      // runTime이 초 기준일 수도 있어 대략 분으로 보정(120초 이상이면 분으로 간주)
      const m = Math.round(raw >= 120 ? raw / 60 : raw);
      acc += m;
      arr.push(acc);
    }
    return arr;
  }

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {

    // station_nm 이 서울 .contains
    // const arr = stationData.DATA.filter(obj=>{
    //   console.log(obj.station_nm);
    //   return obj.station_nm.includes('서울');
    // })
    // console.log(arr);

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
    if (departureInputValue && arrivalInputValue) {
      setDepartureInputValue(arrivalInputValue);
      setArrivalInputValue(departureInputValue);
    }
  }

  // 리셋 버튼
  function resetBtn() {
    if (departureInputValue || arrivalInputValue) {
      setDepartureInputValue("");
      setArrivalInputValue("");
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
                {searchFilteredStations.map(station => (
                  stationMap[station].length > 1
                    ? stationMap[station].map(line => (
                      <li
                        key={`${station}-${line}`}
                        onClick={() => handleSearchSelectStation(station)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <span>{station}</span>
                        <span className="dropdown-station-line">{line}</span>
                      </li>
                    ))
                    : (
                      <li
                        key={station}
                        onClick={() => handleSearchSelectStation(station)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <span>{station}</span>
                      </li>
                    )
                ))}
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
                {searchFilteredStations.map(station => (
                  stationMap[station].length > 1
                    ? stationMap[station].map(line => (
                      <li
                        key={`${station}-${line}`}
                        onClick={() => handleSearchSelectStation(station)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <span>{station}</span>
                        <span className="dropdown-station-line">{line}</span>
                      </li>
                    ))
                    : (
                      <li
                        key={station}
                        onClick={() => handleSearchSelectStation(station)}
                        onMouseDown={e => e.preventDefault()}
                      >
                        <span>{station}</span>
                      </li>
                    )
                ))}
              </ul>
            )}
          </div>
          <div className='search-btns'>
            <button className='reset-btn' onClick={resetBtn} type="button">리셋</button>
            <button className='search-btn' type="button">길찾기</button>
          </div>
        </div>
        <div className="search-card-container">
        {parsedData.map((route, idx) => {
          const { totalTime, transferNum, pathList } = route;
          const nodes = buildNodes(pathList);
          const minutesByNode = buildMinutesByNode(pathList);

          // 상단 표시
          const totalMinutesText = `${totalTime}분`;
          const transferText = `${transferNum || 0}회 환승`;
          const stationCountText = `${Math.max((pathList?.length || 0), 1)}개역`;

          return (
            <div className="card" key={idx}>
              {/* 카드 상단 */}
              <p className="card-running-time">{totalMinutesText}</p>
              <p className="card-content-group">{sKindLabel(route.sKind)}</p>
              <p className="card-process">
                {stationCountText} {transferText}
              </p>

              {/* 노선 시각화 */}
              <div className="card-route-container">
                <div className="route-line">
                  {nodes.map((stationName, i) => (
                    <div className="route-group" key={`${stationName}-${i}`}>
                      {/* 좌측 누적 시간 */}
                      <p className="estimated-time">{minutesByNode[i]}분</p>

                      {/* 가운데 (원 + 선) */}
                      <div className="route-map">
                        <div className="search-circle" />
                        {i < nodes.length - 1 && <div className="search-line" />}
                      </div>

                      {/* 우측: 라인 번호/이름 + 역명 */}
                      <div className="apply-station">
                        <p className="search-line-number">
                          {i === 0
                            ? pathList?.[0]?.line || ''
                            : pathList?.[i - 1]?.line || ''}
                        </p>
                        <p className="station-name">{stationName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
          {/* <div className="card">
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
          </div> */}
        </div>
      </div>
    </>
  )
}

export default SearchIndex;