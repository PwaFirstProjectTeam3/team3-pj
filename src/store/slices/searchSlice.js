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

export const { setDepartureStationId, setDepartureStationFrCord, setArrivalStationId, setArrivalStationFrCord } = searchSlice.actions;

export default searchSlice.reducer;