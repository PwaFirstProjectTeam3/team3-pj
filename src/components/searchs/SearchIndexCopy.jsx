import { useEffect, useMemo, useRef, useState } from 'react';
import './SearchIndex.css';
import { ANNOTATION_VER_ROUTE_DISPLAY } from '../../configs/line-list-configs/subwayLinesRouteConfig';
import { useDispatch, useSelector } from 'react-redux';
import getSearchRoute from '../../store/thunks/searchRouteThunk';
import { setEndStation, setStartStation } from '../../store/slices/searchRouteSlice';
import stationIdMap from '../../configs/stationIdMap.json';

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

/** 길찾기 버튼 핸들러 */
function handleSearchClick() {
  const dep = departureInputValue.trim();
  const arr = arrivalInputValue.trim();

  // 1) 비어있는지 체크
  if (!dep || !arr) {
    // 필요 시 토스트/알럿으로 바꿔도 됨
    console.warn("출발지/도착지를 입력하세요.");
    return;
  }

  // 2) 존재하는 역인지 체크
  const depId = stationIdMap?.[dep];
  const arrId = stationIdMap?.[arr];
  if (!depId || !arrId) {
    console.warn("존재하지 않는 역명이에요. 자동완성 목록에서 선택해주세요.");
    return;
  }

  // 3) 드롭다운 닫기
  searchCloseDropdown();

  // 4) 슬라이스에 상태 반영
  if (typeof dispatch === "function") {
    // A) name/id를 따로 받는 액션인 경우
    dispatch(setStartStation({ id: depId, name: dep }));
    dispatch(setEndStation({ id: arrId, name: arr }));
  }
}

  /**
 * 라벨 매핑 (searchType)
 * 1: 최단시간, 2: 최소환승, 3: 최소요금
 */
const LABEL_BY_TYPE = {
  1: "최단시간",
  2: "최소환승",
  3: "최소요금",
};

/** 시간 포맷터: Date -> "HH:mm" */
function toHHmm(date) {
  const hh = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * route.pathList 기반 타임라인 구성기
 * 각 구간의 runTime(분)을 누적하여 시각(HH:mm)과 역명을 생성
 */
function buildTimeline(route, base = new Date()) {
  if (!route?.pathList || route.pathList.length === 0) return [];

  let accMin = 0; // 누적 분
  const rows = [];

  // 각 path 구간의 시작역을 먼저 찍고, 마지막에 최종 도착역 추가
  route.pathList.forEach((seg, idx) => {
    // 시작역 시각
    const depart = new Date(base.getTime() + accMin * 60 * 1000);
    rows.push({
      time: toHHmm(depart),
      lineNumber: seg.line?.replace(/[^0-9]/g, "") || "",
      stationName: seg.startStation || "",
    });

    // 구간 이동
    const dur = Number.parseInt(String(seg.runTime).replace(/[^0-9-]/g, ""), 10) || 0;
    accMin += dur;

    // 마지막 path의 끝역은 루프 밖에서 한 번만 추가하도록 함
    if (idx === route.pathList.length - 1) {
      const arrive = new Date(base.getTime() + accMin * 60 * 1000);
      rows.push({
        time: toHHmm(arrive),
        lineNumber: seg.line?.replace(/[^0-9]/g, "") || "",
        stationName: seg.endStation || "",
      });
    }
  });

  return rows;
}

  const dispatch = useDispatch();

  // 출발/도착 선택 상태 (searchIndex 같은 슬라이스를 사용한다고 가정)
  const { startStationId, endStationId, startStation, endStation } = useSelector(
    (s) => s.searchIndex || {}
  );

  /**
   * 검색 결과 상태 (searchRouteSlice 구조 가정)
   * - byType: { 1: route, 2: route, 3: route }
   * - loadingByType: { 1: boolean, 2: boolean, 3: boolean }
   * - errorByType: { 1: string|null, 2: string|null, 3: string|null }
   */
  const {
    byType = {},
    loadingByType = {},
    errorByType = {},
    lastQueried = null,
  } = useSelector((s) => s.searchRoute || {});

  // 의존성이 모두 갖춰지면 3종 검색(1/2/3)을 즉시 디스패치
  useEffect(() => {
    if (!startStationId || !endStationId) return;

    // 이미 같은 출발/도착으로 조회했다면 중복 호출 방지 (slice에서 기억한다고 가정)
    const key = `${startStationId}-${endStationId}`;
    if (lastQueried === key) return;

    [1, 2, 3].forEach((searchType) => {
      dispatch(
        getSearchRoute({
          searchType,
          startStationId,
          endStationId,
          startStation,
          endStation,
        })
      );
    });
  }, [dispatch, startStationId, endStationId, startStation, endStation, lastQueried]);

  // 카드 정렬: 1,2,3 순서로 보여주자
  const cards = useMemo(() => [1, 2, 3].map((t) => ({ type: t, route: byType[t] })).filter((c) => !!c.route), [byType]);

  // 전체 로딩/에러 판단 (간단 합성)
  const isLoadingAny = [1, 2, 3].some((t) => loadingByType[t]);
  const firstError = [1, 2, 3].map((t) => errorByType[t]).find(Boolean);

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
            <button className='search-btn' type="button" onClick={handleSearchClick}>길찾기</button>
          </div>
        </div>

        <div className='search-card-container'>
          {isLoadingAny && (
            <div className="card skeleton">
              <p className="card-running-time">로딩 중...</p>
              <p className="card-content-group">경로 계산</p>
              <p className="card-process">잠시만 기다려주세요</p>
            </div>
          )}

          {firstError && !isLoadingAny && (
            <div className="card error">
              <p className="card-running-time">오류</p>
              <p className="card-content-group">경로 조회 실패</p>
              <p className="card-process">{firstError}</p>
            </div>
          )}

           {/* 결과 카드 */}
          {cards.map(({ type, route }) => {
            const label = LABEL_BY_TYPE[type] || "경로";
            const totalMin = Number(route?.totalTime ?? 0);
            const transferNum = Number(route?.transferNum ?? 0);

            // 역 수 계산: pathList가 있다면 (구간 수 + 1)로 추산
            const stationCount = Array.isArray(route?.pathList) && route.pathList.length > 0
              ? route.pathList.length + 1
              : Array.isArray(route?.stationChain) && route.stationChain.length > 0
              ? route.stationChain.length
              : 0;

            const timeline = buildTimeline(route);

              <div className="card" key={type}>
                <p className="card-running-time">{totalMin}분</p>
                <p className="card-content-group">{label}</p>
                <p className="card-process">{stationCount}개역 환승 {transferNum}회</p>

                <div className="card-route-container">
                  {timeline.map((row, idx) => (
                    <div className="route-group" key={`${type}-${idx}`}>
                      <p className="estimated-time">{row.time}</p>

                      <div className="route-map">
                        <div className="search-circle" />
                        {/* 마지막 아이템은 라인 숨김 (연결선 끊기 방지 시 CSS에서 :last-child 처리 가능) */}
                        {idx < timeline.length - 1 && <div className="search-line" />}
                      </div>

                      <div className="apply-station">
                        <p className="search-line-number">{row.lineNumber}</p>
                        <p className="station-name">{row.stationName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
          })}
        </div>
      </div>
    </>
  );
}

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
          </div>
        </div>
      </div>
    </>
  )
} */}

export default SearchIndex;