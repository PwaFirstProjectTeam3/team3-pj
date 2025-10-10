import { configureStore } from "@reduxjs/toolkit";
<<<<<<< HEAD
import linesReducer from "./slices/subwayLinesSlice";


export const store = configureStore({
    reducer: {
        lines: linesReducer,
    }
});
 
export default store;
=======
import routeSearchReducer from './slices/routeSearchSlice.js';
import detailReducer from './slices/detailSlice.js';
import linesReducer from "./slices/subwayLinesSlice";

export default configureStore({
  reducer: {
    routeSearch: routeSearchReducer,
    detail: detailReducer,
    lines: linesReducer,
  }
});
>>>>>>> c24d33c (251010 header 추가)
