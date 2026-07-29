import asyncHandler from "../utils/asyncHandler.js";

import {
    createBookingService,
    getMyBookingsService,
    getAllBookingsService,
    cancelBookingService,
    createRecurringBookingService,
} from "../services/bookingServices.js";

export const createBooking = asyncHandler(async (req, res) => {

    const booking = await createBookingService({
        ...req.body,
        userId: req.user.id,
    });

    res.status(201).json({
        success: true,
        message: "Booking Created Successfully",
        data: booking,
    });
});

export const getMyBookings = asyncHandler(async (req, res) => {
    const bookings = await getMyBookingsService(req.user.id);

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

export const getAllBookings = asyncHandler(async (req, res) => {
    const bookings = await getAllBookingsService();

    res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
    });
});

export const cancelBooking = asyncHandler(async (req, res) => {

  const booking = await cancelBookingService(
    req.params.id,
    req.user.id
  );

  res.status(200).json({
    success: true,
    message: "Booking Cancelled Successfully",
    data: booking,
  });

});

export const createRecurringBooking = asyncHandler(async (req, res) => {

    const bookings = await createRecurringBookingService({
        ...req.body,
        userId: req.user.id
    });

    res.status(201).json({
        success: true,
        count: bookings.length,
        message: "Recurring Booking Created",
        data: bookings
    });

});