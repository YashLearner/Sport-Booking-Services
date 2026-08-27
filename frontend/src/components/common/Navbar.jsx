import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useTheme } from "../../context/ThemeContext";
import { logout } from "../../features/auth/authSlice";
import NotificationDrawer from "../notification/NotificationDrawer";
import {
  FiSun,
  FiMoon,
  FiUser,
  FiLogOut,
  FiCalendar,
  FiGrid,
  FiShield,
  FiCreditCard,
  FiMenu,
  FiX,
  FiActivity,
} from "react-icons/fi";

const Navbar = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { isDark, toggleTheme } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    setIsDropdownOpen(false);
    navigate("/login");
  };

  const navLinkClass = ({ isActive }) =>
    `flex items-center space-x-1.5 text-sm font-medium transition-colors ${
      isActive
        ? "text-emerald-600 dark:text-emerald-400 font-semibold"
        : "text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400"
    }`;

  const balance = (user?.walletBalance ?? user?.credits ?? 100.0).toFixed(2);

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FiActivity className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                Court<span className="text-emerald-600 dark:text-emerald-400">Hub</span>
              </span>
              <span className="text-[10px] tracking-widest uppercase font-medium text-slate-400 -mt-1">
                Sports Arena
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/" className={navLinkClass}>
              <span>Home</span>
            </NavLink>
            <NavLink to="/courts" className={navLinkClass}>
              <span>Browse Courts</span>
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-bookings" className={navLinkClass}>
                <span>My Bookings</span>
              </NavLink>
            )}
            {isAuthenticated && user?.role === "admin" && (
              <NavLink to="/admin" className={navLinkClass}>
                <FiShield className="w-4 h-4 text-amber-500" />
                <span>Admin Panel</span>
              </NavLink>
            )}
          </nav>

          {/* Right Action Items */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Dark Mode"
              className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDark ? (
                <FiSun className="w-5 h-5 text-amber-400" />
              ) : (
                <FiMoon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Notification Bell */}
                <NotificationDrawer />

                {/* Wallet Balance Badge */}
                <div className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 rounded-full border border-emerald-200/60 dark:border-emerald-800/60 text-xs font-semibold">
                  <FiCreditCard className="w-3.5 h-3.5" />
                  <span>${balance} Wallet</span>
                </div>

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-full border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all bg-slate-50 dark:bg-slate-800"
                  >
                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-semibold text-sm flex items-center justify-center uppercase">
                      {user?.name ? user.name.charAt(0) : "U"}
                    </div>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-200 pr-1 max-w-[100px] truncate">
                      {user?.name}
                    </span>
                  </button>

                  {isDropdownOpen && (
                    <div
                      onMouseLeave={() => setIsDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl py-2 border border-slate-100 dark:border-slate-700/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60">
                        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                          Signed in as
                        </p>
                        <p className="text-sm font-bold text-slate-800 dark:text-white truncate">
                          {user?.email}
                        </p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] uppercase font-bold rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {user?.role}
                        </span>
                      </div>

                      <Link
                        to="/profile"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <FiUser className="w-4 h-4 text-slate-400" />
                        <span>Profile & Wallet</span>
                      </Link>

                      <Link
                        to="/my-bookings"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50"
                      >
                        <FiCalendar className="w-4 h-4 text-slate-400" />
                        <span>My Bookings</span>
                      </Link>

                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setIsDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 font-medium hover:bg-amber-50 dark:hover:bg-amber-950/30"
                        >
                          <FiShield className="w-4 h-4" />
                          <span>Admin Dashboard</span>
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-t border-slate-100 dark:border-slate-700/60 mt-1"
                      >
                        <FiLogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-md shadow-emerald-600/20"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300"
            >
              {isDark ? <FiSun className="text-amber-400" /> : <FiMoon />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-200"
            >
              {isMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-6 space-y-3">
          <NavLink
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
          >
            Home
          </NavLink>
          <NavLink
            to="/courts"
            onClick={() => setIsMenuOpen(false)}
            className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
          >
            Browse Courts
          </NavLink>
          {isAuthenticated && (
            <NavLink
              to="/my-bookings"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-slate-700 dark:text-slate-200 font-medium"
            >
              My Bookings
            </NavLink>
          )}
          {isAuthenticated && user?.role === "admin" && (
            <NavLink
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block py-2 text-amber-600 dark:text-amber-400 font-medium"
            >
              Admin Panel
            </NavLink>
          )}

          {isAuthenticated ? (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Wallet Balance</span>
                <span className="font-bold text-emerald-600">${balance} USD</span>
              </div>
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-white bg-rose-600 rounded-xl font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col space-y-2">
              <Link
                to="/login"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-2.5 text-slate-700 dark:text-slate-200 font-semibold border border-slate-200 dark:border-slate-700 rounded-xl"
              >
                Log In
              </Link>
              <Link
                to="/register"
                onClick={() => setIsMenuOpen(false)}
                className="w-full text-center py-2.5 text-white bg-emerald-600 rounded-xl font-semibold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
