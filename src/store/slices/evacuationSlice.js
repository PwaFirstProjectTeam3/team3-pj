import { createSlice } from "@reduxjs/toolkit";
import { evacuationIndex } from "../thunks/evacuationThunk.js";

const evacuationSlice = createSlice({
  name: 'evacuationSlice',
  initialState: {
    list: [],
  },
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(evacuationIndex.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addMatcher(
        action => action.type.startsWith('evacuationSlice/') && action.type.endsWith('/pending'),
        state => {
          console.log('처리중');
        }
      )
      .addMatcher(
        action => action.type.startsWith('evacuationSlice/') && action.type.endsWith('/rejected'),
        (state, action) => {
          console.error('에러', action.error);
        }
      );
  }
})

export default evacuationSlice.reducer;