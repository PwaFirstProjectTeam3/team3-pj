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
    totalTime: 0,
    lineNum: '',
    countStationNum: 0,
    parsedData: [], // 파싱 결과(객체) 저장용
    // sKind: '1',

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
    setTotalTime: (state, action) => {
      state.totalTime = action.payload;
    },
    setLineNum: (state, action) => {
      state.lineNum = action.payload;
    },
    setCountStationNum: (state) => {
      state.countStationNum += 1;
    },
    clearPathList: (state) => {
      state.startStation = '';
      state.endStation = '';
      state.totalTime = 0;
      state.lineNum = '';
      state.countStationNum = 0;
    }
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
        state.parsedRoute = null;
        state.meta = null;
      })
      .addCase(getSearchRoute.fulfilled, (state, action) => {
        state.rawXML = action.payload?.rawXML || '';
        state.meta = action.payload?.meta || null;
        state.parsedData = [parseXMLResponse(action.payload?.rawXML)];

        // runTime 존재 여부 체크
        state.parsedData.map((parsedData) => {
          if(parsedData.runTime) {
            if (parsedData.startStation === '') {
              
            }
            setEndStation(state.endStation.trim());
            setCountStationNum();
            setLineNum();
            setTotalTime();
          } else {
            const 
          }

        })


        // try {
        //   const parsed = parseXMLResponse(state.rawXML);
        //   state.parsedRoute = enrichWithBaseTime(parsed, new Date());
        // } catch {
        //   state.parsedRoute = null;
        // }

      })
      .addCase(getSearchRoute.rejected, (state, action) => {
        console.error('요청 실패', action.error);
      });
    }
  });
  
export const {
  setStartStationId,
  setEndStationId,
  setStartStation,
  setEndStation,
  setSKind,
  // swapStations,
  clearRoute
} = searchRouteSlice.actions;

export default searchRouteSlice.reducer;