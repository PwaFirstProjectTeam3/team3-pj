const axiosConfig = {
  SEARCH_BASE_URL: 'http://openapi.seoul.go.kr:8088',
  DETAIL_BASE_URL: 'http://swopenAPI.seoul.go.kr/api/subway',
  KEY: '65534f666b73756e3932595350767a',
  TYPE: 'json',
  SEARCH_SERVICE: 'SmrtEmergerncyGuideImg',
  DETAIL_SERVICE: 'realtimeStationArrival/ALL',
  START_INDEX: 1,
  END_INDEX: 500,
}

export default axiosConfig;