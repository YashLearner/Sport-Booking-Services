import Waitlist from "../models/Waitlist.js";
import Court from "../models/Court.js";
import User from "../models/User.js";
import Booking from "../models/Booking.js";
import { createAuditLog } from "../utils/createAuditLog.js";
import CreditLedger from "../models/CreditLedger.js";
import Notification from "../models/Notification.js";
import { convertTimeToMinutes } from "../utils/timeUtils.js";

export const joinWaitlistService = async (data) => {
    const {
        userId,
        courtId,
        bookingDate,
        startTime,
        endTime
    } = data;

    // Court exists?
    const court = await Court.findById(courtId);

    if (!court) {
        throw new Error("Court not found");
    }

    // User already in waitlist?
    const alreadyWaiting = await Waitlist.findOne({
        user: userId,
        court: courtId,
        bookingDate,
        startTime,
        endTime,
        status: "Waiting"
    });

    if (alreadyWaiting) {
        throw new Error("You are already in the waitlist");
    }

    // Create waitlist entry
    const waitlist = await Waitlist.create({
        user: userId,
        court: courtId,
        bookingDate,
        startTime,
        endTime
    });

    // Audit Log
    await createAuditLog({
        user: userId,
        action: "WAITLIST_JOINED",
        resource: "Waitlist",
        resourceId: waitlist._id,
        description: "User joined waitlist"
    });

    return waitlist;
};

export const getOldestWaitingUser = async (
    courtId,
    bookingDate,
    startTime,
    endTime,
    session
) => {
    return await Waitlist.findOne({
        court: courtId,
        bookingDate,
        startTime,
        endTime,
        status: "Waiting"
    })
        .sort({ createdAt: 1 })
        .session(session);
};

export const promoteWaitingUser = async (booking, session) => {
    const waitingUser = await getOldestWaitingUser(
        booking.court,
        booking.bookingDate,
        booking.startTime,
        booking.endTime,
        session
    );
    if (!waitingUser) {
        return;
    }

    const user = await User.findById(waitingUser.user).session(session);
    const court = await Court.findById(booking.court).session(session);

    if (!user || !court) {
        return;
    }

    const requestedStart = convertTimeToMinutes(booking.startTime);
    const requestedEnd = convertTimeToMinutes(booking.endTime);
    const duration = (requestedEnd - requestedStart) / 60;
    const totalPrice = duration * court.pricePerHour;

    if ((user.walletBalance ?? 0) < totalPrice) {
        return;
    }

    const newBooking = await Booking.create(
        [{
            user: waitingUser.user,
            court: booking.court,
            bookingDate: booking.bookingDate,
            startTime: booking.startTime,
            endTime: booking.endTime,
            duration,
            totalPrice
        }],
        { session }
    );

    const createdBooking = newBooking[0];

    const updatedUser = await User.findOneAndUpdate(
        { _id: waitingUser.user, walletBalance: { $gte: totalPrice } },
        { $inc: { walletBalance: -totalPrice } },
        { new: true, session }
    );

    if (!updatedUser) {
        return;
    }

    await CreditLedger.create(
        [{
            user: waitingUser.user,
            booking: createdBooking._id,
            type: "BOOKING_PAYMENT",
            amount: totalPrice,
            balanceAfter: updatedUser.walletBalance,
            description: "Booking promoted from waitlist"
        }],
        { session }
    );

    await createAuditLog({
        user: waitingUser.user,
        action: "WAITLIST_PROMOTED",
        resource: "Booking",
        resourceId: createdBooking._id,
        description: `Booking promoted from waitlist ($${totalPrice.toFixed(2)})`,
        session
    });

    await Notification.create(
        [{
            user: waitingUser.user,
            title: "Booking Confirmed",
            message: `Your waitlisted booking for ${court.name} ($${totalPrice.toFixed(2)}) has been confirmed.`
        }],
        { session }
    );

    await Waitlist.findByIdAndUpdate(
        waitingUser._id,
        { status: "Promoted" },
        { session }
    );
};