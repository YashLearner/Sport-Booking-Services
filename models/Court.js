import mongoose from "mongoose";

const courtSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
      trim: true,
    },

    pricePerHour: {
      type: Number,
      required: true,
    },

    capacity: {
      type: Number,
      default: 4,
    },

    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Court = mongoose.model("Court", courtSchema);

export default Court;