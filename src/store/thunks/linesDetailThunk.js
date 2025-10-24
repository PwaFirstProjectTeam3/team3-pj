import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosLinesDetailConfig from "../../configs/linesDetailConfigs/axiosLinesDetailConfigs.js";
import axios from "axios";


const linesDetailThunk = createAsyncThunk(
  'linesDetailIndex',
  async (arg, thunkAPI) => {
    // state 접근 방법
    
    const url = `${axiosLinesDetailConfig.BASE_URL}/realtimeStationArrival`;
    const config = {
      params: {
        serviceKey: axiosLinesDetailConfig.SERVICE_KEY,
        _type: axiosLinesDetailConfig.TYPE,
        statnNm: axiosLinesDetailConfig.STATN_NM,
        
      }
    }

    const response = await axios.get(url, config);
    return response.data.response.body;
  }
);

export { 
  linesDetailThunk
};