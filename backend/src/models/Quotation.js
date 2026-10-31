import mongoose from "mongoose";

const quotationItemSchema = new mongoose.Schema({
  productId: { type: String, default: "" },
  productName: { type: String, required: true },
  description: { type: String, default: "" },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  discountPercent: { type: Number, default: 0 },
  amount: { type: Number, required: true },
});

const quotationSchema = new mongoose.Schema(
  {
    quotationNumber: { type: String, required: true, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    customerName: { type: String, required: true },
    items: [quotationItemSchema],
    subtotal: { type: Number, required: true },
    discountTotal: { type: Number, default: 0 },
    taxTotal: { type: Number, default: 0 },
    finalTotal: { type: Number, required: true },
    paymentTerms: { type: String, default: "Net 15" },
    validityDate: { type: Date, required: true },
    template: { type: String, default: "Standard SaaS Agreement" },
    notes: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Draft", "Sent", "Confirmed", "Rejected", "Expired"],
      default: "Draft",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export const Quotation = mongoose.model("Quotation", quotationSchema);
