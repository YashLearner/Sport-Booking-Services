import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  selectNotifications,
  selectUnreadCount,
} from "../../features/notifications/notificationSlice";
import { FiBell, FiCheck, FiCheckCircle, FiTrash2, FiCheckSquare } from "react-icons/fi";

export default function NotificationDrawer() {
  const dispatch = useDispatch();
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchMyNotifications());
  }, [dispatch]);

  const handleMarkRead = (id) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (id) => {
    dispatch(deleteNotification(id));
  };

  return (
    <div className="relative">
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="View Notifications"
        className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors relative"
      >
        <FiBell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-extrabold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          onMouseLeave={() => setIsOpen(false)}
          className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-3xl shadow-2xl py-3 border border-slate-100 dark:border-slate-700/60 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
        >
          <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-sm text-slate-900 dark:text-white">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 text-[10px] font-extrabold rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center space-x-1"
                >
                  <FiCheckSquare className="w-3.5 h-3.5" />
                  <span>Mark All Read</span>
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Close
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/60">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item._id}
                  className={`p-3.5 flex items-start justify-between space-x-3 transition-colors ${
                    !item.isRead
                      ? "bg-emerald-50/50 dark:bg-emerald-950/20"
                      : "hover:bg-slate-50 dark:hover:bg-slate-700/30"
                  }`}
                >
                  <div className="flex items-start space-x-2.5 flex-1">
                    <div className="p-1.5 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-xl mt-0.5">
                      <FiCheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {item.title || "Notification"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-snug mt-0.5">
                        {item.message}
                      </p>
                      <span className="text-[10px] text-slate-400 mt-1 block">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1">
                    {!item.isRead && (
                      <button
                        onClick={() => handleMarkRead(item._id)}
                        title="Mark as read"
                        className="text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 p-1"
                      >
                        <FiCheck className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item._id)}
                      title="Delete notification"
                      className="text-slate-400 hover:text-rose-500 p-1"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
