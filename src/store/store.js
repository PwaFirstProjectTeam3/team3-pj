import { configureStore } from "@reduxjs/toolkit";
import evacuationReducer from './slices/searchSlice.js';
import detailReducer from './slices/detailSlice.js';
import subwayLinesReducer from "./slices/subwayLinesSlice";

export default configureStore({
  reducer: {
    evacuation: evacuationReducer,
    detail: detailReducer,
    lines: subwayLinesReducer,
  }
});