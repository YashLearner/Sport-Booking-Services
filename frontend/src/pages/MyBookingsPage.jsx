import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  fetchMyBookings,
  cancelBooking,
  selectMyBookings,
  selectMyBookingsStatus,
  selectMyBookingsError,
  selectBookingsActionLoading,
} from "../features/bookings/bookingsSlice";
import {
  fetchMyWaitlist,
  selectMyWaitlist,
} from "../features/waitlist/waitlistSlice";
import BookingCard from "../components/booking/BookingCard";
import SkeletonCard from "../components/common/SkeletonCard";
import { isUpcoming, formatBookingDate, formatTimeRange } from "../utils/dateHelpers";
import { FiCalendar, FiSearch, FiFilter, FiCreditCard, FiInbox, FiRefreshCw, FiUserPlus } from "react-icons/fi";
import useAuth from "../hooks/useAuth";

export default function MyBookingsPage() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const bookings = useSelector(selectMyBookings);
  const waitlist = useSelector(selectMyWaitlist);
  const status = useSelector(selectMyBookingsStatus);
  const error = useSelector(selectMyBookingsError);

  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchMyWaitlist());
  }, [dispatch]);

  const handleCancelBooking = async (id) => {
    try {
      const res = await dispatch(cancelBooking(id)).unwrap();
      const refunded = res?.totalPrice ? `$${res.totalPrice.toFixed(2)}` : "Amount";
      toast.success(`Booking cancelled successfully! ${refunded} refunded to your wallet.`);
    } catch (errMessage) {
      toast.error(errMessage || "Failed to cancel booking.");
    }
  };

  const isLoading = status === "loading";
  const walletBal = (user?.walletBalance ?? user?.credits ?? 100.0).toFixed(2);

  // Filter bookings based on activeTab and searchQuery
  const filteredBookings = bookings.filter((booking) => {
    const courtName = booking.court?.name || "";
    const courtLoc = booking.court?.location || "";
    const matchesSearch =
      !searchQuery ||
      courtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      courtLoc.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "upcoming") {
      return matchesSearch && booking.status === "Booked" && isUpcoming(booking);
    }
    if (activeTab === "completed") {
      return matchesSearch && (booking.status === "Completed" || (booking.status === "Booked" && !isUpcoming(booking)));
    }
    if (activeTab === "cancelled") {
      return matchesSearch && booking.status === "Cancelled";
    }
    return matchesSearch;
  });

  const upcomingCount = bookings.filter((b) => b.status === "Booked" && isUpcoming(b)).length;
  const completedCount = bookings.filter((b) => b.status === "Completed" || (b.status === "Booked" && !isUpcoming(b))).length;
  const cancelledCount = bookings.filter((b) => b.status === "Cancelled").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
            Reservation Management
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Court Bookings & Waitlist
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            View upcoming matches, booking history, and waitlisted slots
          </p>
        </div>

        <div className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-2xl border border-emerald-200 dark:border-emerald-800 text-xs font-bold w-fit">
          <FiCreditCard className="w-4 h-4" />
          <span>Wallet Balance: ${walletBal} USD</span>
        </div>
      </div>

      {/* Filter Toolbar & Search */}
      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Status Tabs */}
        <div className="flex items-center space-x-1.5 p-1.5 bg-slate-100 dark:bg-slate-900/80 rounded-2xl w-full md:w-auto overflow-x-auto">
          <TabButton
            active={activeTab === "all"}
            onClick={() => setActiveTab("all")}
            label="All Bookings"
            count={bookings.length}
          />
          <TabButton
            active={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
            label="Upcoming"
            count={upcomingCount}
          />
          <TabButton
            active={activeTab === "completed"}
            onClick={() => setActiveTab("completed")}
            label="Completed"
            count={completedCount}
          />
          <TabButton
            active={activeTab === "cancelled"}
            onClick={() => setActiveTab("cancelled")}
            label="Cancelled"
            count={cancelledCount}
          />
          <TabButton
            active={activeTab === "waitlist"}
            onClick={() => setActiveTab("waitlist")}
            label="My Waitlist"
            count={waitlist.length}
          />
        </div>

        {/* Search Input */}
        <div className="relative flex items-center w-full md:w-72">
          <FiSearch className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by court or venue..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
      </div>

      {/* Content Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : activeTab === "waitlist" ? (
        /* Waitlist Tab */
        waitlist.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
              <FiUserPlus className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No Active Waitlist Entries
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              You haven't joined a waitlist for any court slots yet.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {waitlist.map((item) => (
              <div
                key={item._id}
                className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 rounded-full text-xs font-bold uppercase tracking-wider">
                    Status: {item.status || "Waiting"}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">Waitlist ID</span>
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                  {item.court?.name || "Court Arena"}
                </h4>
                <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-2xl text-xs space-y-1">
                  <p>Date: <strong>{formatBookingDate(item.bookingDate)}</strong></p>
                  <p>Time Range: <strong>{formatTimeRange(item.startTime, item.endTime)}</strong></p>
                </div>
              </div>
            ))}
          </div>
        )
      ) : filteredBookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
            <FiInbox className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            No Bookings Found
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            {activeTab === "all"
              ? "You haven't made any court reservations yet."
              : `No ${activeTab} reservations match your current filters.`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              onCancel={handleCancelBooking}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({ active, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
        active
          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
      }`}
    >
      <span>{label}</span>
      <span
        className={`px-1.5 py-0.5 rounded-full text-[10px] ${
          active
            ? "bg-white/20 text-white"
            : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
        }`}
      >
        {count}
      </span>
    </button>
  );
}
