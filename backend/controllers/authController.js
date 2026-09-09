import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Otp from "../models/Otp.js";
import CreditLedger from "../models/CreditLedger.js";
import { sendOtpEmail } from "../utils/sendEmail.js";

// Helper regex for strict email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Step 1: Send OTP to User Email
 */
export const sendOtp = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, password, confirmPassword) are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    if (!EMAIL_REGEX.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and Confirm Password do not match.",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long.",
      });
    }

    // Check if account already exists
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Check 30-second resend cooldown
    const existingOtp = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });
    if (existingOtp) {
      const timeElapsed = Date.now() - new Date(existingOtp.lastSentAt).getTime();
      const cooldownMs = 30 * 1000;
      if (timeElapsed < cooldownMs) {
        const remainingSec = Math.ceil((cooldownMs - timeElapsed) / 1000);
        return res.status(429).json({
          success: false,
          message: `Resend OTP available in ${remainingSec} seconds. Please wait before requesting another code.`,
        });
      }
    }

    // Generate 6-digit random numeric OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();

    // Hash OTP before storing in database
    const hashedOtp = await bcrypt.hash(rawOtp, 10);

    // Delete prior OTP records for this email
    await Otp.deleteMany({ email: normalizedEmail });

    // Save new OTP record (expires in 10 minutes)
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
    await Otp.create({
      email: normalizedEmail,
      otp: hashedOtp,
      expiresAt,
      lastSentAt: new Date(),
    });

    // Send OTP via Nodemailer
    await sendOtpEmail(normalizedEmail, rawOtp);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email address.",
    });
  } catch (error) {
    console.error("sendOtp Error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to process OTP request.",
    });
  }
};

/**
 * Step 2: Verify OTP and Create Account
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, otp } = req.body;

    if (!name || !email || !password || !otp) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and OTP code are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check duplicate account
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    // Fetch latest active OTP record
    const otpRecord = await Otp.findOne({ email: normalizedEmail }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "No OTP request found for this email. Please request a new OTP code.",
      });
    }

    if (new Date(otpRecord.expiresAt).getTime() < Date.now()) {
      await Otp.deleteMany({ email: normalizedEmail });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new code.",
      });
    }

    // Compare provided OTP with hashed OTP
    const isOtpValid = await bcrypt.compare(String(otp).trim(), otpRecord.otp);
    if (!isOtpValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP code. Please check your email and try again.",
      });
    }

    // Invalidate/delete OTP to prevent reuse
    await Otp.deleteMany({ email: normalizedEmail });

    // Hash user password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User with verified status and $100.00 initial wallet balance
    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      walletBalance: 100.0,
      isEmailVerified: true,
    });

    // Create Initial Balance Ledger record
    await CreditLedger.create({
      user: user._id,
      type: "INITIAL_BALANCE",
      amount: 100.0,
      balanceAfter: 100.0,
      description: "Initial Sign-Up Wallet Bonus",
    });

    res.status(201).json({
      success: true,
      message: "Registration successful! Account created.",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        walletBalance: user.walletBalance,
        credits: user.walletBalance,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    // Handle MongoDB duplicate key error gracefully
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Registration failed.",
    });
  }
};

/**
 * Login Controller
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    // Check user
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    // Ensure walletBalance exists on user document in MongoDB
    if (user.walletBalance === undefined || user.walletBalance === null) {
      user.walletBalance = 100.0;
      await user.save();
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        walletBalance: user.walletBalance,
        credits: user.walletBalance,
        isEmailVerified: user.isEmailVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};