import { configureStore } from "@reduxjs/toolkit";
import routeSearchReducer from './slices/routeSearchSlice.js';
import linesReducer from "./slices/subwayLinesSlice.js";

export default configureStore({
  reducer: {
    routeSearch: routeSearchReducer,
    lines: linesReducer,
  }
});