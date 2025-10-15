import { configureStore } from "@reduxjs/toolkit";
import evacuationReducer from './slices/evacuationSlice.js';
import searchIndexReducer from './slices/searchIndexSlice.js';
import detailReducer from './slices/detailSlice.js';
import subwayLinesReducer from "./slices/subwayLinesSlice";

export default configureStore({
  reducer: {
    searchIndex: searchIndexReducer,
    evacuation: evacuationReducer,
    detail: detailReducer,
    lines: subwayLinesReducer,
  }
});