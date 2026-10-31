import { Quotation } from "../models/Quotation.js";
import { generateQuotationNumber } from "../utils/generateNumber.js";

// GET /quotations
export const getAllQuotations = async (req, res, next) => {
  try {
    const { search, status, customerId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (search) {
      filter.$or = [
        { quotationNumber: { $regex: search, $options: "i" } },
        { customerName: { $regex: search, $options: "i" } },
      ];
    }
    const quotations = await Quotation.find(filter)
      .populate("customerId", "companyName contactName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Quotation.countDocuments(filter);
    res.json({ success: true, data: quotations, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /quotations/:id
export const getQuotationById = async (req, res, next) => {
  try {
    const quotation = await Quotation.findById(req.params.id).populate("customerId");
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found." });
    res.json({ success: true, data: quotation });
  } catch (err) {
    next(err);
  }
};

// POST /quotations
export const createQuotation = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.quotationNumber) body.quotationNumber = generateQuotationNumber();

    // Compute totals from items
    const items = body.items || [];
    const subtotal = items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
    const discountTotal = items.reduce(
      (acc, item) => acc + item.quantity * item.unitPrice * ((item.discountPercent || 0) / 100),
      0
    );
    const taxTotal = (subtotal - discountTotal) * 0.18;
    const finalTotal = subtotal - discountTotal + taxTotal;

    body.subtotal = subtotal;
    body.discountTotal = discountTotal;
    body.taxTotal = taxTotal;
    body.finalTotal = finalTotal;

    // Set amounts on each item
    body.items = items.map((item) => ({
      ...item,
      amount: item.quantity * item.unitPrice * (1 - (item.discountPercent || 0) / 100),
    }));

    const quotation = await Quotation.create(body);
    res.status(201).json({ success: true, data: quotation, message: "Quotation created successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /quotations/:id
export const updateQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found." });
    res.json({ success: true, data: quotation, message: "Quotation updated successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /quotations/:id/status
export const updateQuotationStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const quotation = await Quotation.findById(req.params.id);
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found." });

    if (status === "Confirmed" && new Date(quotation.validityDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Cannot confirm an expired quotation. Please extend validity date or re-issue pricing.",
      });
    }

    quotation.status = status;
    await quotation.save();
    res.json({ success: true, data: quotation, message: `Quotation status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};

// DELETE /quotations/:id
export const deleteQuotation = async (req, res, next) => {
  try {
    const quotation = await Quotation.findByIdAndDelete(req.params.id);
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found." });
    res.json({ success: true, data: quotation, message: "Quotation deleted successfully" });
  } catch (err) {
    next(err);
  }
};
