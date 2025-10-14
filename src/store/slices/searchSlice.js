import { createSlice } from "@reduxjs/toolkit";
import { searchIndex } from "../thunks/searchIndexThunk";

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    list: [],
  },
  reducers: {

  },
  extraReducers: builder => {
    builder
      .addCase(searchIndex.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addMatcher(
        action => action.type.startsWith('searchSlice/') && action.type.endsWith('/pending'),
        state => {
          console.log('처리중');
        }
      )
      .addMatcher(
        action => action.type.startsWith('searchSlice/') && action.type.endsWith('/rejected'),
        (state, action) => {
          console.error('에러', action.error);
        }
      );
  }
})

export default searchSlice.reducer;