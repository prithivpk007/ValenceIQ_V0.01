import mongoose from "mongoose";

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number, required: true },
});

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    subscriptionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscription",
      default: null,
    },
    items: [invoiceItemSchema],
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, default: 18 }, // 18% GST
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Draft", "Confirmed", "Partially Paid", "Paid", "Overdue", "Cancelled"],
      default: "Confirmed",
    },
    issueDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

export const Invoice = mongoose.model("Invoice", invoiceSchema);
