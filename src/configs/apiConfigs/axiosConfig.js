const axiosConfig = {
  EVACUATION_BASE_URL: 'http://openapi.seoul.go.kr:8088',
  DETAIL_BASE_URL: 'http://swopenAPI.seoul.go.kr/api/subway',
  SEARCH_BASE_URL: 'http://openAPI.seoul.go.kr:8088',
  KEY: '65534f666b73756e3932595350767a',
  TYPE: 'json',
  EVACUATION_SERVICE: 'SmrtEmergerncyGuideImg',
  ARRIVAL_INFO_SERVICE: 'realtimeStationArrival/ALL',
  CONVENIENCE_SERVICE: 'TbSeoulmetroStConve', // EVACUATION_BASE_URL 사용
  STATION_INFO_SERVICE: 'StationAdresTelno', // EVACUATION_BASE_URL 사용
  SEARCH_SERVICE: 'SearchInfoBySubwayNameService',
  START_INDEX: 1,
  END_INDEX: 850,
}

export default axiosConfig;