import type {PayloadAction} from '@reduxjs/toolkit';
import {createSlice} from '@reduxjs/toolkit';
import type {AvailableBooking} from '../services/types/bookings';
import type {RootState} from '../store';

export interface BasketState {
  bookings: AvailableBooking[];
}

const initialState: BasketState = {
  bookings: [],
};

export const basketSlice = createSlice({
  name: 'basket',
  initialState,
  reducers: {
    addBooking: (state, action: PayloadAction<AvailableBooking>) => {
      const exists = state.bookings.find(
        booking =>
          booking.starts === action.payload.starts &&
          booking.event.id === action.payload.event.id
      );

      if (exists) return;

      state.bookings.push(action.payload);
    },
    removeBooking: (state, action: PayloadAction<AvailableBooking>) => {
      const index = state.bookings.findIndex(
        booking =>
          booking.starts === action.payload.starts &&
          booking.event.id === action.payload.event.id
      );
      if (index >= 0) state.bookings.splice(index, 1);
    },
    clearBookings: state => {
      state.bookings = [];
    },
  },
});

export const {addBooking, clearBookings, removeBooking} = basketSlice.actions;

export const selectBookings = (state: RootState) => state.basket.bookings;

export default basketSlice.reducer;
