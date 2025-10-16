import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosConfig from "../../configs/apiConfigs/axiosConfig.js";
import axios from "axios";

const evacuationIndex = createAsyncThunk(
  'evacuationSlice/evacuationIndex',
  async () => {
    const url = `${axiosConfig.EVACUATION_BASE_URL}/${axiosConfig.KEY}/${axiosConfig.TYPE}/${axiosConfig.EVACUATION_SERVICE}/${axiosConfig.START_INDEX}/${axiosConfig.END_INDEX}`;

    const response = await axios.get(url);

    return response.data.SmrtEmergerncyGuideImg.row;
  }
);

export { evacuationIndex };