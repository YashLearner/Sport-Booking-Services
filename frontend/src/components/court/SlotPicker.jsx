import React, { useState } from "react";
import { FiCalendar, FiClock, FiCreditCard, FiDollarSign } from "react-icons/fi";

const TIME_SLOTS = [
  "06:00",
  "07:00",
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
  "21:00",
];

export default function SlotPicker({ pricePerHour = 50, onSelectSlot }) {
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const [bookingDate, setBookingDate] = useState(getTodayString());
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("11:00");

  // Calculate duration in hours
  const startMins = parseInt(startTime.split(":")[0]) * 60 + parseInt(startTime.split(":")[1]);
  const endMins = parseInt(endTime.split(":")[0]) * 60 + parseInt(endTime.split(":")[1]);
  const durationInMins = Math.max(0, endMins - startMins);
  const durationInHours = durationInMins / 60;
  const totalPrice = durationInHours * pricePerHour;

  const handleStartTimeChange = (newStart) => {
    setStartTime(newStart);
    // Automatically adjust end time to 1 hour after start
    const startHour = parseInt(newStart.split(":")[0]);
    const nextHour = String(startHour + 1).padStart(2, "0");
    setEndTime(`${nextHour}:00`);

    if (onSelectSlot) {
      onSelectSlot({
        bookingDate,
        startTime: newStart,
        endTime: `${nextHour}:00`,
        duration: 1,
        totalPrice: pricePerHour,
      });
    }
  };

  const handleEndTimeChange = (newEnd) => {
    setEndTime(newEnd);
    const endH = parseInt(newEnd.split(":")[0]);
    const startH = parseInt(startTime.split(":")[0]);
    const dur = Math.max(0.5, endH - startH);

    if (onSelectSlot) {
      onSelectSlot({
        bookingDate,
        startTime,
        endTime: newEnd,
        duration: dur,
        totalPrice: dur * pricePerHour,
      });
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200 dark:border-slate-700/80 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center space-x-2 text-base">
          <FiCalendar className="text-emerald-600 w-5 h-5" />
          <span>Select Date & Slot</span>
        </h3>
        <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
          Instant Slot Reservation
        </span>
      </div>

      {/* Date Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
          Booking Date
        </label>
        <input
          type="date"
          min={getTodayString()}
          value={bookingDate}
          onChange={(e) => {
            setBookingDate(e.target.value);
            if (onSelectSlot) {
              onSelectSlot({
                bookingDate: e.target.value,
                startTime,
                endTime,
                duration: durationInHours,
                totalPrice,
              });
            }
          }}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {/* Start Time Slot Grid */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
          Select Start Time
        </label>
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
          {TIME_SLOTS.map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => handleStartTimeChange(slot)}
              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all border ${
                startTime === slot
                  ? "bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/20"
                  : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-emerald-400"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>

      {/* End Time Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            Start Time
          </label>
          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white flex items-center space-x-2">
            <FiClock className="text-emerald-600" />
            <span>{startTime}</span>
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
            End Time
          </label>
          <select
            value={endTime}
            onChange={(e) => handleEndTimeChange(e.target.value)}
            className="w-full p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none"
          >
            {TIME_SLOTS.filter((s) => s > startTime).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Pricing & Credit Summary */}
      <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <div>
          <span className="text-xs text-slate-400 font-medium block">Total Estimate</span>
          <span className="text-xl font-extrabold text-slate-900 dark:text-white">
            ${totalPrice > 0 ? totalPrice.toFixed(2) : pricePerHour}
          </span>
          <span className="text-xs text-slate-500 ml-1">({durationInHours > 0 ? durationInHours : 1} hr)</span>
        </div>
        <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold">
          <FiCreditCard className="w-4 h-4" />
          <span>1 Credit</span>
        </div>
      </div>
    </div>
  );
}
