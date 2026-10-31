import { Invoice } from "../models/Invoice.js";
import { Subscription } from "../models/Subscription.js";
import { Customer } from "../models/Customer.js";
import { Payment } from "../models/Payment.js";

// GET /analytics/kpis
export const getDashboardKpis = async (req, res, next) => {
  try {
    const [
      totalCustomers,
      activeSubscriptions,
      totalRevenuePipeline,
      overdueInvoices,
      totalMRR,
    ] = await Promise.all([
      Customer.countDocuments({ status: "Active" }),
      Subscription.countDocuments({ status: "Active" }),
      Invoice.aggregate([
        { $match: { status: { $in: ["Confirmed", "Partially Paid"] } } },
        { $group: { _id: null, total: { $sum: "$balanceDue" } } },
      ]),
      Invoice.countDocuments({ status: "Overdue" }),
      Subscription.aggregate([
        { $match: { status: "Active", interval: "Monthly" } },
        { $group: { _id: null, total: { $sum: "$recurringAmount" } } },
      ]),
    ]);

    res.json({
      success: true,
      data: {
        totalCustomers,
        activeSubscriptions,
        outstandingBalance: totalRevenuePipeline[0]?.total || 0,
        overdueInvoices,
        monthlyRecurringRevenue: totalMRR[0]?.total || 0,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/mrr-trend
export const getMrrTrend = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const trend = await Payment.aggregate([
      { $match: { status: "Success", paymentDate: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$paymentDate" },
            month: { $month: "$paymentDate" },
          },
          revenue: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const data = trend.map((t) => ({
      month: months[t._id.month - 1],
      year: t._id.year,
      revenue: t.revenue,
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/revenue-by-plan
export const getRevenueByPlan = async (req, res, next) => {
  try {
    const data = await Subscription.aggregate([
      { $match: { status: "Active" } },
      {
        $group: {
          _id: "$planName",
          subscriptions: { $sum: 1 },
          totalRevenue: { $sum: "$recurringAmount" },
        },
      },
      { $sort: { totalRevenue: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/invoice-status
export const getInvoiceStatusDistribution = async (req, res, next) => {
  try {
    const data = await Invoice.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 }, total: { $sum: "$totalAmount" } } },
      { $sort: { count: -1 } },
    ]);
    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/subscription-growth
export const getSubscriptionGrowth = async (req, res, next) => {
  try {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const data = await Subscription.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          newSubscriptions: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};

// GET /analytics/invoice-aging
export const getInvoiceAging = async (req, res, next) => {
  try {
    const today = new Date();
    const invoices = await Invoice.find({ status: { $in: ["Overdue", "Confirmed", "Partially Paid"] } });

    const buckets = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };
    const amounts = { "0-30": 0, "31-60": 0, "61-90": 0, "90+": 0 };

    invoices.forEach((inv) => {
      const days = Math.floor((today - new Date(inv.dueDate)) / (1000 * 60 * 60 * 24));
      if (days <= 30) { buckets["0-30"]++; amounts["0-30"] += inv.balanceDue; }
      else if (days <= 60) { buckets["31-60"]++; amounts["31-60"] += inv.balanceDue; }
      else if (days <= 90) { buckets["61-90"]++; amounts["61-90"] += inv.balanceDue; }
      else { buckets["90+"]++; amounts["90+"] += inv.balanceDue; }
    });

    const data = Object.keys(buckets).map((range) => ({
      range,
      count: buckets[range],
      amount: amounts[range],
    }));

    res.json({ success: true, data });
  } catch (err) {
    next(err);
  }
};
