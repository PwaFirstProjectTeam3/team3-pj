import { createSlice } from "@reduxjs/toolkit";
import { searchIndex } from "../thunks/searchThunk";

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState: {
    list: [],
    departureStationId: '',
    arrivalStationId: '',
    departureStationFrCord: '',
    arrivalStationFrCord: '',
  },
  reducers: {
    setDepartureStationId: (state, action) => {
      state.departureStationId = action.payload;
    },
    setArrivalStationId: (state, action) => {
      state.arrivalStationId = action.payload;
    },
    setDepartureStationFrCord: (state, action) => {
      state.departureStationFrCord = action.payload;
    },
    setArrivalStationFrCord: (state, action) => {
      state.arrivalStationFrCord = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(searchIndex.fulfilled, (state, action) => {
        state.list = action.payload;
      });
  }
})

export const { setDepartureStationId, setDepartureStationFrCord, setArrivalStationId, setArrivalStationFrCord } = searchSlice.actions;

export default searchSlice.reducer;