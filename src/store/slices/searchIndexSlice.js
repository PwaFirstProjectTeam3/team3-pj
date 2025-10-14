import { createSlice } from "@reduxjs/toolkit";
import { searchIndexList } from "../thunks/searchIndexListThunk.js";


const searchIndexSlice = createSlice({
  name: 'searchIndexSlice',
  initialState: {
    startStation: '',
    endStation: '',
    startStationId: '',
    endStationId: '',
    startSearchResults: [],
    endSearchResults: [],
    error: null,
    errorStart: null,
    errorEnd: null,
  },
  reducers: {
    setStartStation: (state, action) => {
      state.startStation = action.payload;
    },
    setEndStation: (state, action) => {
      state.endStation = action.payload;
    },
    clearStartResults: (state) => {
      state.startSearchResults = [];
    },
    clearEndResults: (state) => {
      state.endSearchResults = [];
    },
    pickStartStation(state, action) {
      const { name, id } = action.payload;
      state.startStation = name;
      state.startStationId = id;
      state.startSearchResults = [];
    },
    pickEndStation(state, action) {
      const { name, id } = action.payload;
      state.endStation = name;
      state.endStationId = id;
      state.endSearchResults = [];
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchIndexList.pending, (state, action) => {
        const field = action.meta.arg?.field;
        if (field === "start") {
          state.errorStart = null;
        } else {
          state.errorEnd = null;
        }
      })
      .addCase(searchIndexList.fulfilled, (state, action) => {
        const field = action.meta.arg?.field;
        const rows = action.payload;
        if (field === "start") {
          state.startSearchResults = rows;
        } else {
          state.endSearchResults = rows;
        }
      })
      .addCase(searchIndexList.rejected, (state, action) => {
        const field = action.meta.arg?.field;
        if (field === "start") {
          state.errorStart = console.log('검색 실패');
        } else {
          state.errorEnd = console.log('검색 실패');
        }
      });
  },
})

export const {
  setStartStation,
  setEndStation,
  clearStartResults,
  clearEndResults,
  pickStartStation,
  pickEndStation,
   } = searchIndexSlice.actions;

export default searchIndexSlice.reducer;