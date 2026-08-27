import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { logout } from "../features/auth/authSlice.js";
import useAuth from "../hooks/useAuth.js";

const linkClass = ({ isActive }) =>
  `block rounded-md px-3 py-2 text-sm font-medium ${
    isActive
      ? "bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-400"
      : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
  }`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out");
    setMobileOpen(false);
    navigate("/login");
  };

  const guestLinks = (
    <>
      <NavLink to="/" className={linkClass} onClick={() => setMobileOpen(false)}>
        Home
      </NavLink>
      <NavLink to="/login" className={linkClass} onClick={() => setMobileOpen(false)}>
        Login
      </NavLink>
      <NavLink to="/register" className={linkClass} onClick={() => setMobileOpen(false)}>
        Register
      </NavLink>
    </>
  );

  const userLinks = (
    <>
      <NavLink to="/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
        Dashboard
      </NavLink>
      <NavLink to="/profile" className={linkClass} onClick={() => setMobileOpen(false)}>
        Profile
      </NavLink>
      <NavLink to="/bookings" className={linkClass} onClick={() => setMobileOpen(false)}>
        My Bookings
      </NavLink>
    </>
  );

  const adminLinks = (
    <>
      <NavLink to="/admin/dashboard" className={linkClass} onClick={() => setMobileOpen(false)}>
        Admin Dashboard
      </NavLink>
      <NavLink to="/admin/courts" className={linkClass} onClick={() => setMobileOpen(false)}>
        Manage Courts
      </NavLink>
      <NavLink to="/admin/users" className={linkClass} onClick={() => setMobileOpen(false)}>
        Manage Users
      </NavLink>
    </>
  );

  return (
    <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-lg font-semibold text-brand-600">
          Sports Court Booking
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {!isAuthenticated && guestLinks}
          {isAuthenticated && !isAdmin && userLinks}
          {isAuthenticated && isAdmin && adminLinks}

          {isAuthenticated && (
            <>
              <span className="ml-2 mr-1 text-sm text-gray-500 dark:text-gray-400">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="rounded-md bg-gray-100 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800 md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="space-y-1 border-t border-gray-200 px-4 py-3 dark:border-gray-800 md:hidden">
          {!isAuthenticated && guestLinks}
          {isAuthenticated && !isAdmin && userLinks}
          {isAuthenticated && isAdmin && adminLinks}

          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="mt-2 w-full rounded-md bg-gray-100 px-3 py-2 text-left text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Logout
            </button>
          )}
        </div>
      )}
    </header>
  );
}
