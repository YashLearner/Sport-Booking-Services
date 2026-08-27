import Booking from "../models/Booking.js";
import { convertTimeToMinutes } from "../utils/timeUtils.js";

/**
 * Sweeps all active bookings with status "Booked" and updates those whose end time has passed to "Completed".
 */
export const autoCompletePastBookings = async () => {
    try {
        const activeBookings = await Booking.find({ status: "Booked" });
        if (!activeBookings || activeBookings.length === 0) return;

        const now = new Date();

        for (const booking of activeBookings) {
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

            const endMins = convertTimeToMinutes(booking.endTime);
            const hours = Math.floor(endMins / 60);
            const minutes = endMins % 60;

            const bookingEndDateTime = new Date(year, month, day, hours, minutes, 0, 0);

            if (bookingEndDateTime.getTime() <= now.getTime()) {
                booking.status = "Completed";
                await booking.save();
            }
        }
    } catch (error) {
        console.error("Error running autoCompletePastBookings cron:", error.message);
    }
};

/**
 * Initializes recurring background job to sweep completed bookings.
 * Runs immediately on server startup, then every 60 seconds.
 */
export const startBookingCompletionCron = () => {
    autoCompletePastBookings();
    setInterval(autoCompletePastBookings, 60 * 1000);
};
