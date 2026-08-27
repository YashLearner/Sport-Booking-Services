import express from "express";

import { authMiddleware } from "../middleware/authMiddleware.js";

import { joinWaitlist,getMyWaitingList } from "../controllers/waitlistController.js";

const router = express.Router();

router.post("/", authMiddleware, joinWaitlist);

router.get("/my",authMiddleware, getMyWaitingList);

export default router;