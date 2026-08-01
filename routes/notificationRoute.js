import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { getMyNotifications, markNotificationAsRead } from "../controller/notificationController.js";

const router = express.Router();

router.get("/", authMiddleware, getMyNotifications);
router.patch("/:id/read", authMiddleware, markNotificationAsRead);
export default router;