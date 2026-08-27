import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAdminBookings, selectAdminBookings } from "../../features/admin/adminSlice";
import { formatBookingDate, formatTimeRange } from "../../utils/dateHelpers";
import SkeletonCard from "../../components/common/SkeletonCard";
import { FiCalendar, FiSearch, FiCheckCircle, FiXCircle, FiUser } from "react-icons/fi";

const STATUS_STYLES = {
  Booked: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300",
  Cancelled: "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300",
  Completed: "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300",
};

export default function AdminBookings() {
  const dispatch = useDispatch();
  const bookings = useSelector(selectAdminBookings);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(fetchAdminBookings()).finally(() => setLoading(false));
  }, [dispatch]);

  const filteredBookings = bookings.filter((b) => {
    const courtName = b.court?.name || "";
    const userName = b.user?.name || "";
    const userEmail = b.user?.email || "";
    const query = search.toLowerCase();

    return (
      !search ||
      courtName.toLowerCase().includes(query) ||
      userName.toLowerCase().includes(query) ||
      userEmail.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          All System Bookings
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Inspect reservations across all users and venues
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <FiSearch className="absolute left-3.5 top-3 text-slate-400 w-4 h-4 pointer-events-none" />
        <input
          type="text"
          placeholder="Filter by court, user name, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
        />
      </div>

      {loading ? (
        <div className="space-y-3">
          <SkeletonCard />
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-4">User</th>
                  <th className="p-4">Court Venue</th>
                  <th className="p-4">Booking Date</th>
                  <th className="p-4">Time Range</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-200">
                {filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-slate-400">
                      No system bookings found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((booking) => (
                    <tr key={booking._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                      <td className="p-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {booking.user?.name || "Member"}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {booking.user?.email}
                        </div>
                      </td>
                      <td className="p-4 font-semibold text-slate-900 dark:text-white">
                        {booking.court?.name || "Court Arena"}
                      </td>
                      <td className="p-4">
                        {formatBookingDate(booking.bookingDate)}
                      </td>
                      <td className="p-4 font-mono">
                        {formatTimeRange(booking.startTime, booking.endTime)}
                      </td>
                      <td className="p-4 font-bold">
                        ${booking.totalPrice}
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            STATUS_STYLES[booking.status] || STATUS_STYLES.Completed
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
