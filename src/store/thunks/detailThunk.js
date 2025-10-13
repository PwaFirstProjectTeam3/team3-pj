import { createAsyncThunk } from "@reduxjs/toolkit";
import detailAxiosConfig from "../../configs/detailAxiosConfig.js";
import axios from "axios";

const detailIndex = createAsyncThunk(
  'detailSlice/detailIndex',
  async () => {
    // const state = thunkAPI.getState();

    const url = detailAxiosConfig.BASE_URL;

    const config = {
      params: {
        key: detailAxiosConfig.KEY,
        type: detailAxiosConfig.TYPE,
        service: detailAxiosConfig.SERVICE,
        startIndex: detailAxiosConfig.START_INDEX,
        endIndex: detailAxiosConfig.END_INDEX
      }
    }

    const response = await axios.get(url, config);
    return response.data.response.body;
  }
);

export {
  detailIndex
};