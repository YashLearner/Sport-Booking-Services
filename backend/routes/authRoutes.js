import express from "express";
import { register, login, sendOtp } from "../controllers/authController.js";
import { authRateLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

router.post("/send-otp", authRateLimiter, sendOtp);
router.post("/register", authRateLimiter, register);
router.post("/login", authRateLimiter, login);

export default router;