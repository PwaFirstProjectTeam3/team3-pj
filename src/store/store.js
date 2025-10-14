import { configureStore } from "@reduxjs/toolkit";
import searchReducer from './slices/searchSlice.js';
import detailReducer from './slices/detailSlice.js';
import subwayLinesReducer from "./slices/subwayLinesSlice";

export default configureStore({
  reducer: {
    search: searchReducer,
    detail: detailReducer,
    lines: subwayLinesReducer,
  }
});