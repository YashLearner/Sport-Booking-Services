import React, { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loadProfile } from "../features/auth/authSlice";

// Layouts
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";
import PublicOnlyRoute from "./PublicOnlyRoute";
import LoadingSpinner from "../components/common/LoadingSpinner";

// Lazy Loaded Pages for Code Splitting & Performance Optimization
const Home = lazy(() => import("../pages/Home"));
const CourtsPage = lazy(() => import("../pages/CourtsPage"));
const CourtDetailsPage = lazy(() => import("../pages/CourtDetailsPage"));
const MyBookingsPage = lazy(() => import("../pages/MyBookingsPage"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Profile = lazy(() => import("../pages/Profile"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Admin Pages
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminCourts = lazy(() => import("../pages/admin/AdminCourts"));
const AdminBookings = lazy(() => import("../pages/admin/AdminBookings"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));

const AppRoutes = () => {
  const dispatch = useDispatch();

  // Load profile on app mount if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(loadProfile());
    }
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
          <LoadingSpinner size="lg" text="Loading CourtHub Arena..." />
        </div>
      }
    >
      <Routes>
        {/* Public & User Routes within Main Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/courts" element={<CourtsPage />} />
          <Route path="/courts/:id" element={<CourtDetailsPage />} />

          {/* Public Only Routes */}
          <Route
            path="/login"
            element={
              <PublicOnlyRoute>
                <Login />
              </PublicOnlyRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicOnlyRoute>
                <Register />
              </PublicOnlyRoute>
            }
          />

          {/* Protected User Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Admin Panel Routes */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="courts" element={<AdminCourts />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="users" element={<AdminUsers />} />
        </Route>

        {/* 404 Catch All */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
