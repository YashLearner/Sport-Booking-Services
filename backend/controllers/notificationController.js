import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

// Fetch notifications strictly belonging to the authenticated user
export const getMyNotifications = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    const notifications = await Notification.find({
        user: userId
    }).sort({
        createdAt: -1
    });

    res.status(200).json({
        success: true,
        notifications
    });
});

// Mark single notification as read (strictly owned by authenticated user)
export const markNotificationAsRead = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndUpdate(
        {
            _id: id,
            user: userId
        },
        {
            isRead: true
        },
        {
            new: true
        }
    );

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
        notification
    });
});

// Mark all notifications as read (strictly owned by authenticated user)
export const markAllNotificationsAsRead = asyncHandler(async (req, res) => {
    const userId = req.user.id;

    await Notification.updateMany(
        { user: userId, isRead: false },
        { isRead: true }
    );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read"
    });
});

// Delete single notification (strictly owned by authenticated user)
export const deleteNotification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;

    const notification = await Notification.findOneAndDelete({
        _id: id,
        user: userId
    });

    if (!notification) {
        return res.status(404).json({
            success: false,
            message: "Notification not found"
        });
    }

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully"
    });
});