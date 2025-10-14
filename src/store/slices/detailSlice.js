import { createSlice } from "@reduxjs/toolkit";
import { arrivalInfoIndex, stationInfoIndex } from "../thunks/detailThunk";
import { line1List } from "../../configs/line-list-configs/line1ListConfig.js";
import { line2List } from "../../configs/line-list-configs/detail-line-list-configs/line2ListConfig.js";
import { line3List } from "../../configs/line-list-configs/line3ListConfig.js";
import { line4List } from "../../configs/line-list-configs/line4ListConfig.js";
import { line5List } from "../../configs/line-list-configs/line5ListConfig.js";
import { line6List } from "../../configs/line-list-configs/line6ListConfig.js";
import { line7List } from "../../configs/line-list-configs/line7ListConfig.js";
import { line8List } from "../../configs/line-list-configs/line8ListConfig.js";
import { line9List } from "../../configs/line-list-configs/line9ListConfig.js";

const lineLists = {
  line1List,
  line2List,
  line3List,
  line4List,
  line5List,
  line6List,
  line7List,
  line8List,
  line9List
};

const detailSlice = createSlice ({
  name: 'detailSlice',
  initialState: {
    lines: lineLists,
    selectedStation: null,
    stationInfo: [],
  },
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(arrivalInfoIndex.fulfilled, (state, action) => {
        console.log(action.payload, action.type);
      })
      .addCase(stationInfoIndex.fulfilled, (state, action) => {
        state.stationInfo = action.payload;
      })
      .addMatcher(
        action => action.type.startsWith('detailSlice/') && action.type.endsWith('/pending'),
        (state) => {
          console.log('처리중입니다.');
        }
      )
      .addMatcher(
        action => action.type.startsWith('detailSlice/') && action.type.endsWith('/rejected'),
        (state, action) => {
          console.error('에러에러.', action.error);
        }
      );
  }
});

export const {
  setSelectedStation,
  setstationInfo
} = detailSlice.actions;

export default detailSlice.reducer;