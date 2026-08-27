import React from "react";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { selectMyBookings } from "../features/bookings/bookingsSlice";
import {
  FiUser,
  FiMail,
  FiShield,
  FiCreditCard,
  FiCheckCircle,
  FiPlusCircle,
  FiMinusCircle,
  FiRotateCcw,
} from "react-icons/fi";

export default function Profile() {
  const { user } = useSelector((state) => state.auth);
  const bookings = useSelector(selectMyBookings);

  const walletBalance = (user?.walletBalance ?? user?.credits ?? 100.0).toFixed(2);

  // Derive monetary ledger entries from bookings & signup bonus
  const ledgerEntries = [
    {
      id: "initial-balance",
      type: "INITIAL_BALANCE",
      description: "Initial Sign-Up Wallet Bonus",
      amount: "+$100.00",
      date: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "Account Registration",
    },
    ...bookings.map((b) => ({
      id: b._id,
      type: b.status === "Cancelled" ? "BOOKING_REFUND" : "BOOKING_PAYMENT",
      description:
        b.status === "Cancelled"
          ? `Booking Refund - ${b.court?.name || "Court Arena"}`
          : `Booking Payment - ${b.court?.name || "Court Arena"}`,
      amount: b.status === "Cancelled" ? `+$${(b.totalPrice || 0).toFixed(2)}` : `-$${(b.totalPrice || 0).toFixed(2)}`,
      date: new Date(b.createdAt || b.bookingDate).toLocaleDateString(),
    })),
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
          <div className="w-24 h-24 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white font-extrabold text-4xl flex items-center justify-center shadow-lg uppercase">
            {user?.name?.charAt(0) || "U"}
          </div>
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <h1 className="text-3xl font-extrabold">{user?.name}</h1>
              <span className="px-2.5 py-0.5 text-xs font-bold uppercase rounded-full bg-white/20 border border-white/30 backdrop-blur-md">
                {user?.role}
              </span>
            </div>
            <p className="text-emerald-100 font-medium">{user?.email}</p>
            <div className="pt-2 flex items-center space-x-2">
              <span className="px-3 py-1 bg-white text-emerald-700 rounded-full text-xs font-bold flex items-center space-x-1 shadow-sm">
                <FiCheckCircle className="w-3.5 h-3.5" />
                <span>Verified Account</span>
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Wallet Balance Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wallet Balance
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <FiCreditCard className="w-6 h-6" />
            </div>
          </div>
          <div className="my-4">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              ${walletBalance}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-xs ml-2 font-medium">
              USD Available
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Funds are automatically deducted when reserving court slots.
          </p>
        </motion.div>

        {/* Account Metadata */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-4"
        >
          <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
            Account Information
          </h2>

          <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <FiUser className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">Full Name</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {user?.name}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <FiMail className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">Email Address</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white">
                {user?.email}
              </span>
            </div>

            <div className="py-3 flex justify-between items-center">
              <div className="flex items-center space-x-3 text-slate-600 dark:text-slate-300">
                <FiShield className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-medium">Account Role</span>
              </div>
              <span className="font-semibold text-slate-900 dark:text-white capitalize">
                {user?.role}
              </span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Wallet Ledger / Activity */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center space-x-2">
            <FiCreditCard className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Wallet Transaction History
            </h2>
          </div>
          <span className="text-xs text-slate-400">
            Real-time balance activity
          </span>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-700/60">
          {ledgerEntries.map((entry) => (
            <div
              key={entry.id}
              className="py-3.5 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-700/30 px-3 rounded-2xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`p-2 rounded-xl text-sm ${
                    entry.type === "BOOKING_PAYMENT"
                      ? "bg-rose-100 dark:bg-rose-950/60 text-rose-600"
                      : entry.type === "BOOKING_REFUND"
                      ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600"
                      : "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600"
                  }`}
                >
                  {entry.type === "BOOKING_PAYMENT" && <FiMinusCircle />}
                  {entry.type === "BOOKING_REFUND" && <FiRotateCcw />}
                  {entry.type === "INITIAL_BALANCE" && <FiPlusCircle />}
                </div>
                <div>
                  <p className="font-bold text-sm text-slate-900 dark:text-white">
                    {entry.description}
                  </p>
                  <p className="text-xs text-slate-400">{entry.date}</p>
                </div>
              </div>

              <div className="text-right">
                <span
                  className={`font-extrabold text-sm ${
                    entry.type === "BOOKING_PAYMENT"
                      ? "text-rose-600 dark:text-rose-400"
                      : "text-emerald-600 dark:text-emerald-400"
                  }`}
                >
                  {entry.amount}
                </span>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">
                  {entry.type}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
