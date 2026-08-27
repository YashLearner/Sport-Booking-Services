import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  fetchAdminStats,
  fetchAdminBookings,
  fetchAdminUsers,
  selectAdminStats,
  selectAdminBookings,
  selectAdminUsers,
} from "../../features/admin/adminSlice";
import { fetchCourts, selectAllCourts } from "../../features/courts/courtSlice";
import { FiActivity, FiCalendar, FiUsers, FiDollarSign, FiShield, FiArrowRight } from "react-icons/fi";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const courts = useSelector(selectAllCourts);
  const bookings = useSelector(selectAdminBookings);
  const users = useSelector(selectAdminUsers);
  const stats = useSelector(selectAdminStats);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchCourts());
    dispatch(fetchAdminBookings());
    dispatch(fetchAdminUsers());
  }, [dispatch]);

  const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  return (
    <div className="space-y-8">
      {/* Overview Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between"
      >
        <div className="space-y-2">
          <span className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-amber-400 text-xs font-bold uppercase tracking-wider">
            Super Admin Access
          </span>
          <h1 className="text-3xl font-extrabold">System Administration Overview</h1>
          <p className="text-slate-400 text-sm">
            Monitor system performance, court inventory, reservations, and user accounts.
          </p>
        </div>
      </motion.div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          icon={<FiActivity className="w-6 h-6 text-emerald-600" />}
          label="Total Courts"
          value={courts.length}
          description="Active sports venues"
        />
        <MetricCard
          icon={<FiCalendar className="w-6 h-6 text-cyan-600" />}
          label="Total Bookings"
          value={bookings.length}
          description="System reservations"
        />
        <MetricCard
          icon={<FiUsers className="w-6 h-6 text-amber-500" />}
          label="Registered Users"
          value={users.length}
          description="User accounts"
        />
        <MetricCard
          icon={<FiDollarSign className="w-6 h-6 text-teal-600" />}
          label="Estimated Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          description="Gross booking value"
        />
      </div>

      {/* Admin Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AdminTile
          to="/admin/courts"
          title="Manage Courts & Venues"
          description="Create new courts, update pricing, toggle availability, or delete existing venues."
          icon={<FiActivity className="w-6 h-6 text-emerald-600" />}
        />
        <AdminTile
          to="/admin/bookings"
          title="View All Bookings"
          description="Inspect every court reservation, user assignment, time slot, and booking status."
          icon={<FiCalendar className="w-6 h-6 text-cyan-600" />}
        />
        <AdminTile
          to="/admin/users"
          title="Manage User Accounts"
          description="View registered user profiles, roles, available credit balances, and system privileges."
          icon={<FiUsers className="w-6 h-6 text-amber-500" />}
        />
      </div>
    </div>
  );
}

function MetricCard({ icon, label, value, description }) {
  return (
    <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          {label}
        </span>
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-xl">{icon}</div>
      </div>
      <p className="text-3xl font-extrabold text-slate-900 dark:text-white">{value}</p>
      <p className="text-xs text-slate-400">{description}</p>
    </div>
  );
}

function AdminTile({ to, title, description, icon }) {
  return (
    <Link
      to={to}
      className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl transition-all group flex flex-col justify-between"
    >
      <div className="space-y-3">
        <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-2xl w-fit group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-emerald-600 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-bold text-emerald-600">
        <span>Open Module</span>
        <FiArrowRight className="ml-1 w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </Link>
  );
}
