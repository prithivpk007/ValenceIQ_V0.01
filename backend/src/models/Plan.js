import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, default: "" },
    basePrice: { type: Number, required: true },
    billingInterval: {
      type: String,
      enum: ["Monthly", "Yearly", "One-Time"],
      default: "Monthly",
    },
    features: [{ type: String }],
    maxSeats: { type: Number, default: null }, // null = unlimited
    trialDays: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Plan = mongoose.model("Plan", planSchema);
