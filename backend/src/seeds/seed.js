/**
 * ValenceIQ Database Seeder
 * Seeds demo data: admin user, customers, plans, products,
 * subscriptions, invoices, payments, quotations, discounts, notifications.
 *
 * Usage: node src/seeds/seed.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: resolve(__dirname, "../../.env") });

import { User } from "../models/User.js";
import { Customer } from "../models/Customer.js";
import { Plan } from "../models/Plan.js";
import { Product } from "../models/Product.js";
import { Subscription } from "../models/Subscription.js";
import { Invoice } from "../models/Invoice.js";
import { Payment } from "../models/Payment.js";
import { Quotation } from "../models/Quotation.js";
import { Discount } from "../models/Discount.js";
import { Notification } from "../models/Notification.js";
import { Settings } from "../models/Settings.js";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/valenceiq";

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log("[Seeder] Connected to MongoDB:", MONGO_URI);

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Customer.deleteMany({}), Plan.deleteMany({}),
    Product.deleteMany({}), Subscription.deleteMany({}), Invoice.deleteMany({}),
    Payment.deleteMany({}), Quotation.deleteMany({}), Discount.deleteMany({}),
    Notification.deleteMany({}), Settings.deleteMany({}),
  ]);
  console.log("[Seeder] Cleared existing collections.");

  // 1. Users
  const adminUser = await User.create({
    name: "Vikram Aditya",
    email: "admin@brightloop.io",
    password: "admin123",
    role: "admin",
    isActive: true,
  });
  const staffUser = await User.create({
    name: "Priya Sharma",
    email: "priya@brightloop.io",
    password: "staff123",
    role: "staff",
    isActive: true,
  });
  console.log("[Seeder] Users created");

  // 2. Customers
  const customers = await Customer.insertMany([
    {
      companyName: "NovaTech Systems Pvt. Ltd.",
      contactName: "Rajesh Nair",
      email: "rajesh@novatech.in",
      phone: "+91 98765 43210",
      gstin: "29AABCN1234F1Z5",
      billingAddress: { street: "12, Koramangala 4th Block", city: "Bengaluru", state: "Karnataka", pincode: "560034", country: "India" },
      assignedStaffId: staffUser._id,
      status: "Active",
    },
    {
      companyName: "SkyBridge Logistics",
      contactName: "Anjali Verma",
      email: "anjali@skybridge.co.in",
      phone: "+91 90001 11222",
      gstin: "27AADBS5678G1Z3",
      billingAddress: { street: "301, BKC Complex", city: "Mumbai", state: "Maharashtra", pincode: "400051", country: "India" },
      assignedStaffId: adminUser._id,
      status: "Active",
    },
    {
      companyName: "Zenith Pharma Ltd.",
      contactName: "Suresh Kumar",
      email: "suresh@zenithpharma.com",
      phone: "+91 97777 88888",
      gstin: "36AAACZ4321H1Z8",
      billingAddress: { street: "45, Madhapur IT Park", city: "Hyderabad", state: "Telangana", pincode: "500081", country: "India" },
      assignedStaffId: staffUser._id,
      status: "Active",
    },
    {
      companyName: "Pinnacle Capital Advisors",
      contactName: "Meera Iyer",
      email: "meera@pinnaclecap.in",
      phone: "+91 88000 22222",
      gstin: "33AAABP9999K1Z2",
      billingAddress: { street: "8, Anna Salai", city: "Chennai", state: "Tamil Nadu", pincode: "600002", country: "India" },
      assignedStaffId: adminUser._id,
      status: "Lead",
    },
  ]);
  console.log("[Seeder] Customers created:", customers.length);

  // 3. Plans
  const plans = await Plan.insertMany([
    {
      name: "Starter",
      code: "STARTER",
      description: "For small teams getting started with subscription management.",
      basePrice: 4999,
      billingInterval: "Monthly",
      features: ["Up to 5 customers", "Basic invoicing", "Email support"],
      maxSeats: 5,
      status: "Active",
    },
    {
      name: "Professional",
      code: "PROFESSIONAL",
      description: "For growing businesses with advanced billing needs.",
      basePrice: 12999,
      billingInterval: "Monthly",
      features: ["Unlimited customers", "Advanced analytics", "Priority support", "Quotation management"],
      maxSeats: 25,
      status: "Active",
    },
    {
      name: "Enterprise",
      code: "ENTERPRISE",
      description: "Full-featured enterprise subscription lifecycle management.",
      basePrice: 29999,
      billingInterval: "Monthly",
      features: ["Unlimited everything", "AI analytics copilot", "Dedicated CSM", "Custom integrations", "SLA guarantee"],
      maxSeats: null,
      status: "Active",
    },
    {
      name: "Enterprise Annual",
      code: "ENTERPRISE-ANNUAL",
      description: "Enterprise plan billed annually — save 20%.",
      basePrice: 287990,
      billingInterval: "Yearly",
      features: ["All Enterprise features", "20% annual savings", "White-label invoicing"],
      maxSeats: null,
      status: "Active",
    },
  ]);
  console.log("[Seeder] Plans created:", plans.length);

  // 4. Products
  const products = await Product.insertMany([
    {
      name: "BrightLoop Platform Core",
      sku: "BL-PLATFORM-001",
      category: "Platform",
      basePrice: 14999,
      costPrice: 3000,
      billingCycle: "Monthly",
      description: "Core subscription management platform access.",
      status: "Active",
    },
    {
      name: "Workflow Automation Suite",
      sku: "BL-WORKFLOW-001",
      category: "Workflow",
      basePrice: 8999,
      costPrice: 1500,
      billingCycle: "Monthly",
      description: "Advanced workflow automation and approval engine.",
      status: "Active",
    },
    {
      name: "AI Intelligence Module",
      sku: "BL-AI-001",
      category: "Intelligence",
      basePrice: 9999,
      costPrice: 2500,
      billingCycle: "Monthly",
      description: "AI-powered analytics and natural language insights.",
      status: "Active",
    },
    {
      name: "Onboarding & Migration",
      sku: "BL-SERVICE-001",
      category: "Professional Services",
      basePrice: 49999,
      costPrice: 20000,
      billingCycle: "One-Time",
      description: "Dedicated onboarding and data migration service.",
      status: "Active",
    },
  ]);
  console.log("[Seeder] Products created:", products.length);

  // 5. Subscriptions
  const nextMonth = new Date();
  nextMonth.setMonth(nextMonth.getMonth() + 1);

  const subscriptions = await Subscription.insertMany([
    {
      subscriptionNumber: "SUB-BL-2025-1001",
      customerId: customers[0]._id,
      planName: "Enterprise",
      interval: "Monthly",
      recurringAmount: 29999,
      seats: 20,
      status: "Active",
      startDate: new Date("2025-01-01"),
      nextBillingDate: nextMonth,
      autoRenew: true,
    },
    {
      subscriptionNumber: "SUB-BL-2025-1002",
      customerId: customers[1]._id,
      planName: "Professional",
      interval: "Monthly",
      recurringAmount: 12999,
      seats: 10,
      status: "Active",
      startDate: new Date("2025-03-01"),
      nextBillingDate: nextMonth,
      autoRenew: true,
    },
    {
      subscriptionNumber: "SUB-BL-2025-1003",
      customerId: customers[2]._id,
      planName: "Enterprise Annual",
      interval: "Yearly",
      recurringAmount: 287990,
      seats: 50,
      status: "Active",
      startDate: new Date("2025-04-01"),
      nextBillingDate: new Date("2026-04-01"),
      autoRenew: true,
    },
    {
      subscriptionNumber: "SUB-BL-2025-1004",
      customerId: customers[0]._id,
      planName: "Professional",
      interval: "Monthly",
      recurringAmount: 12999,
      seats: 5,
      status: "Paused",
      startDate: new Date("2024-10-01"),
      nextBillingDate: nextMonth,
      autoRenew: false,
    },
  ]);
  console.log("[Seeder] Subscriptions created:", subscriptions.length);

  // 6. Invoices
  const pastDue = new Date();
  pastDue.setDate(pastDue.getDate() - 45);
  const futureDue = new Date();
  futureDue.setDate(futureDue.getDate() + 10);

  const invoices = await Invoice.insertMany([
    {
      invoiceNumber: "INV-2025-10001",
      customerId: customers[0]._id,
      subscriptionId: subscriptions[0]._id,
      items: [{ description: "Enterprise Plan — November 2025", quantity: 1, unitPrice: 29999, amount: 29999 }],
      subtotal: 29999,
      taxRate: 18,
      taxAmount: 5399.82,
      totalAmount: 35398.82,
      amountPaid: 35398.82,
      balanceDue: 0,
      status: "Paid",
      issueDate: new Date("2025-11-01"),
      dueDate: new Date("2025-11-15"),
    },
    {
      invoiceNumber: "INV-2025-10002",
      customerId: customers[1]._id,
      subscriptionId: subscriptions[1]._id,
      items: [{ description: "Professional Plan — November 2025", quantity: 1, unitPrice: 12999, amount: 12999 }],
      subtotal: 12999,
      taxRate: 18,
      taxAmount: 2339.82,
      totalAmount: 15338.82,
      amountPaid: 0,
      balanceDue: 15338.82,
      status: "Confirmed",
      issueDate: new Date("2025-11-01"),
      dueDate: futureDue,
    },
    {
      invoiceNumber: "INV-2025-10003",
      customerId: customers[2]._id,
      subscriptionId: subscriptions[2]._id,
      items: [{ description: "Enterprise Annual Plan — 2025-2026", quantity: 1, unitPrice: 287990, amount: 287990 }],
      subtotal: 287990,
      taxRate: 18,
      taxAmount: 51838.2,
      totalAmount: 339828.2,
      amountPaid: 170000,
      balanceDue: 169828.2,
      status: "Partially Paid",
      issueDate: new Date("2025-04-01"),
      dueDate: pastDue,
    },
    {
      invoiceNumber: "INV-2025-10004",
      customerId: customers[0]._id,
      subscriptionId: null,
      items: [{ description: "Onboarding & Migration Service", quantity: 1, unitPrice: 49999, amount: 49999 }],
      subtotal: 49999,
      taxRate: 18,
      taxAmount: 8999.82,
      totalAmount: 58998.82,
      amountPaid: 0,
      balanceDue: 58998.82,
      status: "Overdue",
      issueDate: new Date("2025-09-01"),
      dueDate: pastDue,
    },
  ]);
  console.log("[Seeder] Invoices created:", invoices.length);

  // 7. Payments
  await Payment.insertMany([
    {
      paymentNumber: "PAY-2025-10001",
      invoiceId: invoices[0]._id,
      customerId: customers[0]._id,
      amount: 35398.82,
      method: "NEFT/RTGS",
      transactionReference: "TXN-HDFC-092311",
      status: "Success",
      paymentDate: new Date("2025-11-12"),
    },
    {
      paymentNumber: "PAY-2025-10002",
      invoiceId: invoices[2]._id,
      customerId: customers[2]._id,
      amount: 170000,
      method: "Corporate Card",
      transactionReference: "CCPAY-2025-0417",
      status: "Success",
      paymentDate: new Date("2025-04-15"),
    },
  ]);
  console.log("[Seeder] Payments created");

  // 8. Discounts
  await Discount.insertMany([
    {
      code: "ENTERPRISE20",
      name: "Enterprise Annual Discount",
      type: "Percentage",
      value: 20,
      maxUsage: 50,
      usageCount: 3,
      validFrom: new Date("2025-01-01"),
      validUntil: new Date("2025-12-31"),
      applicablePlans: ["Enterprise", "Enterprise Annual"],
      status: "Active",
    },
    {
      code: "NEWCLIENT5000",
      name: "New Client Flat Discount",
      type: "Fixed",
      value: 5000,
      maxUsage: 20,
      usageCount: 7,
      validFrom: new Date("2025-06-01"),
      validUntil: new Date("2025-11-30"),
      applicablePlans: [],
      status: "Active",
    },
    {
      code: "Q3PROMOTION",
      name: "Q3 2025 Promotion",
      type: "Percentage",
      value: 10,
      maxUsage: 100,
      usageCount: 43,
      status: "Inactive",
    },
  ]);
  console.log("[Seeder] Discounts created");

  // 9. Quotations
  const validityDate = new Date();
  validityDate.setDate(validityDate.getDate() + 30);

  await Quotation.insertMany([
    {
      quotationNumber: "QUO-2025-20001",
      customerId: customers[3]._id,
      customerName: "Pinnacle Capital Advisors",
      items: [
        { productName: "BrightLoop Platform Core", quantity: 1, unitPrice: 14999, discountPercent: 10, amount: 13499.1 },
        { productName: "AI Intelligence Module", quantity: 1, unitPrice: 9999, discountPercent: 0, amount: 9999 },
      ],
      subtotal: 24998,
      discountTotal: 1499.9,
      taxTotal: 4229.65,
      finalTotal: 27727.75,
      paymentTerms: "Net 30",
      validityDate,
      template: "Enterprise SaaS Agreement",
      status: "Sent",
      createdBy: adminUser._id,
    },
  ]);
  console.log("[Seeder] Quotations created");

  // 10. Notifications
  await Notification.insertMany([
    {
      type: "payment",
      title: "Payment Received",
      message: "Payment of ₹35,398 received from NovaTech Systems for Invoice INV-2025-10001.",
      read: true,
    },
    {
      type: "overdue",
      title: "Invoice Overdue",
      message: "Invoice INV-2025-10004 is overdue by 45 days. Action required.",
      read: false,
    },
    {
      type: "renewal",
      title: "Subscription Renewal Due",
      message: "SkyBridge Logistics subscription renews in 10 days. ₹15,338 invoice sent.",
      read: false,
    },
    {
      type: "quotation",
      title: "Quotation Sent",
      message: "Quotation QUO-2025-20001 sent to Pinnacle Capital Advisors.",
      read: false,
    },
  ]);
  console.log("[Seeder] Notifications created");

  // 11. Default Settings
  await Settings.create({ singletonKey: "global" });
  console.log("[Seeder] Default settings created");

  console.log("\n✅ Seed complete!\n");
  console.log("Demo Login Credentials:");
  console.log("  Admin  — email: admin@brightloop.io   password: admin123");
  console.log("  Staff  — email: priya@brightloop.io   password: staff123");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("[Seeder] Error:", err);
  process.exit(1);
});
