import React, { useState } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { deleteCourtRequest } from "../../api/adminApi";
import { fetchCourts } from "../../features/courts/courtSlice";
import LoadingSpinner from "../common/LoadingSpinner";
import { FiTrash2, FiAlertTriangle, FiX } from "react-icons/fi";

export default function DeleteCourtModal({ court, isOpen, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !court) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteCourtRequest(court._id);
      toast.success(`Court "${court.name}" deleted successfully!`);
      dispatch(fetchCourts());
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete court");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-sm w-full border border-slate-100 dark:border-slate-700/60 shadow-2xl space-y-4">
        <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto">
          <FiAlertTriangle className="w-6 h-6" />
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Delete Court Arena?
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Are you sure you want to delete <strong>{court.name}</strong>? This action cannot be undone.
          </p>
        </div>

        <div className="flex space-x-3 pt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md shadow-rose-600/20 flex items-center justify-center space-x-1"
          >
            {loading ? (
              <LoadingSpinner size="sm" text="" />
            ) : (
              <>
                <FiTrash2 className="w-4 h-4" />
                <span>Delete Court</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
