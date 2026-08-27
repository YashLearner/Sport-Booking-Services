import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchCourts,
  selectAllCourts,
  selectCourtsStatus,
} from "../features/courts/courtSlice";
import CourtCard from "../components/court/CourtCard";
import SkeletonCard from "../components/common/SkeletonCard";
import {
  FiActivity,
  FiSearch,
  FiZap,
  FiShield,
  FiCalendar,
  FiAward,
  FiArrowRight,
} from "react-icons/fi";

export default function Home() {
  const dispatch = useDispatch();
  const courts = useSelector(selectAllCourts);
  const status = useSelector(selectCourtsStatus);

  useEffect(() => {
    dispatch(fetchCourts());
  }, [dispatch]);

  const isLoading = status === "loading";
  const featuredCourts = courts.slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-900 via-slate-900 to-slate-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-emerald-400 text-xs font-bold uppercase tracking-wider backdrop-blur-md"
          >
            <FiZap className="w-4 h-4 animate-bounce" />
            <span>Instant Sports Arena Booking System</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight"
          >
            Book Sports Courts in Seconds. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Play Anywhere, Anytime.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            Reserve verified badminton courts, turf football grounds, and tennis courts. Real-time availability, recurring slots, and instant wallet refunds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              to="/courts"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base rounded-2xl shadow-lg shadow-emerald-500/30 transition-all flex items-center justify-center space-x-2 group"
            >
              <FiSearch className="w-5 h-5" />
              <span>Explore All Courts</span>
              <FiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold text-base rounded-2xl border border-white/20 backdrop-blur-md transition-all flex items-center justify-center space-x-2"
            >
              <span>Get Free $100 Balance</span>
            </Link>
          </motion.div>
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </section>

      {/* Popular Sports Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Available Venues
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            Top-rated courts ready for your next competitive match
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredCourts.map((court) => (
              <CourtCard key={court._id} court={court} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to="/courts"
            className="inline-flex items-center space-x-2 text-sm font-bold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            <span>Browse all sports courts</span>
            <FiArrowRight />
          </Link>
        </div>
      </section>

      {/* Why Choose CourtHub */}
      <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-3xl max-w-7xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Engineered for Performance
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold mt-1">
                Why Book With CourtHub?
              </h2>
            </div>
            <Link
              to="/register"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20"
            >
              Sign Up Now ($100 Bonus)
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureBox
              icon={<FiShield className="w-7 h-7 text-emerald-400" />}
              title="Zero Double Bookings"
              desc="ACID compliant MongoDB transactions ensure your time slot is locked in real-time."
            />
            <FeatureBox
              icon={<FiCalendar className="w-7 h-7 text-emerald-400" />}
              title="Weekly Recurring Slots"
              desc="Reserve your favorite weekly match slot automatically with one-click recurring options."
            />
            <FeatureBox
              icon={<FiAward className="w-7 h-7 text-emerald-400" />}
              title="Wallet Balance & Ledger"
              desc="Enjoy transparent wallet balance management and instant refunds upon booking cancellation."
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureBox({ icon, title, desc }) {
  return (
    <div className="p-8 bg-emerald-900/40 rounded-3xl border border-emerald-800/60 backdrop-blur-md space-y-3">
      <div className="p-3 bg-emerald-500/20 rounded-2xl w-fit">{icon}</div>
      <h3 className="text-lg font-bold text-white">{title}</h3>
      <p className="text-sm text-emerald-200 leading-relaxed">{desc}</p>
    </div>
  );
}
