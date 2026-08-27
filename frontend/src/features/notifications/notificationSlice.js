import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getMyNotificationsRequest,
  markNotificationReadRequest,
  markAllNotificationsReadRequest,
  deleteNotificationRequest,
} from "../../api/notificationApi";

const initialState = {
  items: [],
  unreadCount: 0,
  status: "idle",
  error: null,
};

export const fetchMyNotifications = createAsyncThunk(
  "notifications/fetchMyNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getMyNotificationsRequest();
      return res;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch notifications"
      );
    }
  }
);

export const markAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, { rejectWithValue }) => {
    try {
      const res = await markNotificationReadRequest(id);
      return res.notification || res.data || { _id: id, isRead: true };
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark notification as read"
      );
    }
  }
);

export const markAllAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, { rejectWithValue }) => {
    try {
      await markAllNotificationsReadRequest();
      return true;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to mark all notifications as read"
      );
    }
  }
);

export const deleteNotification = createAsyncThunk(
  "notifications/deleteNotification",
  async (id, { rejectWithValue }) => {
    try {
      await deleteNotificationRequest(id);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to delete notification"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchMyNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchMyNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        const rawData = action.payload;
        const list = Array.isArray(rawData)
          ? rawData
          : rawData?.notifications || rawData?.data || [];
        state.items = list;
        state.unreadCount = list.filter((n) => !n.isRead).length;
      })
      .addCase(fetchMyNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // Mark As Read
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (n) => n._id === action.payload._id
        );
        if (index !== -1 && !state.items[index].isRead) {
          state.items[index].isRead = true;
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
      })

      // Mark All As Read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.items.forEach((item) => {
          item.isRead = true;
        });
        state.unreadCount = 0;
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const id = action.payload;
        const item = state.items.find((n) => n._id === id);
        if (item && !item.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.items = state.items.filter((n) => n._id !== id);
      });
  },
});

export const selectNotifications = (state) => state.notifications?.items || [];
export const selectUnreadCount = (state) => state.notifications?.unreadCount || 0;
export const selectNotificationsStatus = (state) => state.notifications?.status || "idle";

export default notificationSlice.reducer;
