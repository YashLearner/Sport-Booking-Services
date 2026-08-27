import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSearchFilter,
  setLocationFilter,
  setAvailabilityFilter,
  setSortByPrice,
  resetFilters,
  selectCourtFilters,
  selectAllCourts,
} from "../../features/courts/courtSlice";
import { FiSearch, FiMapPin, FiDollarSign, FiFilter, FiRotateCcw } from "react-icons/fi";

export default function CourtFilter() {
  const dispatch = useDispatch();
  const filters = useSelector(selectCourtFilters);
  const courts = useSelector(selectAllCourts);

  // Extract unique locations from courts
  const locations = ["all", ...new Set(courts.map((c) => c.location).filter(Boolean))];

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-3">
        <div className="flex items-center space-x-2 text-slate-800 dark:text-white font-bold">
          <FiFilter className="text-emerald-600 w-5 h-5" />
          <span>Search & Filter Courts</span>
        </div>
        <button
          onClick={() => dispatch(resetFilters())}
          className="flex items-center space-x-1 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <FiRotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search Bar */}
        <div className="relative flex items-center">
          <FiSearch className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by court name or venue..."
            value={filters.search}
            onChange={(e) => dispatch(setSearchFilter(e.target.value))}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          />
        </div>

        {/* Location Select */}
        <div className="relative flex items-center">
          <FiMapPin className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
          <select
            value={filters.location}
            onChange={(e) => dispatch(setLocationFilter(e.target.value))}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 capitalize"
          >
            {locations.map((loc) => (
              <option key={loc} value={loc} className="capitalize">
                {loc === "all" ? "All Locations" : loc}
              </option>
            ))}
          </select>
        </div>

        {/* Price Sorting */}
        <div className="relative flex items-center">
          <FiDollarSign className="absolute left-3.5 text-slate-400 w-4 h-4 pointer-events-none" />
          <select
            value={filters.sortByPrice}
            onChange={(e) => dispatch(setSortByPrice(e.target.value))}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
          >
            <option value="none">Sort by Price: Default</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center space-x-1 p-1 bg-slate-100 dark:bg-slate-900/80 rounded-xl">
          <button
            onClick={() => dispatch(setAvailabilityFilter("all"))}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filters.availability === "all"
                ? "bg-white dark:bg-slate-800 text-emerald-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            All Status
          </button>
          <button
            onClick={() => dispatch(setAvailabilityFilter("available"))}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
              filters.availability === "available"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            Available
          </button>
        </div>
      </div>
    </div>
  );
}
