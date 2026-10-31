import React, { useState } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Tabs } from "../../components/common/Tabs";
import { useNotifications } from "../../context/NotificationContext";
import {
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  AlertTriangle,
  CreditCard,
  FileText,
  Repeat,
  Info,
} from "lucide-react";

export const NotificationsPage = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Alerts", count: notifications.length },
    { id: "Renewals", label: "Renewals", count: notifications.filter((n) => n.category === "Renewals").length },
    { id: "Invoices", label: "Invoices", count: notifications.filter((n) => n.category === "Invoices").length },
    { id: "Payments", label: "Payments", count: notifications.filter((n) => n.category === "Payments").length },
    { id: "Quotations", label: "Quotations", count: notifications.filter((n) => n.category === "Quotations").length },
  ];

  const filtered = activeTab === "all" ? notifications : notifications.filter((n) => n.category === activeTab);

  const getCategoryIcon = (cat) => {
    switch (cat) {
      case "Renewals":
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case "Invoices":
        return <AlertTriangle className="w-4 h-4 text-rose-600" />;
      case "Payments":
        return <CreditCard className="w-4 h-4 text-emerald-600" />;
      case "Quotations":
        return <FileText className="w-4 h-4 text-purple-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-600" />;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Notifications & System Activity Alerts"
        description="Event dispatch log for renewals, overdue notices, gateway confirmations, and client actions."
        action={
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" icon={CheckCheck} onClick={markAllAsRead}>
              Mark All as Read
            </Button>
          </div>
        }
      />

      <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <Card>
        {filtered.length === 0 ? (
          <div className="p-10 text-center text-xs text-slate-500">
            No notifications in this category.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className={`p-4 flex items-start justify-between gap-4 transition-colors cursor-pointer ${
                  !n.read ? "bg-blue-50/40 hover:bg-blue-50/70" : "hover:bg-slate-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-slate-100 shrink-0 mt-0.5">
                    {getCategoryIcon(n.category)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                      <Badge status={n.category} variant="bg-slate-100 text-slate-600 border-slate-200" />
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-2xs text-slate-400 mt-1">{n.time} • Priority: {n.priority}</p>
                  </div>
                </div>

                <div className="shrink-0 text-right">
                  {!n.read && (
                    <span className="text-2xs text-blue-600 font-semibold hover:underline">
                      Mark read
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
