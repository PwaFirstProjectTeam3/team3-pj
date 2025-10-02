import { configureStore } from "@reduxjs/toolkit";
import routeSearchReducer from './slices/routeSearchSlice.js';

export default configureStore({
  reducer: {
    routeSearch: routeSearchReducer,
  }
});