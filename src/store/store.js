import { configureStore } from "@reduxjs/toolkit";
import routeSearchReducer from './slices/routeSearchSlice.js';
import detailReducer from './slices/detailSlice.js';

export default configureStore({
  reducer: {
    routeSearch: routeSearchReducer,
    detail: detailReducer,
  }
});