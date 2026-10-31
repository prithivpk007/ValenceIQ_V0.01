import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["Percentage", "Fixed"],
      required: true,
    },
    value: { type: Number, required: true },
    maxUsage: { type: Number, default: null }, // null = unlimited
    usageCount: { type: Number, default: 0 },
    validFrom: { type: Date, default: Date.now },
    validUntil: { type: Date, default: null },
    applicablePlans: [{ type: String }], // plan names/codes it applies to
    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Discount = mongoose.model("Discount", discountSchema);
