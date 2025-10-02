import { createSlice } from "@reduxjs/toolkit";

const detailSlice = createSlice ({
  name: 'detailSlice',
  initialState: {
    list: [],
  },
  reducers: {
    setList(state, action) {
      state.list = action.payload;
    }
  },
});

export const {
  setList
} = detailSlice.actions;

export default detailSlice.reducer;