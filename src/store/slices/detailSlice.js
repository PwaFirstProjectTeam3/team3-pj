import { createSlice } from "@reduxjs/toolkit";
import { detailIndex } from "../thunks/detailThunk";

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
  extraReducers: (builder) => {
    builder
      .addCase(detailIndex.fulfilled, (state,action) => {
        console.log(action.payload, action.type);
        
      })
  }
});

export const {
  setList
} = detailSlice.actions;

export default detailSlice.reducer;