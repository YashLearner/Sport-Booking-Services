// Formatting helpers for the Date/HH:mm shapes the backend returns
// (Booking.bookingDate is an ISO date, startTime/endTime are "HH:mm" strings).

export function formatBookingDate(isoDate) {
  const d = new Date(isoDate);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function formatTimeRange(startTime, endTime) {
  return `${startTime} – ${endTime}`;
}

// A booking counts as "upcoming" if it's still Booked and its start time has not passed yet.
export function isUpcoming(booking) {
  if (!booking || booking.status !== "Booked") return false;

  let year, month, day;
  if (booking.bookingDate instanceof Date) {
    year = booking.bookingDate.getUTCFullYear();
    month = booking.bookingDate.getUTCMonth();
    day = booking.bookingDate.getUTCDate();
  } else {
    const dateStr = String(booking.bookingDate).split("T")[0];
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }

  const startTime = booking.startTime || "00:00";
  const cleanTime = String(startTime).trim().toUpperCase();
  const isPM = cleanTime.includes("PM");
  const isAM = cleanTime.includes("AM");
  const timeOnly = cleanTime.replace(/(AM|PM)/g, "").trim();
  const parts = timeOnly.split(":");
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  const slotStart = new Date(year, month, day, hours, minutes, 0, 0);

  return slotStart.getTime() > Date.now();
}

export function canCancelBooking(booking) {
  if (!booking || booking.status !== "Booked") return false;
  return isUpcoming(booking);
}
