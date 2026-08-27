import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAdminStatsRequest,
  getAllAdminBookingsRequest,
  getAllUsersRequest,
  deleteUserRequest,
} from "../../api/adminApi";

const initialState = {
  stats: null,
  allBookings: [],
  users: [],
  status: "idle",
  error: null,
};

export const fetchAdminStats = createAsyncThunk(
  "admin/fetchAdminStats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAdminStatsRequest();
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch admin stats");
    }
  }
);

export const fetchAdminBookings = createAsyncThunk(
  "admin/fetchAdminBookings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllAdminBookingsRequest();
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch bookings");
    }
  }
);

export const fetchAdminUsers = createAsyncThunk(
  "admin/fetchAdminUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAllUsersRequest();
      return res.data || res;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const deleteAdminUser = createAsyncThunk(
  "admin/deleteAdminUser",
  async (id, { rejectWithValue }) => {
    try {
      await deleteUserRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Admin Stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.stats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Admin Bookings
      .addCase(fetchAdminBookings.fulfilled, (state, action) => {
        state.allBookings = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })

      // Admin Users
      .addCase(fetchAdminUsers.fulfilled, (state, action) => {
        state.users = Array.isArray(action.payload)
          ? action.payload
          : action.payload?.data || [];
      })

      // Delete User
      .addCase(deleteAdminUser.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload);
      });
  },
});

export const selectAdminStats = (state) => state.admin?.stats;
export const selectAdminBookings = (state) => state.admin?.allBookings || [];
export const selectAdminUsers = (state) => state.admin?.users || [];
export const selectAdminStatus = (state) => state.admin?.status || "idle";

export default adminSlice.reducer;
