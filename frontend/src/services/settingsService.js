import { mockDelay, createApiResponse } from "./apiClient";

const DEFAULT_SETTINGS = {
  company: {
    name: "ValenceIQ Financial Systems Pvt. Ltd.",
    legalEntity: "ValenceIQ Technologies India Private Limited",
    corporateTaxId: "GSTIN29AAACB1234F1Z8",
    email: "billing@valenceiq.com",
    phone: "+91 80 4123 4567",
    website: "https://valenceiq.com",
    address: "Embassy TechVillage, Tower 2B, Outer Ring Road, Bengaluru, KA 560103",
    currency: "INR (₹)",
    fiscalYearStart: "April",
    invoicePrefix: "INV-2024-",
  },
  billingPreferences: {
    defaultPaymentTerms: "Net 15",
    gracePeriodDays: 14,
    retryIntervalDays: 3,
    autoInvoiceGeneration: true,
    sendOverdueReminders: true,
  },
  notifications: {
    emailOnRenewal: true,
    emailOnPaymentFailure: true,
    emailOnQuotationConfirm: true,
    slackIntegration: true,
    weeklyExecutiveReport: false,
  },
  appearance: {
    theme: "Light Navy",
    compactTables: false,
    showCurrencySymbol: true,
  },
};

class SettingsService {
  constructor() {
    const saved = localStorage.getItem("valenceiq_app_settings") || localStorage.getItem("brightloop_app_settings");
    this.settings = saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  }

  async getSettings() {
    await mockDelay(80);
    return createApiResponse(this.settings);
  }

  async updateSettings(category, data) {
    await mockDelay(120);
    this.settings[category] = { ...this.settings[category], ...data };
    localStorage.setItem("valenceiq_app_settings", JSON.stringify(this.settings));
    return createApiResponse(this.settings, "Settings saved successfully");
  }
}

export const settingsService = new SettingsService();
