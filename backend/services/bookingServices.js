import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import { convertTimeToMinutes, isSlotInPast } from "../utils/timeUtils.js";
import { createAuditLog } from "../utils/createAuditLog.js";
import { createNotification } from "../utils/createNotification.js";
import User from "../models/User.js";
import CreditLedger from "../models/CreditLedger.js";
import { promoteWaitingUser } from "./waitlistServices.js";
import Notification from "../models/Notification.js";
import { autoCompletePastBookings } from "../cron/bookingCompletionCron.js";

export const createBookingService = async (data) => {
    const { userId, courtId, bookingDate, startTime, endTime } = data;

    // Validate that slot is not in the past
    if (isSlotInPast(bookingDate, startTime)) {
        throw new Error("Cannot book a court for a past date or time.");
    }

    const session = await mongoose.startSession();

    // Start Transaction 
    session.startTransaction();

    try {
        // Check Court
        const court = await Court.findById(courtId).session(session);

        if (!court) {
            throw new Error("Court not found");
        }

        // Check User & auto-initialize wallet balance for legacy accounts in MongoDB
        const dbUser = await User.findById(userId).session(session);
        if (!dbUser) {
            throw new Error("User not found");
        }

        if (dbUser.walletBalance === undefined || dbUser.walletBalance === null) {
            dbUser.walletBalance = 100.0;
            await dbUser.save({ session });
        }

        // Normalize bookingDate to startOfDay and endOfDay range to ensure exact calendar day matching
        const dateObj = new Date(bookingDate);
        const startOfDay = new Date(dateObj);
        startOfDay.setUTCHours(0, 0, 0, 0);
        const endOfDay = new Date(dateObj);
        endOfDay.setUTCHours(23, 59, 59, 999);

        // Check if court is pre-booked on the target date range
        const existingBookings = await Booking.find({
            court: courtId,
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: "Booked",
        }).session(session);

        const requestedStart = convertTimeToMinutes(startTime);
        const requestedEnd = convertTimeToMinutes(endTime);

        for (const booking of existingBookings) {
            const bookedStart = convertTimeToMinutes(booking.startTime);
            const bookedEnd = convertTimeToMinutes(booking.endTime);

            const isOverlapping =
                requestedStart < bookedEnd &&
                requestedEnd > bookedStart;

            if (isOverlapping) {
                throw new Error("Selected slot is already booked");
            }
        }

        // Duration Calculate
        const durationInMinutes = requestedEnd - requestedStart;

        if (durationInMinutes <= 0) {
            throw new Error("Invalid Time Slot");
        }

        const duration = durationInMinutes / 60;
        const totalPrice = duration * court.pricePerHour;

        if (dbUser.walletBalance < totalPrice) {
            throw new Error(
                `Insufficient wallet balance. Total required: $${totalPrice.toFixed(2)}, Available balance: $${dbUser.walletBalance.toFixed(2)}.`
            );
        }

        // Deduct monetary totalPrice atomically inside session transaction
        dbUser.walletBalance = dbUser.walletBalance - totalPrice;
        await dbUser.save({ session });

        const booking = await Booking.create(
            [
                {
                    user: userId,
                    court: courtId,
                    bookingDate: startOfDay,
                    startTime,
                    endTime,
                    duration,
                    totalPrice,
                },
            ],
            { session }
        );

        const createdBooking = booking[0];

        await CreditLedger.create(
            [
                {
                    user: userId,
                    booking: createdBooking._id,
                    type: "BOOKING_PAYMENT",
                    amount: totalPrice,
                    balanceAfter: dbUser.walletBalance,
                    description: `Court Booking - ${court.name}`,
                },
            ],
            { session }
        );

        await createAuditLog({
            user: userId,
            action: "BOOKING_CREATED",
            resource: "Booking",
            resourceId: createdBooking._id,
            description: `Court booking created ($${totalPrice.toFixed(2)})`,
            session,
        });

        // Notification created
        await createNotification({
            user: userId,
            title: "Booking Confirmed",
            message: `Your court booking for ${court.name} ($${totalPrice.toFixed(2)}) has been confirmed.`,
            type: "Booking",
        });

        await session.commitTransaction();

        return createdBooking;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const getMyBookingsService = async (userId) => {
    await autoCompletePastBookings();
    return await Booking.find({ user: userId })
        .populate("court")
        .sort({ createdAt: -1 });
};

export const getAllBookingsService = async () => {
    await autoCompletePastBookings();
    return await Booking.find()
        .populate("user", "name email")
        .populate("court")
        .sort({ createdAt: -1 });
};

export const cancelBookingService = async (bookingId, userId) => {
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const booking = await Booking.findById(bookingId).session(session);

        if (!booking) {
            throw new Error("Booking not found");
        }

        if (booking.user.toString() !== userId) {
            throw new Error("Unauthorized");
        }

        if (booking.status === "Cancelled") {
            throw new Error("Booking already cancelled");
        }

        if (booking.status === "Completed") {
            throw new Error("Completed bookings cannot be cancelled.");
        }

        // Construct booking start and end date/time in local time
        let year, month, day;
        if (booking.bookingDate instanceof Date) {
            year = booking.bookingDate.getFullYear();
            month = booking.bookingDate.getMonth();
            day = booking.bookingDate.getDate();
        } else {
            const dateStr = String(booking.bookingDate).split("T")[0];
            const parts = dateStr.split("-");
            year = parseInt(parts[0], 10);
            month = parseInt(parts[1], 10) - 1;
            day = parseInt(parts[2], 10);
        }

        const startMins = convertTimeToMinutes(booking.startTime);
        const startHours = Math.floor(startMins / 60);
        const startMinutes = startMins % 60;
        const bookingStartDateTime = new Date(year, month, day, startHours, startMinutes, 0, 0);

        const endMins = convertTimeToMinutes(booking.endTime);
        const endHours = Math.floor(endMins / 60);
        const endMinutes = endMins % 60;
        const bookingEndDateTime = new Date(year, month, day, endHours, endMinutes, 0, 0);

        const now = new Date();

        if (bookingEndDateTime.getTime() <= now.getTime()) {
            booking.status = "Completed";
            await booking.save({ session });
            throw new Error("Completed bookings cannot be cancelled.");
        }

        if (bookingStartDateTime.getTime() <= now.getTime()) {
            throw new Error("Ongoing bookings cannot be cancelled.");
        }

        booking.status = "Cancelled";

        await booking.save({ session });

        // Refund exact booking totalPrice to user's wallet atomically
        const dbUser = await User.findById(userId).session(session);
        if (dbUser) {
            const currentBal = dbUser.walletBalance !== undefined ? dbUser.walletBalance : 100.0;
            dbUser.walletBalance = currentBal + booking.totalPrice;
            await dbUser.save({ session });
        }

        await promoteWaitingUser(booking, session);

        await CreditLedger.create(
            [
                {
                    user: userId,
                    booking: booking._id,
                    type: "BOOKING_REFUND",
                    amount: booking.totalPrice,
                    balanceAfter: dbUser ? dbUser.walletBalance : 100.0,
                    description: "Court Booking Cancelled",
                },
            ],
            { session }
        );

        await createAuditLog({
            user: userId,
            action: "BOOKING_CANCELLED",
            resource: "Booking",
            resourceId: booking._id,
            description: `Court Booking Cancelled ($${booking.totalPrice.toFixed(2)} Refunded)`,
            session,
        });

        await createNotification({
            user: userId,
            title: "Booking Cancelled",
            message: `Your booking has been cancelled. $${booking.totalPrice.toFixed(2)} refunded to your wallet.`,
            type: "Booking",
        });

        await session.commitTransaction();

        return booking;
    } catch (error) {
        await session.abortTransaction();
        throw error;
    } finally {
        session.endSession();
    }
};

export const createRecurringBookingService = async (data) => {
    const { userId, courtId, startDate, weeks, startTime, endTime } = data;

    if (!Number.isInteger(weeks) || weeks <= 0 || weeks > 52) {
        throw new Error("Weeks must be between 1 and 52");
    }

    // Transaction Start
    const session = await mongoose.startSession();

    session.startTransaction();

    try {
        const dbUser = await User.findById(userId).session(session);
        if (!dbUser) {
            throw new Error("User not found");
        }

        if (dbUser.walletBalance === undefined || dbUser.walletBalance === null) {
            dbUser.walletBalance = 100.0;
            await dbUser.save({ session });
        }

        const court = await Court.findById(courtId).session(session);
        if (!court) {
            throw new Error("Court not found");
        }

        const start = convertTimeToMinutes(startTime);
        const end = convertTimeToMinutes(endTime);

        const duration = (end - start) / 60;

        if (duration <= 0) {
            throw new Error("Invalid Time Slot");
        }

        const singleSlotPrice = duration * court.pricePerHour;
        const totalRecurringCost = singleSlotPrice * weeks;

        // Check sufficient wallet balance
        if (dbUser.walletBalance < totalRecurringCost) {
            throw new Error(
                `You need $${totalRecurringCost.toFixed(2)} for ${weeks} weeks recurring booking, but your wallet balance is only $${dbUser.walletBalance.toFixed(2)}.`
            );
        }

        // Deduct totalRecurringCost atomically from user's wallet
        dbUser.walletBalance = dbUser.walletBalance - totalRecurringCost;
        await dbUser.save({ session });

        const bookings = [];

        for (let i = 0; i < weeks; i++) {
            const bookingDate = new Date(startDate);
            bookingDate.setDate(bookingDate.getDate() + i * 7);

            const startOfDay = new Date(bookingDate);
            startOfDay.setUTCHours(0, 0, 0, 0);
            const endOfDay = new Date(bookingDate);
            endOfDay.setUTCHours(23, 59, 59, 999);

            // Validate that recurring occurrence is not in the past
            if (isSlotInPast(startOfDay, startTime)) {
                throw new Error("Cannot book a court for a past date or time.");
            }

            // Slot Check with day range query
            const existingBookings = await Booking.find({
                court: courtId,
                bookingDate: { $gte: startOfDay, $lte: endOfDay },
                status: "Booked",
            }).session(session);

            const requestedStart = convertTimeToMinutes(startTime);
            const requestedEnd = convertTimeToMinutes(endTime);

            for (const booking of existingBookings) {
                const bookedStart = convertTimeToMinutes(booking.startTime);
                const bookedEnd = convertTimeToMinutes(booking.endTime);

                const isOverlapping =
                    requestedStart < bookedEnd && requestedEnd > bookedStart;

                if (isOverlapping) {
                    throw new Error(`Selected slot is already booked for date ${startOfDay.toLocaleDateString()}`);
                }
            }

            const booking = await Booking.create(
                [
                    {
                        user: userId,
                        court: courtId,
                        bookingDate: startOfDay,
                        startTime,
                        endTime,
                        duration,
                        totalPrice: singleSlotPrice,
                        bookingType: "Recurring",
                    },
                ],
                { session }
            );

            bookings.push(booking[0]);
        }

        await CreditLedger.create(
            [
                {
                    user: userId,
                    type: "BOOKING_PAYMENT",
                    amount: totalRecurringCost,
                    balanceAfter: dbUser.walletBalance,
                    description: `Recurring Booking (${weeks} Weeks) - ${court.name}`,
                },
            ],
            { session }
        );

        await createAuditLog({
            user: userId,
            action: "RECURRING_BOOKING_CREATED",
            resource: "Booking",
            resourceId: bookings[0]._id,
            description: `Recurring booking created for ${weeks} weeks ($${totalRecurringCost.toFixed(2)})`,
            session,
        });

        await Notification.create(
            [
                {
                    user: userId,
                    title: "Recurring Booking Created",
                    message: `Your recurring booking for ${weeks} weeks ($${totalRecurringCost.toFixed(2)}) has been created.`,
                },
            ],
            { session }
        );

        await session.commitTransaction();

        return bookings;
    } catch (error) {
        await session.abortTransaction();

        throw error;
    } finally {
        session.endSession();
    }
};