import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { joinWaitlist } from "../controller/waitlistController.js";

const router = express.Router();

router.post("/", authMiddleware, joinWaitlist);

export default router;