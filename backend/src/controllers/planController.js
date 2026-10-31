import { Plan } from "../models/Plan.js";

// GET /plans
export const getAllPlans = async (req, res, next) => {
  try {
    const { search, billingInterval, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (billingInterval && billingInterval !== "All") filter.billingInterval = billingInterval;
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { code: { $regex: search, $options: "i" } },
      ];
    }
    const plans = await Plan.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Plan.countDocuments(filter);
    res.json({ success: true, data: plans, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /plans/:id
export const getPlanById = async (req, res, next) => {
  try {
    const plan = await Plan.findById(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found." });
    res.json({ success: true, data: plan });
  } catch (err) {
    next(err);
  }
};

// POST /plans
export const createPlan = async (req, res, next) => {
  try {
    const plan = await Plan.create({ ...req.body, code: req.body.code?.toUpperCase().trim() });
    res.status(201).json({ success: true, data: plan, message: "Subscription plan created successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /plans/:id
export const updatePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found." });
    res.json({ success: true, data: plan, message: "Plan updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE /plans/:id
export const deletePlan = async (req, res, next) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ success: false, message: "Plan not found." });
    res.json({ success: true, data: plan, message: "Plan deleted successfully" });
  } catch (err) {
    next(err);
  }
};
