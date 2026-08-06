import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Court from "../models/Court.js";
import { convertTimeToMinutes } from "../utils/timeUtils.js";
import { createAuditLog } from "../utils/createAuditLog.js";
import { createNotification } from "../utils/createNotification.js";
import User from "../models/User.js";
import CreditLedger from "../models/CreditLedger.js";
import { promoteWaitingUser } from "./waitlistServices.js";

export const createBookingService = async (data) => {
    const { userId, courtId, bookingDate, startTime, endTime } = data;

    const session = await mongoose.startSession();

    // Start Transaction 
    session.startTransaction();

    try {


        // Check Court
        const court = await Court.findById(courtId).session(session);

        if (!court) {
            throw new Error("Court not found");
        }
        //  Check if court is pre booked 
        const existingBookings = await Booking.find({
            court: courtId,
            bookingDate,
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

        const booking = await Booking.create([
            {
                user: userId,
                court: courtId,
                bookingDate,
                startTime,
                endTime,
                duration,
                totalPrice,
            }],
            { session }
        );



        const createdBooking = booking[0];
        const updatedUser = await User.findOneAndUpdate(

            { _id: userId, credits: { $gt: 0 } },
            { $inc: { credits: -1 } }, { new: true, session }

        );
        if (!updatedUser) {
            throw new Error("Insufficient Credits");
        }

        await CreditLedger.create(
            [{
                user: userId,
                booking: createdBooking._id,
                type: "Debit",
                amount: 1,
                balanceAfter: updatedUser.credits,
                description: "Court Booking",
            }],
            { session }
        );

        await createAuditLog({
            user: userId,
            action: "BOOKING_CREATED",
            resource: "Booking",
            resourceId: createdBooking._id,
            description: "Court booking created",
            session
        });

        // Notification created

        await createNotification({

            user: userId,
            title: "Booking Confirmed",
            message: "Your court booking has been confirmed.",
            type: "Booking"

        });

        await session.commitTransaction();

        return createdBooking;

    } catch (error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
}

export const getMyBookingsService = async (userId) => {
    return await Booking.find({ user: userId })
        .populate("court")
        .sort({ createdAt: -1 });
};

export const getAllBookingsService = async () => {
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

        booking.status = "Cancelled";


        await booking.save({ session })

        const updatedUser = await User.findOneAndUpdate(


            { _id: userId },
            { $inc: { credits: 1 } }, { new: true, session }

        );

        await promoteWaitingUser(booking, session);


        await CreditLedger.create(
            [{
                user: userId,
                booking: booking._id,
                type: "Refund",
                amount: 1,
                balanceAfter: updatedUser.credits,
                description: "Court Booking Cancelled",
            }],
            { session }
        );

        await createAuditLog({
            user: userId,
            action: "BOOKING_CANCELLED",
            resource: "Booking",
            resourceId: booking._id,
            description: "Court Booking Cancelled",
            session
        });

        await createNotification({

            user: userId,

            title: "Booking Cancelled",

            message:
                "Your booking has been cancelled.",

            type: "Booking"

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

    const {
        userId,
        courtId,
        startDate,
        weeks,
        startTime,
        endTime
    } = data;

    // Transaction Start
    const session = await mongoose.startSession();

    session.startTransaction();

    try {


        if (!Number.isInteger(weeks) || weeks <= 0 || weeks > 52) {
            throw new Error("Weeks must be between 1 and 52");
        }


        const user = await User.findById(userId).session(session);
        if (!user) {
            throw new Error("User not found");
        }

        if (user.credits < weeks) {
            throw new Error(
                `You need ${weeks} credits but only have ${user.credits}`
            );
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

        const totalPrice = duration * court.pricePerHour;

        const bookings = [];

        for (let i = 0; i < weeks; i++) {

            const bookingDate = new Date(startDate);

            bookingDate.setDate(
                bookingDate.getDate() + (i * 7)
            );

            bookingDate.setHours(0, 0, 0, 0);
            // Slot Check

            const existingBookings = await Booking.find({
                court: courtId,
                bookingDate,
                status: "Booked"
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
            const booking = await Booking.create(
                [{
                    user: userId,
                    court: courtId,
                    bookingDate,
                    startTime,
                    endTime,
                    duration,
                    totalPrice,
                    bookingType: "Recurring"
                }],
                { session }
            );

            bookings.push(booking[0]);

            // Credit Deduct
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    $inc: {
                        credits: -weeks
                    }
                },
                {
                    new: true,
                    session
                }
            );
            await CreditLedger.create(
                [{
                    user: userId,
                    booking: createdBooking._id,
                    type: "Debit",
                    amount: 1,
                    balanceAfter: updatedUser.credits,
                    description: "Recurring Booking"
                }],
                { session }
            )

            await createAuditLog({
                user: userId,
                action: "RECURRING_BOOKING_CREATED",
                resource: "Booking",
                resourceId: createdBooking._id,
                description: "Recurring booking created",
                session
            });

            await Notification.create(
                [{
                    user: userId,
                    title: "Recurring Booking Created",
                    message: `Your recurring booking for ${weeks} weeks has been created.`
                }],
                { session }
            );
        }

        await session.commitTransaction();

        return bookings;

    } catch (error) {

        await session.abortTransaction();

        throw error;

    } finally {

        session.endSession();

    }

};