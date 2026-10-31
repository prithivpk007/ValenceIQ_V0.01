import { Invoice } from "../models/Invoice.js";
import { Payment } from "../models/Payment.js";
import { generateInvoiceNumber } from "../utils/generateNumber.js";

// GET /invoices
export const getAllInvoices = async (req, res, next) => {
  try {
    const { search, status, customerId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (search) {
      filter.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
      ];
    }
    const invoices = await Invoice.find(filter)
      .populate("customerId", "companyName contactName email")
      .populate("subscriptionId", "subscriptionNumber planName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Invoice.countDocuments(filter);
    res.json({ success: true, data: invoices, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /invoices/:id
export const getInvoiceById = async (req, res, next) => {
  try {
    const invoice = await Invoice.findById(req.params.id)
      .populate("customerId", "companyName contactName email billingAddress gstin")
      .populate("subscriptionId", "subscriptionNumber planName");
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found." });
    res.json({ success: true, data: invoice });
  } catch (err) {
    next(err);
  }
};

// POST /invoices
export const createInvoice = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.invoiceNumber) body.invoiceNumber = generateInvoiceNumber();

    const subtotal = Number(body.subtotal || 0);
    const taxRate = Number(body.taxRate || 18);
    const taxAmount = (subtotal * taxRate) / 100;
    const totalAmount = subtotal + taxAmount;

    body.subtotal = subtotal;
    body.taxAmount = taxAmount;
    body.totalAmount = totalAmount;
    body.balanceDue = totalAmount - Number(body.amountPaid || 0);

    if (!body.dueDate) {
      const due = new Date();
      due.setDate(due.getDate() + 15);
      body.dueDate = due;
    }

    const invoice = await Invoice.create(body);
    res.status(201).json({ success: true, data: invoice, message: "Invoice generated successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /invoices/:id/status
export const updateInvoiceStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found." });
    res.json({ success: true, data: invoice, message: `Invoice marked as ${status}` });
  } catch (err) {
    next(err);
  }
};

// POST /invoices/:id/payment
export const applyPaymentToInvoice = async (req, res, next) => {
  try {
    const { amount } = req.body;
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ success: false, message: "Invoice not found." });

    const newPaid = Number(invoice.amountPaid) + Number(amount);
    const newBalance = Math.max(0, Number(invoice.totalAmount) - newPaid);

    invoice.amountPaid = newPaid;
    invoice.balanceDue = newBalance;
    invoice.status = newBalance === 0 ? "Paid" : "Partially Paid";
    await invoice.save();

    res.json({ success: true, data: invoice, message: `Payment of ₹${amount} applied to ${invoice.invoiceNumber}` });
  } catch (err) {
    next(err);
  }
};
