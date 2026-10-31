import { Payment } from "../models/Payment.js";
import { Invoice } from "../models/Invoice.js";
import { generatePaymentNumber } from "../utils/generateNumber.js";

// GET /payments
export const getAllPayments = async (req, res, next) => {
  try {
    const { search, method, status, customerId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (method && method !== "All") filter.method = method;
    if (status && status !== "All") filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (search) {
      filter.$or = [
        { paymentNumber: { $regex: search, $options: "i" } },
        { transactionReference: { $regex: search, $options: "i" } },
      ];
    }
    const payments = await Payment.find(filter)
      .populate("invoiceId", "invoiceNumber totalAmount")
      .populate("customerId", "companyName contactName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Payment.countDocuments(filter);
    res.json({ success: true, data: payments, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /payments/:id
export const getPaymentById = async (req, res, next) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate("invoiceId", "invoiceNumber totalAmount status")
      .populate("customerId", "companyName contactName email");
    if (!payment) return res.status(404).json({ success: false, message: "Payment record not found." });
    res.json({ success: true, data: payment });
  } catch (err) {
    next(err);
  }
};

// POST /payments
export const recordPayment = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.paymentNumber) body.paymentNumber = generatePaymentNumber();

    const payment = await Payment.create(body);

    // Auto-reconcile invoice if payment is successful
    if (payment.status === "Success" && payment.invoiceId) {
      try {
        const invoice = await Invoice.findById(payment.invoiceId);
        if (invoice) {
          const newPaid = Number(invoice.amountPaid) + Number(payment.amount);
          const newBalance = Math.max(0, Number(invoice.totalAmount) - newPaid);
          invoice.amountPaid = newPaid;
          invoice.balanceDue = newBalance;
          invoice.status = newBalance === 0 ? "Paid" : "Partially Paid";
          await invoice.save();
        }
      } catch (reconcileErr) {
        console.warn("[Payment] Could not auto-reconcile invoice:", reconcileErr.message);
      }
    }

    res.status(201).json({ success: true, data: payment, message: "Payment recorded and reconciled successfully" });
  } catch (err) {
    next(err);
  }
};
