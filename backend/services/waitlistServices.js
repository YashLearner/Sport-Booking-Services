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