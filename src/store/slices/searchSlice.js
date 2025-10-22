import { createSlice } from "@reduxjs/toolkit";
import { searchIndex } from "../thunks/searchThunk.js";
import { getSearchRoute } from "../thunks/searchRouteThunk.js";
import { parseXMLResponse } from "../../components/utils/xmlMetroParser.js";
import dayjs from 'dayjs';

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    list: [],
    departureStationId: '',
    arrivalStationId: '',
    departureStationFrCord: '',
    arrivalStationFrCord: '',
    sKind: '1', // 경로 탐색 기준

    // 길찾기 출력 스테이트
    totalTransferCnt: 0,
    totalStationCnt: 0,
    totalTime: '0',
    resultData: [],
  },
  reducers: {
    setDepartureStationId: (state, action) => {
      state.departureStationId = action.payload;
    },
    setArrivalStationId: (state, action) => {
      state.arrivalStationId = action.payload;
    },
    setDepartureStationFrCord: (state, action) => {
      state.departureStationFrCord = action.payload;
    },
    setArrivalStationFrCord: (state, action) => {
      state.arrivalStationFrCord = action.payload;
    },
    setDepartureStation: (state, action) => {
      state.departureStation = action.payload;
    },
    setArrivalStation: (state, action) => {
      state.arrivalStation = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchIndex.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getSearchRoute.fulfilled, (state, action) => {
        const parsedXMLResponse = parseXMLResponse(action.payload?.rawXML);

        // 변수 선언
        let totalStationCnt = 0;
        let totalTransferCnt = parsedXMLResponse.transferList.length;
        let transferStationName = '';
        let transferStationLine = '';
        let transferStationTime = null;
        let totalTime = dayjs();
        const result = [];

        function formatMinuteToHour(stringMinutes) {
          const minutes = parseInt(stringMinutes, 10)
          const hours = Math.floor(minutes / 60);
          const remain = minutes % 60;

          if(hours > 0 && remain > 0) {
            return `${hours}시간 ${remain}분`;
          } else if(hours > 0 && remain === 0) {
            return `${hours}시간`;
          } else {
            return `${remain}분`;
          }
        }
        
        for (const item of parsedXMLResponse.pathList) {
          if(!transferStationName) {
            transferStationName = item.startStation;
            transferStationLine = item.line;
            transferStationTime = totalTime.clone();
          }
        
          // 환승역인지 확인
          if(item.runTime) {
            totalStationCnt++;
            const [minute, second] = item.runTime.split(':');
            totalTime = totalTime.add(parseInt(minute), 'minute').add(parseInt(second), 'second');
          } else {
            // result 만들기
            result.push({
              transferStationName,
              transferStationLine,
              transferStationTime: transferStationTime.format('HH:mm'),
            });
        
            // 아이템 추가 후 초기화
            transferStationName = '';
            transferStationLine = '';
            transferStationTime = null;
          }
        }
        
        // 마지막 아이템 result 추가
        result.push({
          transferStationName,
          transferStationLine,
          transferStationTime: transferStationTime.format('HH:mm'),
        });

        // 스테이트에 저장
        state.totalTransferCnt = totalTransferCnt;
        state.totalStationCnt = totalStationCnt;
        state.totalTime = formatMinuteToHour(parsedXMLResponse.totalTime);
        state.resultData = result;
      })
      .addMatcher(
        action => action.type.startsWith('searchSlice/') && action.type.endsWith('/rejected'),
        (state, action) => {
          console.error('searchSlice Error', action.payload, action.error);
        }
      )
    }
})

export const {
  setDepartureStationId,
  setDepartureStationFrCord,
  setArrivalStationId,
  setArrivalStationFrCord,
  setDepartureStation,
  setArrivalStation,
} = searchSlice.actions;

export default searchSlice.reducer;