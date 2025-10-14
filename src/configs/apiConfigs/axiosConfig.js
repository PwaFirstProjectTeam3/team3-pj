const axiosConfig = {
  SEARCH_BASE_URL: 'http://openapi.seoul.go.kr:8088',
  DETAIL_BASE_URL: 'http://swopenAPI.seoul.go.kr/api/subway',
  KEY: '65534f666b73756e3932595350767a',
  TYPE: 'json',
  SEARCH_SERVICE: 'SmrtEmergerncyGuideImg',
  ARRIVAL_INFO_SERVICE: 'realtimeStationArrival/ALL',
  CONVENIENCE_SERVICE: 'TbSeoulmetroStConve', // SEARCH_BASE_URL 사용
  STATION_INFO_SERVICE: 'StationAdresTelno', // SEARCH_BASE_URL 사용
  START_INDEX: 1,
  END_INDEX: 500,
}

export default axiosConfig;