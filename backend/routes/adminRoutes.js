import express from "express";

import { getAllBookings, getAllUsers, deleteUser, getAdminStats } from "../controllers/adminController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.get("/bookings", authMiddleware, authorizeRoles("admin"), getAllBookings);
router.get("/users", authMiddleware, authorizeRoles("admin"), getAllUsers);
router.delete("/users/:id", authMiddleware, authorizeRoles("admin"), deleteUser);
router.get("/stats", authMiddleware, authorizeRoles("admin"), getAdminStats);

export default router;
