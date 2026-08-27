import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  fetchCourtById,
  selectSelectedCourt,
  selectCourtsStatus,
  selectCourtsError,
} from "../features/courts/courtSlice";
import { createBooking, selectBookingsActionLoading } from "../features/bookings/bookingsSlice";
import SlotPicker from "../components/court/SlotPicker";
import RecurringBookingModal from "../components/booking/RecurringBookingModal";
import WaitlistModal from "../components/waitlist/WaitlistModal";
import SkeletonCard from "../components/common/SkeletonCard";
import LoadingSpinner from "../components/common/LoadingSpinner";
import useAuth from "../hooks/useAuth";
import {
  FiMapPin,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiXCircle,
  FiCreditCard,
  FiArrowLeft,
  FiZap,
  FiRepeat,
  FiUserPlus,
} from "react-icons/fi";

export default function CourtDetailsPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const court = useSelector(selectSelectedCourt);
  const status = useSelector(selectCourtsStatus);
  const error = useSelector(selectCourtsError);
  const actionLoading = useSelector(selectBookingsActionLoading);

  const [isRecurringModalOpen, setIsRecurringModalOpen] = useState(false);
  const [isWaitlistModalOpen, setIsWaitlistModalOpen] = useState(false);

  const [selectedSlot, setSelectedSlot] = useState({
    bookingDate: new Date().toISOString().split("T")[0],
    startTime: "10:00",
    endTime: "11:00",
    duration: 1,
    totalPrice: 0,
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchCourtById(id));
    }
  }, [dispatch, id]);

  const isLoading = status === "loading" || !court;

  const handleBookingAction = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to book a court slot.");
      navigate("/login", { state: { from: { pathname: `/courts/${id}` } } });
      return;
    }

    const price = selectedSlot.totalPrice > 0 ? selectedSlot.totalPrice : (court?.pricePerHour || 25);
    const userBal = user?.walletBalance ?? user?.credits ?? 0;

    if (userBal < price) {
      toast.error(`Insufficient wallet balance! Total price is $${price.toFixed(2)}, but your wallet has $${userBal.toFixed(2)}.`);
      return;
    }

    try {
      await dispatch(
        createBooking({
          courtId: court._id,
          bookingDate: selectedSlot.bookingDate,
          startTime: selectedSlot.startTime,
          endTime: selectedSlot.endTime,
        })
      ).unwrap();

      toast.success("Court booking created successfully!");
      navigate("/my-bookings");
    } catch (errMessage) {
      toast.error(errMessage || "Failed to reserve slot.");
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !court) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <p className="text-rose-500 font-bold">{error || "Court not found"}</p>
        <Link
          to="/courts"
          className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold"
        >
          <FiArrowLeft />
          <span>Back to Courts</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <Link
        to="/courts"
        className="inline-flex items-center space-x-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
      >
        <FiArrowLeft className="w-4 h-4" />
        <span>Back to all courts</span>
      </Link>

      {/* Court Detail Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-800 rounded-3xl p-8 text-white shadow-xl space-y-6 relative overflow-hidden"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 z-10 relative">
          <div className="space-y-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100">
              Verified Venue
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold">{court.name}</h1>
            <p className="flex items-center text-sm text-emerald-100">
              <FiMapPin className="mr-2 flex-shrink-0" />
              <span>{court.location}</span>
            </p>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
            <div>
              <p className="text-[10px] font-bold text-emerald-100 uppercase tracking-wider">
                Price Rate
              </p>
              <p className="text-2xl font-extrabold">${court.pricePerHour} <span className="text-xs font-normal">/ hr</span></p>
            </div>
          </div>
        </div>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-white/15 text-xs">
          <div className="flex items-center space-x-2">
            <FiUsers className="w-4 h-4 text-emerald-300" />
            <span>Capacity: <strong>{court.capacity} Players</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <FiZap className="w-4 h-4 text-emerald-300" />
            <span>Status: <strong>{court.isAvailable ? "Available for Rent" : "Currently Occupied"}</strong></span>
          </div>
          <div className="flex items-center space-x-2">
            <FiCreditCard className="w-4 h-4 text-emerald-300" />
            <span>Rate: <strong>${court.pricePerHour} / hour</strong></span>
          </div>
        </div>
      </motion.div>

      {/* Booking Slot Selection Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Choose Reservation Slot
          </h2>
          <SlotPicker
            pricePerHour={court.pricePerHour}
            onSelectSlot={(slot) => setSelectedSlot(slot)}
          />
        </div>

        {/* Reservation Summary Action Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700/60 pb-3">
              Booking Options
            </h3>

            <div className="space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <div className="flex justify-between">
                <span>Venue:</span>
                <strong className="text-slate-900 dark:text-white">{court.name}</strong>
              </div>
              <div className="flex justify-between">
                <span>Date:</span>
                <strong className="text-slate-900 dark:text-white">{selectedSlot.bookingDate}</strong>
              </div>
              <div className="flex justify-between">
                <span>Time Range:</span>
                <strong className="text-slate-900 dark:text-white">{selectedSlot.startTime} - {selectedSlot.endTime}</strong>
              </div>
              <div className="flex justify-between border-t border-slate-100 dark:border-slate-700/60 pt-2 font-bold text-slate-900 dark:text-white">
                <span>Total Amount:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
                  ${selectedSlot.totalPrice > 0 ? selectedSlot.totalPrice.toFixed(2) : court.pricePerHour.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {/* Standard Single Booking */}
            <button
              onClick={handleBookingAction}
              disabled={actionLoading}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {actionLoading ? (
                <LoadingSpinner size="sm" text="" />
              ) : (
                <>
                  <FiCheckCircle className="w-5 h-5" />
                  <span>Reserve Single Slot</span>
                </>
              )}
            </button>

            {/* Recurring Booking Option */}
            <button
              onClick={() => setIsRecurringModalOpen(true)}
              className="w-full py-2.5 bg-teal-50 dark:bg-teal-950/40 hover:bg-teal-100 text-teal-700 dark:text-teal-300 font-bold rounded-2xl border border-teal-200 dark:border-teal-800 transition-all text-xs flex items-center justify-center space-x-2"
            >
              <FiRepeat className="w-4 h-4" />
              <span>Book Recurring (Weekly)</span>
            </button>

            {/* Join Waitlist Option */}
            <button
              onClick={() => setIsWaitlistModalOpen(true)}
              className="w-full py-2 text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 font-medium text-xs flex items-center justify-center space-x-1.5 transition-colors"
            >
              <FiUserPlus className="w-4 h-4" />
              <span>Join Slot Waitlist</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RecurringBookingModal
        court={court}
        slot={selectedSlot}
        isOpen={isRecurringModalOpen}
        onClose={() => setIsRecurringModalOpen(false)}
      />

      <WaitlistModal
        court={court}
        slot={selectedSlot}
        isOpen={isWaitlistModalOpen}
        onClose={() => setIsWaitlistModalOpen(false)}
      />
    </div>
  );
}
