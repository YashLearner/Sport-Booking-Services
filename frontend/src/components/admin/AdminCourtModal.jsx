import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { createCourtRequest, updateCourtRequest } from "../../api/adminApi";
import { fetchCourts } from "../../features/courts/courtSlice";
import LoadingSpinner from "../common/LoadingSpinner";
import { FiX, FiCheckCircle, FiEdit, FiPlusCircle } from "react-icons/fi";

export default function AdminCourtModal({ court, isOpen, onClose }) {
  const dispatch = useDispatch();
  const isEditing = Boolean(court?._id);

  const [form, setForm] = useState({
    name: "",
    location: "",
    pricePerHour: 50,
    capacity: 4,
    isAvailable: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (court) {
      setForm({
        name: court.name || "",
        location: court.location || "",
        pricePerHour: court.pricePerHour || 50,
        capacity: court.capacity || 4,
        isAvailable: court.isAvailable ?? true,
      });
    } else {
      setForm({
        name: "",
        location: "",
        pricePerHour: 50,
        capacity: 4,
        isAvailable: true,
      });
    }
  }, [court, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); 

    try {
      if (isEditing) {
        await updateCourtRequest(court._id, form);
        toast.success("Court updated successfully!");
      } else {
        await createCourtRequest(form);
        toast.success("New Court created successfully!");
      }
      dispatch(fetchCourts());
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full border border-slate-100 dark:border-slate-700/60 shadow-2xl space-y-6">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700/60 pb-4">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-xl">
              {isEditing ? <FiEdit className="w-5 h-5" /> : <FiPlusCircle className="w-5 h-5" />}
            </div>
            <h3 className="font-bold text-lg text-slate-900 dark:text-white">
              {isEditing ? "Edit Court Details" : "Create New Court"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Court Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Badminton Court 1"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
              Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Arena Complex, Sector 4"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Price / Hour ($)
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.pricePerHour}
                onChange={(e) => setForm({ ...form, pricePerHour: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                Capacity (Players)
              </label>
              <input
                type="number"
                required
                min="1"
                value={form.capacity}
                onChange={(e) => setForm({ ...form, capacity: Number(e.target.value) })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/60 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <input
              type="checkbox"
              id="isAvailable"
              checked={form.isAvailable}
              onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
            />
            <label htmlFor="isAvailable" className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Court is Available for Booking
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-3 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold rounded-2xl shadow-lg shadow-emerald-600/20 transition-all text-sm flex items-center justify-center space-x-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <FiCheckCircle className="w-5 h-5" />
                <span>{isEditing ? "Save Changes" : "Create Court"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
