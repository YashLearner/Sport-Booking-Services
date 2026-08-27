import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import courtRoutes from "./routes/courtRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import waitlistRoute from "./routes/waitlistRoutes.js";
import notificationRoute from "./routes/notificationRoute.js";
import adminRoutes from "./routes/adminRoutes.js";
import User from "./models/User.js";
import errorMiddleware from "./middleware/errorMiddleware.js";
import { startBookingCompletionCron } from "./cron/bookingCompletionCron.js";

dotenv.config();

connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Auth Routes
app.use("/api/auth", authRoutes);

// Court Routes
app.use("/api/courts", courtRoutes);

// Booking Route
app.use("/api/bookings", bookingRoutes);

// Admin Routes
app.use("/api/admin", adminRoutes);

// WaitList Route
app.use("/api/waitlist", waitlistRoute);

// Notification Route
app.use("/api/notification", notificationRoute);

// Profile Route - Fetch fresh User document from MongoDB
app.get("/api/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Auto-initialize walletBalance if missing on legacy user document
    if (user.walletBalance === undefined || user.walletBalance === null) {
      user.walletBalance = 100.0;
      await user.save();
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sports Booking API Running 🚀",
  });
});

// Error Middleware
app.use(errorMiddleware);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
  // Start background auto-completion cron
  startBookingCompletionCron();
});