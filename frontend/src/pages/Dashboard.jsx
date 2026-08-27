import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import useAuth from "../hooks/useAuth.js";
import {
  fetchMyBookings,
  selectMyBookings,
  selectMyBookingsError,
  selectMyBookingsStatus,
} from "../features/bookings/bookingsSlice.js";
import { formatBookingDate, formatTimeRange, isUpcoming } from "../utils/dateHelpers.js";
import SkeletonCard from "../components/common/SkeletonCard.jsx";
import {
  FiCalendar,
  FiClock,
  FiCreditCard,
  FiActivity,
  FiArrowRight,
  FiUser,
  FiCheckCircle,
  FiXCircle,
} from "react-icons/fi";

const STATUS_STYLES = {
  Booked: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  Cancelled: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800",
  Completed: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700",
};

export default function Dashboard() {
  const dispatch = useDispatch();
  const { user } = useAuth();

  const bookings = useSelector(selectMyBookings);
  const status = useSelector(selectMyBookingsStatus);
  const error = useSelector(selectMyBookingsError);

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const isLoading = status === "loading";
  const upcomingBookings = bookings.filter(isUpcoming);
  const recentBookings = bookings.slice(0, 5);
  const walletBal = (user?.walletBalance ?? user?.credits ?? 100.0).toFixed(2);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-3xl p-8 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between"
      >
        <div className="space-y-2">
          <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-emerald-100">
            User Dashboard
          </span>
          <h1 className="text-3xl font-extrabold">
            Welcome back, {user?.name?.split(" ")[0]}! 👋
          </h1>
          <p className="text-emerald-100 text-sm">
            {user?.email} · Account Status: Active
          </p>
        </div>
        <div className="mt-6 md:mt-0 flex items-center space-x-3 bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/20">
          <FiCreditCard className="w-8 h-8 text-emerald-200" />
          <div>
            <p className="text-xs font-semibold text-emerald-100 uppercase tracking-wider">
              Wallet Balance
            </p>
            <p className="text-2xl font-extrabold">${walletBal} USD</p>
          </div>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          icon={<FiCalendar className="w-6 h-6 text-emerald-600" />}
          label="Total Bookings"
          value={isLoading ? "..." : bookings.length}
          description="All-time court reservations"
        />
        <MetricCard
          icon={<FiClock className="w-6 h-6 text-cyan-600" />}
          label="Upcoming Matches"
          value={isLoading ? "..." : upcomingBookings.length}
          description="Scheduled future bookings"
        />
        <MetricCard
          icon={<FiCreditCard className="w-6 h-6 text-amber-500" />}
          label="Wallet Balance"
          value={`$${walletBal}`}
          description="Available funds for court reservations"
        />
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ActionTile
            to="/courts"
            title="Browse Sports Courts"
            description="Find badminton, turf, or tennis courts nearby"
            icon={<FiActivity className="w-5 h-5 text-emerald-600" />}
          />
          <ActionTile
            to="/my-bookings"
            title="Manage My Bookings"
            description="View active slots or cancel upcoming bookings"
            icon={<FiCalendar className="w-5 h-5 text-teal-600" />}
          />
          <ActionTile
            to="/profile"
            title="Account Profile"
            description="View your user details and wallet ledger"
            icon={<FiUser className="w-5 h-5 text-cyan-600" />}
          />
        </div>
      </div>

      {/* Recent Bookings List */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Recent Reservations
          </h2>
          <Link
            to="/my-bookings"
            className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-rose-500 font-medium">
            Failed to load bookings: {error}
          </div>
        ) : recentBookings.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700/60 text-slate-400 flex items-center justify-center mx-auto">
              <FiCalendar className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-700 dark:text-slate-300">
              No bookings found
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You haven't reserved any sports courts yet. Explore available courts to place your first booking!
            </p>
            <Link
              to="/courts"
              className="inline-block mt-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              Book a Court Now
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            {recentBookings.map((booking) => (
              <div
                key={booking._id}
                className="py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/30 px-3 rounded-2xl transition-colors"
              >
                <div className="space-y-1">
                  <p className="font-bold text-slate-900 dark:text-white">
                    {booking.court?.name || "Court"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                    <span>{formatBookingDate(booking.bookingDate)}</span>
                    <span>•</span>
                    <span>{formatTimeRange(booking.startTime, booking.endTime)}</span>
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    ${booking.totalPrice}
                  </span>
                  <span
                    className={`px-3 py-1 text-xs font-bold rounded-full border ${
                      STATUS_STYLES[booking.status] || STATUS_STYLES.Completed
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, description }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="p-2 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          {icon}
        </div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">
        {value}
      </p>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

function ActionTile({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="p-5 bg-white dark:bg-slate-800 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-md hover:shadow-xl transition-all group flex items-start space-x-4"
    >
      <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div className="space-y-1">
        <h3 className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </Link>
  );
}
