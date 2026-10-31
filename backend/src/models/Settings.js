import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    singletonKey: { type: String, default: "global", unique: true },
    company: {
      name: { type: String, default: "ValenceIQ Financial Systems Pvt. Ltd." },
      legalEntity: { type: String, default: "ValenceIQ Analytics India Private Limited" },
      corporateTaxId: { type: String, default: "GSTIN29AAACB1234F1Z8" },
      email: { type: String, default: "billing@valenceiq.com" },
      phone: { type: String, default: "+91 80 4123 4567" },
      website: { type: String, default: "https://valenceiq.com" },
      address: { type: String, default: "Embassy TechVillage, Tower 2B, Outer Ring Road, Bengaluru, KA 560103" },
      currency: { type: String, default: "INR (₹)" },
      fiscalYearStart: { type: String, default: "April" },
      invoicePrefix: { type: String, default: "INV-2024-" },
    },
    billingPreferences: {
      defaultPaymentTerms: { type: String, default: "Net 15" },
      gracePeriodDays: { type: Number, default: 14 },
      retryIntervalDays: { type: Number, default: 3 },
      autoInvoiceGeneration: { type: Boolean, default: true },
      sendOverdueReminders: { type: Boolean, default: true },
    },
    notifications: {
      emailOnRenewal: { type: Boolean, default: true },
      emailOnPaymentFailure: { type: Boolean, default: true },
      emailOnQuotationConfirm: { type: Boolean, default: true },
      slackIntegration: { type: Boolean, default: true },
      weeklyExecutiveReport: { type: Boolean, default: false },
    },
    appearance: {
      theme: { type: String, default: "Light Navy" },
      compactTables: { type: Boolean, default: false },
      showCurrencySymbol: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const Settings = mongoose.model("Settings", settingsSchema);
