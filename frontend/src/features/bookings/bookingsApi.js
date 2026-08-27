import axiosInstance from "../../api/axiosInstance.js";

// GET /api/bookings/my -> { success, count, data: bookings[] }
export const getMyBookingsRequest = () =>
  axiosInstance.get("/bookings/my").then((res) => res.data);

// POST /api/bookings -> { success, message, data: booking }
export const createBookingRequest = (bookingData) =>
  axiosInstance.post("/bookings", bookingData).then((res) => res.data);

// PATCH /api/bookings/:id/cancel -> { success, message, data: booking }
export const cancelBookingRequest = (id) =>
  axiosInstance.patch(`/bookings/${id}/cancel`).then((res) => res.data);

// POST /api/bookings/recurring -> { success, count, message, data: bookings[] }
export const createRecurringBookingRequest = (recurringData) =>
  axiosInstance.post("/bookings/recurring", recurringData).then((res) => res.data);
