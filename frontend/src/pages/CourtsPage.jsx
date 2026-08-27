import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import {
  fetchCourts,
  selectFilteredCourts,
  selectCourtsStatus,
  selectCourtsError,
  setSearchFilter,
} from "../features/courts/courtSlice";
import CourtFilter from "../components/court/CourtFilter";
import CourtCard from "../components/court/CourtCard";
import SkeletonCard from "../components/common/SkeletonCard";
import { FiActivity, FiInbox, FiRefreshCw } from "react-icons/fi";

export default function CourtsPage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const courts = useSelector(selectFilteredCourts);
  const status = useSelector(selectCourtsStatus);
  const error = useSelector(selectCourtsError);

  useEffect(() => {
    dispatch(fetchCourts());
    const querySearch = searchParams.get("search");
    if (querySearch) {
      dispatch(setSearchFilter(querySearch));
    }
  }, [dispatch, searchParams]);

  const isLoading = status === "loading";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
          Arena Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Browse All Sports Courts
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl">
          Filter by location, price, and real-time availability to pick your next slot.
        </p>
      </div>

      {/* Filter Toolbar */}
      <CourtFilter />

      {/* Courts Cards Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="bg-rose-50 dark:bg-rose-950/40 p-8 rounded-3xl border border-rose-200 dark:border-rose-800 text-center space-y-3">
          <p className="text-rose-600 dark:text-rose-400 font-bold">{error}</p>
          <button
            onClick={() => dispatch(fetchCourts())}
            className="px-4 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-2"
          >
            <FiRefreshCw />
            <span>Retry Loading</span>
          </button>
        </div>
      ) : courts.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-12 rounded-3xl border border-slate-100 dark:border-slate-700/60 shadow-lg text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-700/50 text-slate-400 flex items-center justify-center mx-auto">
            <FiInbox className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 dark:text-white">
            No Courts Match Your Search
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
            Try adjusting your search query, location filter, or price sorting parameters to find available arenas.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courts.map((court) => (
            <CourtCard key={court._id} court={court} />
          ))}
        </div>
      )}
    </div>
  );
}
