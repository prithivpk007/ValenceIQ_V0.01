import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    paymentNumber: { type: String, required: true, unique: true },
    invoiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    amount: { type: Number, required: true },
    method: {
      type: String,
      enum: ["Corporate Card", "NEFT/RTGS", "UPI", "Net Banking", "Cheque"],
      required: true,
    },
    transactionReference: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Success", "Pending", "Failed"],
      default: "Success",
    },
    paymentDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Payment = mongoose.model("Payment", paymentSchema);
