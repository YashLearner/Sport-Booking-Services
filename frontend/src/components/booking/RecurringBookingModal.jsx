import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { createRecurringBooking, selectBookingsActionLoading } from "../../features/bookings/bookingsSlice";
import LoadingSpinner from "../common/LoadingSpinner";
import { FiCalendar, FiRepeat, FiCreditCard, FiX, FiCheckCircle } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

export default function RecurringBookingModal({ court, slot, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const actionLoading = useSelector(selectBookingsActionLoading);

  const [weeks, setWeeks] = useState(4);
  const [startDate, setStartDate] = useState(slot?.bookingDate || new Date().toISOString().split("T")[0]);

  if (!isOpen || !court) return null;

  const duration = slot?.duration || 1;
  const singleSlotPrice = duration * (court?.pricePerHour || 25);
  const totalCost = singleSlotPrice * weeks;
  const userBalance = user?.walletBalance ?? user?.credits ?? 0;
  const hasEnoughBalance = userBalance >= totalCost;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasEnoughBalance) {
      toast.error(
        `You need $${totalCost.toFixed(2)} for a ${weeks}-week recurring booking, but your wallet balance is only $${userBalance.toFixed(2)}.`
      );
      return;
    }

    try {
      await dispatch(
        createRecurringBooking({
          courtId: court._id,
          startDate,
          weeks: Number(weeks),
          startTime: slot.startTime || "10:00",
          endTime: slot.endTime || "11:00",
        })
      ).unwrap();

      toast.success(`Recurring weekly booking created for ${weeks} weeks ($${totalCost.toFixed(2)})!`);
      onClose();
    } catch (err) {
      toast.error(err || "Failed to create recurring booking.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-700/60 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <FiRepeat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Recurring Weekly Booking
              </h3>
              <p className="text-xs text-slate-400">{court.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Start Date */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          {/* Weeks Count */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Duration (Weeks)
            </label>
            <select
              value={weeks}
              onChange={(e) => setWeeks(Number(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            >
              {[1, 2, 3, 4, 6, 8, 12].map((w) => (
                <option key={w} value={w}>
                  {w} {w === 1 ? "Week" : "Weeks"} (${(singleSlotPrice * w).toFixed(2)})
                </option>
              ))}
            </select>
          </div>

          {/* Time Slot Display */}
          <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-1">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Time Slot:</span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {slot?.startTime || "10:00"} - {slot?.endTime || "11:00"}
              </strong>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Total Price ({weeks} Weeks):</span>
              <strong className="font-extrabold text-emerald-600 dark:text-emerald-400">
                ${totalCost.toFixed(2)} USD
              </strong>
            </div>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            disabled={actionLoading || !hasEnoughBalance}
            className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {actionLoading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <FiCheckCircle className="w-5 h-5" />
                <span>Confirm ${totalCost.toFixed(2)} Recurring Reservation</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
