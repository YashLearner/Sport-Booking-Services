import React from "react";
import { Outlet, NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/auth/authSlice";
import { useTheme } from "../context/ThemeContext";
import { Toaster } from "react-hot-toast";
import {
  FiGrid,
  FiActivity,
  FiCalendar,
  FiUsers,
  FiSun,
  FiMoon,
  FiLogOut,
  FiArrowLeft,
  FiShield,
} from "react-icons/fi";

const AdminLayout = () => {
  const { user } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-3 px-4 py-3 rounded-xl font-medium text-sm transition-all ${
      isActive
        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
        : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
    }`;

  return (
    <div className="min-h-screen flex bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
      <Toaster position="top-right" />

      {/* Admin Sidebar */}
      <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between p-4 sticky top-0 h-screen">
        <div className="space-y-6">
          {/* Admin Header / Brand */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold">
                <FiShield className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-slate-900 dark:text-white">
                  Admin Panel
                </span>
                <span className="text-[10px] text-slate-400 font-medium -mt-1">
                  Court Management
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <NavLink to="/admin" end className={navLinkClass}>
              <FiGrid className="w-5 h-5" />
              <span>Overview Dashboard</span>
            </NavLink>
            <NavLink to="/admin/courts" className={navLinkClass}>
              <FiActivity className="w-5 h-5" />
              <span>Manage Courts</span>
            </NavLink>
            <NavLink to="/admin/bookings" className={navLinkClass}>
              <FiCalendar className="w-5 h-5" />
              <span>All Bookings</span>
            </NavLink>
            <NavLink to="/admin/users" className={navLinkClass}>
              <FiUsers className="w-5 h-5" />
              <span>Manage Users</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Sidebar Action */}
        <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Link
            to="/"
            className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 py-1 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Public Site</span>
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 hover:bg-rose-100 rounded-xl text-sm font-semibold transition-colors"
          >
            <FiLogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Admin Topbar */}
        <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center space-x-3">
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">
              Administrator Console
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {isDark ? <FiSun className="text-amber-400" /> : <FiMoon />}
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-amber-500 text-white font-bold text-sm flex items-center justify-center">
                {user?.name?.charAt(0) || "A"}
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-bold text-slate-800 dark:text-white">
                  {user?.name}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold uppercase">
                  Super Admin
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Content Outlet */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
