import mongoose from "mongoose";

const creditLedgerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },

    type: {
      type: String,
      enum: ["Credit", "Debit", "Refund"],
      required: true,
    },

    amount: {
      type: Number,
      required: true,
    },

    balanceAfter: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("CreditLedger", creditLedgerSchema);