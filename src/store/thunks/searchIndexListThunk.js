import { createAsyncThunk } from "@reduxjs/toolkit";
import searchAxiosConfig from "../../configs/search-index-configs/searchAxiosConfigs.js";
import axios from "axios";


const searchIndexList = createAsyncThunk(
  'searchIndexSlice/searchIndexList',
  async ({field, query}) => {
    if(!query?.trim()) {
      return [];
    }

    const { BASE_URL, KEY, TYPE, SERVICE, START_INDEX, END_INDEX } = searchAxiosConfig;

    const url = `${BASE_URL}/${KEY}/${TYPE}/${SERVICE}/${START_INDEX}/${END_INDEX}/${encodeURIComponent(query)}`;

    const response = await axios.get(url);

    const rows = response.data?.SearchInfoBySubwayNameService?.row ?? [];

    return rows.slice(0, 10);
  }
)

export { searchIndexList }