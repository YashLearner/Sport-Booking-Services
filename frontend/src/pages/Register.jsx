import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { registerUser } from "../features/auth/authSlice.js";
import { hasErrors, validateRegisterForm } from "../utils/validators.js";
import FormInput from "../components/FormInput.jsx";
import LoadingSpinner from "../components/common/LoadingSpinner.jsx";
import useAuth from "../hooks/useAuth.js";
import { FiUser, FiMail, FiLock, FiArrowRight, FiActivity } from "react-icons/fi";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRegisterForm(form);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      return;
    }

    try {
      await dispatch(
        registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password })
      ).unwrap();

      toast.success("Account created successfully! Please log in.");
      navigate("/login", { replace: true });
    } catch (message) {
      toast.error(message || "Registration failed");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border border-slate-100 dark:border-slate-700/60"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-500/20">
            <FiActivity className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
            Create an Account
          </h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Get started with a complimentary $100.00 wallet balance
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <FormInput
            label="Full Name"
            name="name"
            autoComplete="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            error={fieldErrors.name}
            disabled={isLoading}
            required
            icon={<FiUser className="text-slate-400" />}
          />

          <FormInput
            label="Email Address"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange}
            error={fieldErrors.email}
            disabled={isLoading}
            required
            icon={<FiMail className="text-slate-400" />}
          />

          <FormInput
            label="Password"
            name="password"
            type="password"
            autoComplete="new-password"
            placeholder="Minimum 6 characters"
            value={form.password}
            onChange={handleChange}
            error={fieldErrors.password}
            disabled={isLoading}
            required
            icon={<FiLock className="text-slate-400" />}
          />

          <FormInput
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            placeholder="Re-enter password"
            value={form.confirmPassword}
            onChange={handleChange}
            error={fieldErrors.confirmPassword}
            disabled={isLoading}
            required
            icon={<FiLock className="text-slate-400" />}
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 flex items-center justify-center space-x-2 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-semibold rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <span>Register Account</span>
                <FiArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/60 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
