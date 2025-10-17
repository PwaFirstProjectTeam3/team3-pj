import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const getSearchRoute = createAsyncThunk(
  'searchRouteSlice/getSearchRoute',
  async (arg, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      // const {
      //   startStationId, // 출발역 ID
      //   endStationId, // 도착역 ID
      //   startStation, // 출발역
      //   endStation, // 도착역
      //   sKind = '1', // 검색 종류 - 1: 최단시간, 2: 최소환승, 3: 최소요금 (예시)
      //   sTime = '', // 출발 시간
      //   weekTag = '', // 요일 태그
      //   isArrivalTimeSearch = '', // 도착 기준 검색 여부(옵션)
      //   stopId = '' // 경유역 ID
      // } = {
      //   ...(state.searchRoute || {}),
      //   ...(arg || {})
      // };

      const formData = new FormData()
      formData.append('departureId', state.startStationId) // 출발역 ID
      // formData.append('stopId', state.stopId) // 중간 경유역 ID
      formData.append('arrivalId', state.endStationId) // 도착역 ID
      formData.append('sKind', String(state.sKind)) // 검색 종류
      // formData.append('sTime', state.sTime) // 출발 시간
      // formData.append('weekTag', state.weekTag) // 요일 태그
      // formData.append('isArrivalTimeSearch', state.isArrivalTimeSearch) // 도착 시간 기준 검색 여부
      // formData.append('startStation', state.startStation) // 출발역명
      // formData.append('endStation', state.endStation) // 도착역명

      const response = await axios.post('/api/kr/getRouteSearchResult.do',
        formData,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'Accept': 'application/xml, text/xml, */*; q=0.01',
            'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
            'X-Requested-With': 'XMLHttpRequest'
          }
        }
      );

      if (!response.data || response.data.trim() === '') {
        // thunkAPI.rejectWithValue를 사용하여 에러 처리
        return thunkAPI.rejectWithValue('경로 정보를 찾을 수 없습니다. 역명을 다시 확인해주세요.');
      }

      return {
        rawXML: response.data, // 그대로 XML 문자열을 반환
        meta: { // 사용자가 검색했을 때 어떤 요청인지를 구분하기 위함
          sKind: String(state.sKind), // API는 보통 문자열을 받기 때문에 숫자로 들어가는 걸 방지
          startStation: state.startStation,
          endStation: state.endStation,
        }
      };

    } catch (err) {
      // 오류 메시지 정제
      const message =
        err?.response?.data?.message ||
        err?.message ||
        '지하철 경로 조회 중 오류가 발생했습니다.';
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export { getSearchRoute }