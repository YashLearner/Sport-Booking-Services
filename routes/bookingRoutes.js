import express from "express";

import {
  createBooking,
  getMyBookings,
  getAllBookings,
  cancelBooking,
  createRecurringBooking
} from "../controller/bookingController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";
import { authorizeRoles } from "../middleware/authorizeRoles.js";

const router = express.Router();

router.post("/", authMiddleware, createBooking);

router.get("/my", authMiddleware, getMyBookings);

router.get("/",authMiddleware,authorizeRoles("admin"),getAllBookings);

router.patch("/:id/cancel",authMiddleware,cancelBooking);

router.post("/recurring",authMiddleware,createRecurringBooking);

export default router;