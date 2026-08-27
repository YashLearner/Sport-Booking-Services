import React, { useState } from "react";
import { motion } from "framer-motion";
import { formatBookingDate, formatTimeRange, isUpcoming, canCancelBooking } from "../../utils/dateHelpers";
import { FiCalendar, FiClock, FiMapPin, FiDollarSign, FiXCircle, FiCheckCircle, FiCreditCard, FiAlertCircle } from "react-icons/fi";

const STATUS_STYLES = {
  Booked: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Cancelled: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  Completed: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export default function BookingCard({ booking, onCancel }) {
  const { _id, court, bookingDate, startTime, endTime, totalPrice, status, bookingType } = booking;
  const [showCancelModal, setShowCancelModal] = useState(false);

  const canCancel = canCancelBooking(booking);
  const upcoming = isUpcoming(booking);
  const formattedPrice = (totalPrice || 0).toFixed(2);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all space-y-4 flex flex-col justify-between"
      >
        <div className="space-y-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full text-xs font-bold uppercase tracking-wider">
              {bookingType || "Normal"} Slot
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center space-x-1 ${
                STATUS_STYLES[status] || STATUS_STYLES.Completed
              }`}
            >
              {status === "Booked" && <FiCheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
              {status === "Completed" && <FiCheckCircle className="w-3.5 h-3.5 text-slate-500" />}
              {status === "Cancelled" && <FiXCircle className="w-3.5 h-3.5" />}
              <span>{status}</span>
            </span>
          </div>

          {/* Court Info */}
          <div>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {court?.name || "Sports Court"}
            </h3>
            {court?.location && (
              <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center mt-1">
                <FiMapPin className="w-3.5 h-3.5 text-emerald-600 mr-1 flex-shrink-0" />
                <span>{court.location}</span>
              </p>
            )}
          </div>

          {/* Schedule details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-100 dark:border-slate-700/60 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <FiCalendar />
                <span>Date</span>
              </span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {formatBookingDate(bookingDate)}
              </strong>
            </div>
            <div className="flex items-center justify-between text-slate-700 dark:text-slate-300">
              <span className="flex items-center space-x-1.5 text-slate-400">
                <FiClock />
                <span>Time Range</span>
              </span>
              <strong className="font-bold text-slate-900 dark:text-white">
                {formatTimeRange(startTime, endTime)}
              </strong>
            </div>
          </div>
        </div>

        {/* Pricing & Cancel Action */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Price</span>
            <p className="text-lg font-extrabold text-slate-900 dark:text-white">
              ${formattedPrice}
            </p>
          </div>

          {canCancel && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-xl border border-rose-200 dark:border-rose-800 transition-colors flex items-center space-x-1"
            >
              <FiXCircle className="w-4 h-4" />
              <span>Cancel Booking</span>
            </button>
          )}
        </div>
      </motion.div>

      {/* Confirmation Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700/60 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
              <FiAlertCircle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Cancel Booking?
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Are you sure you want to cancel this reservation for <strong>{court?.name}</strong>?
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold pt-1">
                ✨ ${formattedPrice} will be automatically refunded to your wallet balance!
              </p>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
              >
                Keep Booking
              </button>
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  onCancel(_id);
                }}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20"
              >
                Yes, Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
