import { createSlice } from "@reduxjs/toolkit";
import { localStorageUtil } from "../../utils/localStorageUtil";
import { fetchSubwayLineStations } from "../thunks/subwayLinesThunk";

const initialList = (() => {
  try {
    const v = localStorageUtil?.getSeoulLines?.();
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
})(); 

const subwayLinesSlice = createSlice({
  name: "subwayLines",
  initialState: {
    list: initialList,
    status: "idle",   // 최소 상태 필드
    error: null,
  },
  reducers: {
    setSeoulLines: (state, action) => {
      state.list = action.payload;
      // 저장도 같이
      try { localStorageUtil?.setSeoulLines?.(action.payload); } catch {}
    },
    clearSeoulLines: (state) => {
      state.list = [];
      try { localStorageUtil?.removeSeoulLines?.(); } catch {}
    },
    // 필요하면 상태 토글용(옵션)
    setStatus: (state, { payload }) => { state.status = payload || "idle"; },
    setError:  (state, { payload }) => { state.error = payload || null; },
  },
  extraReducers: (builder) => {
  builder
    .addCase(fetchSubwayLineStations.pending, (state, action) => {
      state.status = "loading";
    })
    .addCase(fetchSubwayLineStations.fulfilled, (state, action) => {
      const { lineId, stations } = action.payload;
      state.list = stations;
      state.status = "succeeded";
    })
    .addCase(fetchSubwayLineStations.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload;
    });
},
});

export const {
  setSeoulLines,
  clearSeoulLines,
  setStatus,
  setError,
} = subwayLinesSlice.actions;

export default subwayLinesSlice.reducer;

// 셀렉터(컴포넌트에서 바로 쓰기 좋게)
export const selectSeoulLines = (s) => s.lines.list;
export const selectLinesStatus = (s) => s.lines.status;
export const selectLinesError  = (s) => s.lines.error;