import Waitlist from "../models/Waitlist.js";
import Court from "../models/Court.js";
import { createAuditLog } from "../utils/createAuditLog.js";

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

    const user = await user.findById(waitingUser.user).session(session)


    if (!user || user.credits <= 0) {
        return;
    }

    const court = await Court.findById(booking.court).session(session);

    const requestedStart = convertTimeToMinutes(booking.startTime);

    const requestedEnd = convertTimeToMinutes(booking.endTime);

    const duration = (requestedEnd - requestedStart) / 60;

    const totalPrice = duration * court.pricePerHour;

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

    const updatedUser = await User.findByIdAndUpdate(
    waitingUser.user,
    {
        $inc: {
            credits: -1
        }
    },
    {
        new: true,
        session
    }
);

await CreditLedger.create(
    [{
        user: waitingUser.user,
        booking: createdBooking._id,
        type: "Debit",
        amount: 1,
        balanceAfter: updatedUser.credits,
        description: "Booking promoted from waitlist"
    }],
    { session }
);

await createAuditLog({
    user: waitingUser.user,
    action: "WAITLIST_PROMOTED",
    resource: "Booking",
    resourceId: createdBooking._id,
    description: "Booking promoted from waitlist",
    session
});

await Notification.create(
    [{
        user: waitingUser.user,
        title: "Booking Confirmed",
        message: "Your waitlisted booking has been confirmed."
    }],
    { session }
);

await Waitlist.findByIdAndUpdate(
    waitingUser._id,
    {
        status: "Promoted"
    },
    {
        session
    }
);
}