import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    court: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Court",
      required: true,
    },

    bookingDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    endTime: {
      type: String,
      required: true,
    },

    duration: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    bookingType: {
      type: String,
      enum: ["Normal", "Recurring"],
      default: "Normal",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Refunded"],
      default: "Paid",
    },

    status: {
      type: String,
      enum: ["Booked", "Cancelled", "Completed"],
      default: "Booked",
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;