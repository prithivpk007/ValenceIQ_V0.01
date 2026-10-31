import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["payment", "renewal", "alert", "info", "overdue", "quotation"],
      default: "info",
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // null = broadcast to all
    },
    relatedEntity: {
      type: { type: String, default: "" }, // e.g. "invoice", "subscription"
      id: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export const Notification = mongoose.model("Notification", notificationSchema);
