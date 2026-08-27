export const convertTimeToMinutes = (timeStr) => {
  if (!timeStr) return 0;
  const cleanTime = String(timeStr).trim().toUpperCase();
  const isPM = cleanTime.includes("PM");
  const isAM = cleanTime.includes("AM");
  const timeOnly = cleanTime.replace(/(AM|PM)/g, "").trim();
  const parts = timeOnly.split(":");
  let hours = parseInt(parts[0], 10) || 0;
  const minutes = parseInt(parts[1], 10) || 0;

  if (isPM && hours < 12) hours += 12;
  if (isAM && hours === 12) hours = 0;

  return hours * 60 + minutes;
};

export const isSlotInPast = (bookingDate, startTimeStr) => {
  if (!bookingDate || !startTimeStr) return false;

  let year, month, day;
  if (bookingDate instanceof Date) {
    year = bookingDate.getFullYear();
    month = bookingDate.getMonth();
    day = bookingDate.getDate();
  } else {
    const dateStr = String(bookingDate).split("T")[0];
    const parts = dateStr.split("-");
    year = parseInt(parts[0], 10);
    month = parseInt(parts[1], 10) - 1;
    day = parseInt(parts[2], 10);
  }

  const totalMins = convertTimeToMinutes(startTimeStr);
  const hours = Math.floor(totalMins / 60);
  const minutes = totalMins % 60;

  const slotDate = new Date(year, month, day, hours, minutes, 0, 0);

  return slotDate.getTime() <= Date.now();
};