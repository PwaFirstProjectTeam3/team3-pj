import { createSlice } from "@reduxjs/toolkit";
import { getSearchRoute } from "../thunks/searchRouteThunk.js";
import { parseXMLResponse } from "../../components/utils/xmlMetroParser.js";
// import { enrichWithBaseTime, parseXMLResponse } from "../../components/utils/xmlMetroParser.js";

const searchRouteSlice = createSlice({
  name: 'searchRouteSlice',
  initialState : {
    startStationId: '',
    endStationId: '',
    startStation: '',
    endStation: '',

    parsedData: [], // 파싱 결과(객체) 저장용
    sKind: '1',

    // 결과/상태
    rawXML: '',
    meta: null,
  },
  reducers: {
    setStartStationId: (state, action) => {
      state.startStationId = action.payload;
    },
    setEndStationId: (state, action) => {
      state.endStationId = action.payload;
    },
    setStartStation: (state, action) => {
      state.startStation = action.payload;
    },
    setEndStation: (state, action) => {
      state.endStation = action.payload;
    },
    // setSKind: (state, action) => {
    //   state.sKind = String(action.payload ?? '1');
    // },
    // swapStations: (state) => {
    //   // 출발/도착 역 및 ID를 교환
    //   [state.startStationId, state.endStationId] = [state.endStationId, state.startStationId];
    //   [state.startStation, state.endStation] = [state.endStation, state.startStation];
    // },
    // clearRoute: (state) => {
    //   state.loading = false;
    //   state.error = null;
    //   state.rawXML = '';
    //   state.parsedRoute = null;
    //   state.meta = null;
    // }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchRoute.pending, (state) => {
        state.rawXML = '';
        state.parsedData = null;
        state.meta = null;
      })
      .addCase(getSearchRoute.fulfilled, (state, action) => {
        state.rawXML = action.payload?.rawXML || '';
        state.meta = action.payload?.meta || null;

        const parsedXMLResponse = parseXMLResponse(action.payload?.rawXML);
        const resultData = [];

        // 변수 선언
        let currentStartStation = '';
        let currentEndStation = '';
        let stationCount = 0;
        let currentLine = '';
        let totalRunTime = 0;

        const accumulationPush = () => {
          if (!currentStartStation || !currentEndStation || !currentLine) return; // 누적이 없으면 무시
          resultData.push({
            startStation: currentStartStation,
            endStation: currentEndStation,
            stationCount,
            line: currentLine,
            totalTime: totalRunTime,
          });
        };

        // runTime 존재 여부 체크
        parsedXMLResponse.forEach((parsedData) => {
          if(parsedData.runTime) {
            if (!currentStartStation) {
              currentStartStation = (parsedData.startStation ?? '').trim();
            }
            currentEndStation = (parsedData.endStation ?? '').trim();
            stationCount += 1;
            if (!currentLine) {
              currentLine = (parsedData.line ?? '').trim();
            }
            totalRunTime += parsedData.runTime;
          } else {
            // 누적된 값 저장
            accumulationPush();
            
            // 변수 초기화
            currentStartStation = '';
            currentEndStation = '';
            stationCount = 0;
            currentLine = '';
            totalRunTime = 0;
          }
        });

        accumulationPush();

        state.parsedData = resultData;
      })
      .addCase(getSearchRoute.rejected, (state, action) => {
        console.error('요청 실패', action.error);
      })
    }
  });
  
export const {
  setStartStationId,
  setEndStationId,
  setStartStation,
  setEndStation,
} = searchRouteSlice.actions;

export default searchRouteSlice.reducer;