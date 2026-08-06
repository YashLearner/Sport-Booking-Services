import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { joinWaitlist } from "../controllers/waitlistController.js";

const router = express.Router();

router.post("/", authMiddleware, joinWaitlist);

export default router;