import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    subscriptionNumber: { type: String, required: true, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    planName: { type: String, required: true },
    interval: {
      type: String,
      enum: ["Daily", "Weekly", "Monthly", "Yearly"],
      default: "Monthly",
    },
    recurringAmount: { type: Number, required: true },
    seats: { type: Number, default: 1 },
    status: {
      type: String,
      enum: ["Active", "Paused", "Past_Due", "Closed", "Pending"],
      default: "Active",
    },
    startDate: { type: Date, default: Date.now },
    nextBillingDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    pauseHistory: [
      {
        pausedAt: Date,
        resumedAt: Date,
        reason: String,
      },
    ],
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
