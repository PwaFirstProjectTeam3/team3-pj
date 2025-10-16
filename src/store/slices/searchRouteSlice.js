import { createSlice } from "@reduxjs/toolkit";
import { getSearchRoute } from "../thunks/searchRouteThunk.js";
import { enrichWithBaseTime, parseXMLResponse } from "../../components/utils/xmlMetroParser.js";

const searchRouteSlice = createSlice({
  name: 'searchRouteSlice',
  initialState : {
    startStationItem: null,
    endStationItem: null,
    startStationId: '',
    endStationId: '',
    startStation: '',
    endStation: '',
    sKind: '1',

    // 결과/상태
    loading: false,
    error: null,
    rawXML: '',
    parsedRoute: null, // 파싱 결과(객체) 저장용
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
    setStopId: (state, action) => {
      state.stopId = action.payload;
    },
    setSKind: (state, action) => {
      state.sKind = String(action.payload ?? '1');
    },
    setSTime: (state, action) => {
      state.sTime = action.payload ?? '';
    },
    setWeekTag: (state, action) => {
      state.weekTag = action.payload ?? '';
    },
    setIsArrivalTimeSearch: (state, action) => {
      state.isArrivalTimeSearch = action.payload ?? '';
    },
    // swapStations: (state) => {
    //   // 출발/도착 역 및 ID를 교환
    //   [state.startStationId, state.endStationId] = [state.endStationId, state.startStationId];
    //   [state.startStation, state.endStation] = [state.endStation, state.startStation];
    // },
    clearRoute: (state) => {
      state.loading = false;
      state.error = null;
      state.rawXML = '';
      state.parsedRoute = null;
      state.meta = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchRoute.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.rawXML = '';
        state.parsedRoute = null;
        state.meta = null;
      })
      .addCase(getSearchRoute.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.rawXML = action.payload?.rawXML || '';
        state.meta = action.payload?.meta || null;

        try {
          const parsed = parseXMLResponse(state.rawXML);
          state.parsedRoute = enrichWithBaseTime(parsed, new Date());
        } catch {
          state.parsedRoute = null;
        }
      })
      .addCase(getSearchRoute.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || '요청 실패';
      });
  }
});

export const {
  setStartStationId,
  setEndStationId,
  setStartStation,
  setEndStation,
  setStopId,
  setSKind,
  setSTime,
  setWeekTag,
  setIsArrivalTimeSearch,
  // swapStations,
  clearRoute
} = searchRouteSlice.actions;

export default searchRouteSlice.reducer;