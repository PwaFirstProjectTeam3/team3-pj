import { createSlice } from "@reduxjs/toolkit";
import { evacuationIndex } from "../thunks/evacuationThunk.js";

const evacuationSlice = createSlice({
  name: 'evacuationSlice',
  initialState: {
    evacuationList: [],
  },
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(evacuationIndex.fulfilled, (state, action) => {
        state.evacuationList = action.payload;
      });
  }
})

export default evacuationSlice.reducer;