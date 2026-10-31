import mongoose from "mongoose";

const productVariantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  priceAdjustment: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["Platform", "Workflow", "Intelligence", "Professional Services"],
      default: "Platform",
    },
    basePrice: { type: Number, required: true },
    costPrice: { type: Number, default: 0 },
    billingCycle: {
      type: String,
      enum: ["Monthly", "Yearly", "One-Time"],
      default: "Monthly",
    },
    variants: [productVariantSchema],
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Active", "Archived"],
      default: "Active",
    },
  },
  { timestamps: true }
);

export const Product = mongoose.model("Product", productSchema);
