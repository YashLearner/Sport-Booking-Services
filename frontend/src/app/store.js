import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import bookingsReducer from "../features/bookings/bookingsSlice";
import courtsReducer from "../features/courts/courtSlice";
import waitlistReducer from "../features/waitlist/waitlistSlice";
import notificationReducer from "../features/notifications/notificationSlice";
import adminReducer from "../features/admin/adminSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    bookings: bookingsReducer,
    courts: courtsReducer,
    waitlist: waitlistReducer,
    notifications: notificationReducer,
    admin: adminReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
