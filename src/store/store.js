import { configureStore } from "@reduxjs/toolkit";
import routeSearchReducer from './slices/routeSearchSlice.js';
import detailReducer from './slices/detailSlice.js';
import subwayLinesReducer from "./slices/subwayLinesSlice";

export default configureStore({
  reducer: {
    routeSearch: routeSearchReducer,
    detail: detailReducer,
    lines: subwayLinesReducer,
  }
});