import React from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { joinWaitlist, selectWaitlistActionLoading } from "../../features/waitlist/waitlistSlice";
import LoadingSpinner from "../common/LoadingSpinner";
import { FiClock, FiCalendar, FiUserPlus, FiX, FiCheckCircle } from "react-icons/fi";
import useAuth from "../../hooks/useAuth";

export default function WaitlistModal({ court, slot, isOpen, onClose }) {
  const dispatch = useDispatch();
  const { isAuthenticated } = useAuth();
  const actionLoading = useSelector(selectWaitlistActionLoading);

  if (!isOpen || !court) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error("Please sign in to join the waitlist.");
      return;
    }

    try {
      await dispatch(
        joinWaitlist({
          courtId: court._id,
          bookingDate: slot.bookingDate || new Date().toISOString().split("T")[0],
          startTime: slot.startTime || "10:00",
          endTime: slot.endTime || "11:00",
        })
      ).unwrap();

      toast.success("Joined waitlist! You will be automatically promoted if a slot opens up.");
      onClose();
    } catch (err) {
      toast.error(err || "Failed to join waitlist.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-700/60 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 rounded-xl">
              <FiUserPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                Join Slot Waitlist
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

        {/* Slot Info */}
        <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-700/60 space-y-2 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Date:</span>
            <strong className="font-bold text-slate-900 dark:text-white">
              {slot?.bookingDate || new Date().toISOString().split("T")[0]}
            </strong>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-slate-300">
            <span>Time Range:</span>
            <strong className="font-bold text-slate-900 dark:text-white">
              {slot?.startTime || "10:00"} - {slot?.endTime || "11:00"}
            </strong>
          </div>
          <p className="text-[11px] text-amber-600 dark:text-amber-400 pt-2 leading-relaxed font-medium">
            💡 If another player cancels this slot, the oldest waitlisted player with available credits is automatically promoted and booked!
          </p>
        </div>

        {/* Submit Action */}
        <button
          onClick={handleSubmit}
          disabled={actionLoading}
          className="w-full py-3 bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white font-extrabold rounded-2xl shadow-lg shadow-amber-500/20 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {actionLoading ? (
            <LoadingSpinner size="sm" text="" />
          ) : (
            <>
              <FiCheckCircle className="w-5 h-5" />
              <span>Join Waitlist Now</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
