import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { joinWaitlistRequest, getMyWaitlistRequest } from "../../api/waitlistApi";

const initialState = {
  items: [],
  status: "idle",
  actionLoading: false,
  error: null,
};

export const fetchMyWaitlist = createAsyncThunk(
  "waitlist/fetchMyWaitlist",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyWaitlistRequest();
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch waitlist"
      );
    }
  }
);

export const joinWaitlist = createAsyncThunk(
  "waitlist/joinWaitlist",
  async (waitlistData, { rejectWithValue }) => {
    try {
      const res = await joinWaitlistRequest(waitlistData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to join waitlist"
      );
    }
  }
);

const waitlistSlice = createSlice({
  name: "waitlist",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch My Waitlist
      .addCase(fetchMyWaitlist.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyWaitlist.fulfilled, (state, action) => {
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
      .addCase(fetchMyWaitlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Join Waitlist
      .addCase(joinWaitlist.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(joinWaitlist.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.items.unshift(action.payload);
        }
      })
      .addCase(joinWaitlist.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
      });
  },
});

export const selectMyWaitlist = (state) => state.waitlist?.items || [];
export const selectWaitlistStatus = (state) => state.waitlist?.status || "idle";
export const selectWaitlistActionLoading = (state) => state.waitlist?.actionLoading || false;

export default waitlistSlice.reducer;
