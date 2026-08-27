import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getMyBookingsRequest,
  createBookingRequest,
  cancelBookingRequest,
  createRecurringBookingRequest,
} from "./bookingsApi.js";
import { loadProfile, updateWalletBalance } from "../auth/authSlice.js";

const initialState = {
  items: [],
  status: "idle", // 'idle' | 'loading' | 'succeeded' | 'failed'
  actionLoading: false,
  error: null,
};

export const fetchMyBookings = createAsyncThunk(
  "bookings/fetchMyBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyBookingsRequest();
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to load your bookings"
      );
    }
  }
);

export const createBooking = createAsyncThunk(
  "bookings/createBooking",
  async (bookingData, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await createBookingRequest(bookingData);
      const newBooking = res.data;

      // Refresh exact wallet balance from profile or subtract totalPrice
      const totalPrice = newBooking?.totalPrice || 0;
      const currentBalance = getState().auth.user?.walletBalance ?? 100;
      dispatch(updateWalletBalance(Math.max(0, currentBalance - totalPrice)));
      dispatch(loadProfile());

      return newBooking;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create booking"
      );
    }
  }
);

export const createRecurringBooking = createAsyncThunk(
  "bookings/createRecurringBooking",
  async (recurringData, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await createRecurringBookingRequest(recurringData);
      const newBookings = res.data;

      // Refresh wallet balance from profile
      dispatch(loadProfile());

      return newBookings;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create recurring booking"
      );
    }
  }
);

export const cancelBooking = createAsyncThunk(
  "bookings/cancelBooking",
  async (id, { dispatch, getState, rejectWithValue }) => {
    try {
      const res = await cancelBookingRequest(id);
      const updatedBooking = res.data;

      // Refresh user wallet balance in auth state (+totalPrice refund)
      const refundedAmount = updatedBooking?.totalPrice || 0;
      const currentBalance = getState().auth.user?.walletBalance ?? 0;
      dispatch(updateWalletBalance(currentBalance + refundedAmount));
      dispatch(loadProfile());

      return updatedBooking;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to cancel booking"
      );
    }
  }
);

const bookingsSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    clearBookingsState: (state) => {
      state.items = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Bookings
      .addCase(fetchMyBookings.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyBookings.fulfilled, (state, action) => {
        state.status = "succeeded";
        const rawData = action.payload;
        if (Array.isArray(rawData)) {
          state.items = rawData;
        } else if (rawData && Array.isArray(rawData.data)) {
          state.items = rawData.data;
        } else {
          state.items = [];
        }
      })
      .addCase(fetchMyBookings.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Create Booking
      .addCase(createBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Create Recurring Booking
      .addCase(createRecurringBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createRecurringBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        const newItems = Array.isArray(action.payload) ? action.payload : [];
        state.items = [...newItems, ...state.items];
      })
      .addCase(createRecurringBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      })

      // Cancel Booking
      .addCase(cancelBooking.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(cancelBooking.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex(
          (b) => b._id === action.payload._id
        );
        if (index !== -1) {
          state.items[index] = {
            ...state.items[index],
            ...action.payload,
            status: "Cancelled",
          };
        }
      })
      .addCase(cancelBooking.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearBookingsState } = bookingsSlice.actions;

// Selectors
export const selectMyBookings = (state) => state.bookings?.items || [];
export const selectMyBookingsStatus = (state) => state.bookings?.status || "idle";
export const selectBookingsActionLoading = (state) => state.bookings?.actionLoading || false;
export const selectMyBookingsError = (state) => state.bookings?.error || null;

export default bookingsSlice.reducer;
