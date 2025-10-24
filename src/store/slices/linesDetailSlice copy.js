import { createSlice } from "@reduxjs/toolkit";
import { linesDetailThunk } from "../thunks/linesDetailThunk.js";

const initialState = {
  items: [],       // 정규화된 도착 정보 배열
  loading: false,
  error: null,
  lastUpdated: null,
};

const linesDetailSlice = createSlice({
  name: "arrivals",
  initialState,
  reducers: {
    clearArrivals(state) {
      state.items = [];
      state.error = null;
      state.lastUpdated = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(linesDetailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(linesDetailThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
        state.lastUpdated = Date.now();
      })
      .addCase(linesDetailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message ?? "Unknown error";
      });
  },
});

export const { clearArrivals } = linesDetailSlice.actions;

export default linesDetailSlice.reducer;

  
