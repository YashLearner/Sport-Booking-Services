import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiUsers, FiClock, FiCheckCircle, FiXCircle, FiArrowRight, FiActivity } from "react-icons/fi";

const SPORT_COLORS = {
  badminton: "from-emerald-500 to-teal-600",
  football: "from-green-600 to-emerald-700",
  tennis: "from-amber-500 to-orange-600",
  basketball: "from-blue-600 to-indigo-700",
  default: "from-teal-600 to-emerald-700",
};

export default function CourtCard({ court }) {
  const { _id, name, location, pricePerHour, capacity, isAvailable } = court;

  // Determine gradient header style
  const lowerName = name.toLowerCase();
  let sportType = "default";
  if (lowerName.includes("badminton")) sportType = "badminton";
  else if (lowerName.includes("football") || lowerName.includes("turf")) sportType = "football";
  else if (lowerName.includes("tennis")) sportType = "tennis";
  else if (lowerName.includes("basketball")) sportType = "basketball";

  const gradientClass = SPORT_COLORS[sportType] || SPORT_COLORS.default;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-slate-800 rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-700/60 shadow-lg hover:shadow-xl transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Card Banner Header */}
        <div className={`h-36 bg-gradient-to-br ${gradientClass} p-5 text-white relative flex flex-col justify-between overflow-hidden`}>
          <div className="flex items-center justify-between z-10">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
              {sportType !== "default" ? sportType : "Sports Court"}
            </span>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-sm ${
                isAvailable
                  ? "bg-emerald-500 text-white"
                  : "bg-rose-500 text-white"
              }`}
            >
              {isAvailable ? (
                <>
                  <FiCheckCircle className="w-3.5 h-3.5" />
                  <span>Available</span>
                </>
              ) : (
                <>
                  <FiXCircle className="w-3.5 h-3.5" />
                  <span>Booked</span>
                </>
              )}
            </span>
          </div>

          <div className="z-10">
            <h3 className="text-xl font-extrabold truncate drop-shadow-sm">
              {name}
            </h3>
          </div>

          {/* Decorative background circle */}
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-xl pointer-events-none" />
        </div>

        {/* Details Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
            <FiMapPin className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
            <span className="truncate font-medium">{location}</span>
          </div>

          <div className="flex items-center text-slate-500 dark:text-slate-400 text-sm">
            <FiUsers className="w-4 h-4 mr-2 text-emerald-600 flex-shrink-0" />
            <span>Capacity: <strong className="text-slate-800 dark:text-slate-200">{capacity} Players</strong></span>
          </div>
        </div>
      </div>

      {/* Footer / Price & Action */}
      <div className="p-5 pt-0 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/60 mt-2 pt-4">
        <div>
          <p className="text-[10px] uppercase font-bold text-slate-400">Price Rate</p>
          <p className="text-lg font-extrabold text-slate-900 dark:text-white">
            ${pricePerHour} <span className="text-xs font-medium text-slate-500">/ hour</span>
          </p>
        </div>

        <Link
          to={`/courts/${_id}`}
          className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-600/20 group-hover:px-5"
        >
          <span>Book Court</span>
          <FiArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </motion.div>
  );
}
