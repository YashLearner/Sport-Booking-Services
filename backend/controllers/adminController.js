import User from "../models/User.js";
import Court from "../models/Court.js";
import Booking from "../models/Booking.js";
import asyncHandler from "../utils/asyncHandler.js";

import { getAllBookingsService } from "../services/bookingServices.js";

export const getAllBookings = asyncHandler(async (req, res) => {
  const bookings = await getAllBookingsService();

  res.status(200).json({
    success: true,
    count: bookings.length,
    data: bookings,
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const user = await User.findByIdAndDelete(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export const getAdminStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalCourts = await Court.countDocuments();
  const totalBookings = await Booking.countDocuments();

  const bookings = await Booking.find();
  const totalRevenue = bookings.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);

  res.status(200).json({
    success: true,
    data: {
      totalUsers,
      totalCourts,
      totalBookings,
      totalRevenue,
    },
  });
});