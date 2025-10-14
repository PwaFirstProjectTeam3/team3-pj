import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/apiConfigs/axiosConfig.js";
import axios from "axios";


const searchIndex = createAsyncThunk(
  'searchSlice/searchIndex',
  async () => {
    const url = axiosConfig.SEARCH_BASE_URL;
    const config = {
      params: {
        KEY: axiosConfig.KEY,
        TYPE: axiosConfig.TYPE,
        SERVICE: axiosConfig.SEARCH_SERVICE,
        START_INDEX: axiosConfig.START_INDEX,
        END_INDEX: axiosConfig.END_INDEX,
      }
    }

    const response = await axios.get(url, config);

    return response.data.response.body;
  }
);

export { searchIndex };