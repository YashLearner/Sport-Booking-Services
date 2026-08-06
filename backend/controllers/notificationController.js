import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";

export const getMyNotifications = asyncHandler(async (req, res) => {

    const notifications = await Notification.find({
        user: req.user.id
    }).sort({
        createdAt: -1
    });

    res.status(200).json({
        success: true,
        notifications
    });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const notification = await Notification.findOneAndUpdate(
        {
            _id: id,
            user: req.user.id
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