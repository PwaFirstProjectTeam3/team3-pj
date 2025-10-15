import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/apiConfigs/axiosConfig.js";
import axios from "axios";


const evacuationIndex = createAsyncThunk(
  'evacuationSlice/evacuationIndex',
  async () => {
    const url = `${axiosConfig.SEARCH_BASE_URL}/${axiosConfig.KEY}/${axiosConfig.TYPE}/${axiosConfig.SEARCH_SERVICE}/${axiosConfig.START_INDEX}/${axiosConfig.END_INDEX}`;

    const response = await axios.get(url);

    return response.data.SmrtEmergerncyGuideImg.row;
  }
);

export { evacuationIndex };