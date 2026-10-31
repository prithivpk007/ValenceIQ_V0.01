import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Tabs } from "../../components/common/Tabs";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { settingsService } from "../../services/settingsService";
import {
  Building,
  User,
  CreditCard,
  Bell,
  Palette,
  Shield,
  Save,
  CheckCircle2,
} from "lucide-react";

export const SettingsPage = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const [activeTab, setActiveTab] = useState("company");
  const [settings, setSettings] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      const res = await settingsService.getSettings();
      setSettings(res.data);
    };
    loadSettings();
  }, []);

  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await settingsService.updateSettings("company", settings.company);
      showToast("Company profile saved successfully", "success");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBilling = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await settingsService.updateSettings("billingPreferences", settings.billingPreferences);
      showToast("Billing preferences updated", "success");
    } finally {
      setIsLoading(false);
    }
  };

  const tabs = [
    { id: "company", label: "Company Profile", icon: Building },
    { id: "user", label: "User Account", icon: User },
    { id: "billing", label: "Billing & Invoicing", icon: CreditCard },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security & Access", icon: Shield },
  ];

  if (!settings) {
    return <div className="p-8 text-center text-xs text-slate-500">Loading platform settings...</div>;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & System Configuration"
        description="Configure legal entity details, billing terms, default payment terms, notification dispatch rules, and password policies."
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      {activeTab === "company" && (
        <Card className="p-6">
          <form onSubmit={handleSaveCompany} className="space-y-4 max-w-2xl">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Legal Corporate Entity
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Company Display Name"
                id="co-name"
                value={settings.company.name}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, name: e.target.value },
                  })
                }
                required
              />
              <Input
                label="Registered Legal Entity"
                id="co-legal"
                value={settings.company.legalEntity}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, legalEntity: e.target.value },
                  })
                }
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Corporate GSTIN / Tax ID"
                id="co-gst"
                value={settings.company.corporateTaxId}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, corporateTaxId: e.target.value },
                  })
                }
                required
              />
              <Input
                label="Finance Contact Email"
                id="co-email"
                type="email"
                value={settings.company.email}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, email: e.target.value },
                  })
                }
                required
              />
            </div>

            <Input
              label="Corporate Headquarters Address"
              id="co-addr"
              value={settings.company.address}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  company: { ...settings.company, address: e.target.value },
                })
              }
              required
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Invoice Number Prefix"
                id="co-prefix"
                value={settings.company.invoicePrefix}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, invoicePrefix: e.target.value },
                  })
                }
                required
              />
              <Select
                label="Accounting Currency"
                id="co-curr"
                value={settings.company.currency}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    company: { ...settings.company, currency: e.target.value },
                  })
                }
                options={[
                  { value: "INR (₹)", label: "Indian Rupee (INR ₹)" },
                  { value: "USD ($)", label: "US Dollar (USD $)" },
                ]}
              />
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" icon={Save} isLoading={isLoading}>
                Save Company Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {activeTab === "user" && (
        <Card className="p-6">
          <div className="max-w-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Current Session Profile
            </h3>

            <div className="flex items-center gap-4">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120"}
                alt={user?.name}
                className="w-16 h-16 rounded-full border border-slate-200 object-cover"
              />
              <div>
                <p className="font-bold text-sm text-slate-900">{user?.name}</p>
                <p className="text-slate-500">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-2xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  Role: {user?.role}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <Input label="Name" id="usr-name" defaultValue={user?.name} />
              <Input label="Title" id="usr-title" defaultValue={user?.title || "Operator"} />
            </div>

            <Input label="Contact Phone" id="usr-phone" defaultValue={user?.phone} />

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => showToast("Profile preferences updated", "success")}
            >
              Update Profile
            </Button>
          </div>
        </Card>
      )}

      {activeTab === "billing" && (
        <Card className="p-6">
          <form onSubmit={handleSaveBilling} className="space-y-4 max-w-xl text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Automated Billing & Dunning Rules
            </h3>

            <Select
              label="Standard Payment Terms"
              id="bill-terms"
              value={settings.billingPreferences.defaultPaymentTerms}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  billingPreferences: {
                    ...settings.billingPreferences,
                    defaultPaymentTerms: e.target.value,
                  },
                })
              }
              options={[
                { value: "Immediate", label: "Due Immediately" },
                { value: "Net 15", label: "Net 15 Days" },
                { value: "Net 30", label: "Net 30 Days" },
              ]}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Grace Period (Days)"
                id="grace-days"
                type="number"
                value={settings.billingPreferences.gracePeriodDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    billingPreferences: {
                      ...settings.billingPreferences,
                      gracePeriodDays: Number(e.target.value),
                    },
                  })
                }
              />
              <Input
                label="Gateway Retry Interval (Days)"
                id="retry-days"
                type="number"
                value={settings.billingPreferences.retryIntervalDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    billingPreferences: {
                      ...settings.billingPreferences,
                      retryIntervalDays: Number(e.target.value),
                    },
                  })
                }
              />
            </div>

            <div className="space-y-2 pt-2">
              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.billingPreferences.autoInvoiceGeneration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      billingPreferences: {
                        ...settings.billingPreferences,
                        autoInvoiceGeneration: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Automatically generate recurring invoices 5 days before cycle date
              </label>

              <label className="flex items-center gap-2 text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.billingPreferences.sendOverdueReminders}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      billingPreferences: {
                        ...settings.billingPreferences,
                        sendOverdueReminders: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                Trigger automated dunning email on day 1, 7, and 14 past due
              </label>
            </div>

            <Button type="submit" variant="primary" icon={Save}>
              Save Billing Rules
            </Button>
          </form>
        </Card>
      )}

      {activeTab === "notifications" && (
        <Card className="p-6">
          <div className="max-w-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Event Dispatch Channels
            </h3>

            <div className="space-y-3 text-slate-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Dispatch email notification upon upcoming 15-day subscription renewal
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Dispatch immediate alert on failed automated card authorization
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Send notification when client electronically confirms a sales quotation
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-blue-600" />
                Forward daily financial summary webhook to Slack #billing-ops
              </label>
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => showToast("Notification dispatch preferences saved", "success")}
            >
              Save Dispatch Preferences
            </Button>
          </div>
        </Card>
      )}

      {activeTab === "security" && (
        <Card className="p-6">
          <div className="max-w-xl space-y-4 text-xs">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Authentication Security & Multi-Factor
            </h3>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg text-blue-900">
              <span className="font-bold">Phase 1 Security Architecture:</span> Session state is managed via secure Context API and demo localStorage. In Phase 2, this will link to JWT HttpOnly cookies, MongoDB RBAC session tokens, and TOTP authenticator MFA.
            </div>

            <div className="space-y-3 pt-2">
              <Input label="Current Password" id="curr-pwd" type="password" placeholder="••••••••" />
              <Input label="New Password" id="new-pwd" type="password" placeholder="••••••••" />
              <Input label="Confirm New Password" id="conf-pwd" type="password" placeholder="••••••••" />
            </div>

            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => showToast("Password updated successfully", "success")}
            >
              Update Security Credentials
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
