import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import connectDB from "./config/db.js";
import { authMiddleware } from "./middleware/authMiddleware.js";
import courtRoutes from "./routes/courtRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import waitlistRoute from "./routes/waitlistRoutes.js"

import errorMiddleware from "./middleware/errorMiddleware.js";


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


app.use("/api/waitlist", waitlistRoute);


// error Middleware
app.use(errorMiddleware);


// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Sports Booking API Running 🚀",
  });
});

app.get("/api/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on Port ${PORT}`);
});