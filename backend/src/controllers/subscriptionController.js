import { Subscription } from "../models/Subscription.js";
import { Quotation } from "../models/Quotation.js";
import { generateSubscriptionNumber } from "../utils/generateNumber.js";

// GET /subscriptions
export const getAllSubscriptions = async (req, res, next) => {
  try {
    const { search, status, customerId, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (customerId) filter.customerId = customerId;
    if (search) {
      filter.$or = [
        { subscriptionNumber: { $regex: search, $options: "i" } },
        { planName: { $regex: search, $options: "i" } },
      ];
    }
    const subscriptions = await Subscription.find(filter)
      .populate("customerId", "companyName contactName email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Subscription.countDocuments(filter);
    res.json({ success: true, data: subscriptions, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /subscriptions/:id
export const getSubscriptionById = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id).populate("customerId", "companyName contactName email");
    if (!sub) return res.status(404).json({ success: false, message: "Subscription not found." });
    res.json({ success: true, data: sub });
  } catch (err) {
    next(err);
  }
};

// POST /subscriptions
export const createSubscription = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.subscriptionNumber) body.subscriptionNumber = generateSubscriptionNumber();
    const sub = await Subscription.create(body);
    res.status(201).json({ success: true, data: sub, message: "Subscription created successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /subscriptions/:id/status
export const updateSubscriptionStatus = async (req, res, next) => {
  try {
    const { status, reason } = req.body;
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Subscription not found." });

    if (sub.status === "Closed" && status !== "Closed") {
      return res.status(400).json({
        success: false,
        message: "A closed subscription cannot be re-opened. Please create a new subscription.",
      });
    }

    const prevStatus = sub.status;
    sub.status = status;
    sub.pauseHistory = sub.pauseHistory || [];
    if (prevStatus === "Active" && status === "Paused") {
      sub.pauseHistory.push({ pausedAt: new Date(), reason: reason || "" });
    } else if (prevStatus === "Paused" && status === "Active") {
      const last = sub.pauseHistory[sub.pauseHistory.length - 1];
      if (last && !last.resumedAt) last.resumedAt = new Date();
    }
    await sub.save();
    res.json({ success: true, data: sub, message: `Subscription is now ${status}` });
  } catch (err) {
    next(err);
  }
};

// POST /subscriptions/:id/renew
export const renewSubscription = async (req, res, next) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ success: false, message: "Subscription not found." });

    const current = new Date(sub.nextBillingDate);
    if (sub.interval === "Yearly") {
      current.setFullYear(current.getFullYear() + 1);
    } else if (sub.interval === "Weekly") {
      current.setDate(current.getDate() + 7);
    } else if (sub.interval === "Daily") {
      current.setDate(current.getDate() + 1);
    } else {
      current.setMonth(current.getMonth() + 1);
    }
    sub.nextBillingDate = current;
    sub.status = "Active";
    await sub.save();
    res.json({ success: true, data: sub, message: "Subscription successfully renewed" });
  } catch (err) {
    next(err);
  }
};

// POST /subscriptions/from-quotation
export const createFromQuotation = async (req, res, next) => {
  try {
    const { quotationId } = req.body;
    const quotation = await Quotation.findById(quotationId).populate("customerId");
    if (!quotation) return res.status(404).json({ success: false, message: "Quotation not found." });
    if (quotation.status !== "Confirmed")
      return res.status(400).json({ success: false, message: "Only confirmed quotations can be converted." });

    const nextBilling = new Date();
    nextBilling.setMonth(nextBilling.getMonth() + 1);

    const sub = await Subscription.create({
      subscriptionNumber: generateSubscriptionNumber(),
      customerId: quotation.customerId._id,
      planName: quotation.items[0]?.productName || "Custom Contract Package",
      recurringAmount: quotation.finalTotal,
      interval: "Monthly",
      startDate: new Date(),
      nextBillingDate: nextBilling,
      autoRenew: true,
      status: "Active",
    });

    res.status(201).json({ success: true, data: sub, message: "Quotation successfully converted to Active Subscription!" });
  } catch (err) {
    next(err);
  }
};
