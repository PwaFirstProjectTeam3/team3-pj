import { configureStore } from "@reduxjs/toolkit";
import linesReducer from "./slices/subwayLinesSlice";


export const store = configureStore({
    reducer: {
        lines: linesReducer,
    }
});
 
export default store;