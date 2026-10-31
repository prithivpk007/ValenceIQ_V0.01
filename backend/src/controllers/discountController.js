import { Discount } from "../models/Discount.js";

// GET /discounts
export const getAllDiscounts = async (req, res, next) => {
  try {
    const { search, type, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (type && type !== "All") filter.type = type;
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { code: { $regex: search, $options: "i" } },
        { name: { $regex: search, $options: "i" } },
      ];
    }
    const discounts = await Discount.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Discount.countDocuments(filter);
    res.json({ success: true, data: discounts, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// POST /discounts
export const createDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.create({ ...req.body, code: req.body.code?.toUpperCase().trim() });
    res.status(201).json({ success: true, data: discount, message: "Discount rule created successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /discounts/:id
export const updateDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!discount) return res.status(404).json({ success: false, message: "Discount rule not found." });
    res.json({ success: true, data: discount, message: "Discount updated successfully" });
  } catch (err) {
    next(err);
  }
};

// PATCH /discounts/:id/toggle
export const toggleDiscountStatus = async (req, res, next) => {
  try {
    const discount = await Discount.findById(req.params.id);
    if (!discount) return res.status(404).json({ success: false, message: "Discount rule not found." });
    discount.status = discount.status === "Active" ? "Inactive" : "Active";
    await discount.save();
    res.json({ success: true, data: discount, message: `Discount ${discount.code} marked as ${discount.status}` });
  } catch (err) {
    next(err);
  }
};

// DELETE /discounts/:id
export const deleteDiscount = async (req, res, next) => {
  try {
    const discount = await Discount.findByIdAndDelete(req.params.id);
    if (!discount) return res.status(404).json({ success: false, message: "Discount not found." });
    res.json({ success: true, data: discount, message: "Discount deleted successfully" });
  } catch (err) {
    next(err);
  }
};
