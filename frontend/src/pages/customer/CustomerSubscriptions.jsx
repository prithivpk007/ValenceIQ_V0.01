import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import { subscriptionService } from "../../services/subscriptionService";
import { Repeat, Calendar, CheckCircle2, PauseCircle, PlayCircle, ShieldCheck } from "lucide-react";

export const CustomerSubscriptions = () => {
  const { user } = useAuth();
  const { showToast } = useNotifications();
  const customerId = user?.customerId || "cust_1";

  const [subscriptions, setSubscriptions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSubscriptions = async () => {
    const res = await subscriptionService.getAll({ customerId });
    setSubscriptions(res.data);
  };

  useEffect(() => {
    fetchSubscriptions();
  }, [customerId]);

  const handleTogglePause = async (sub) => {
    try {
      const newStatus = sub.status === "Active" ? "Paused" : "Active";
      await subscriptionService.updateStatus(
        sub.id,
        newStatus,
        sub.status === "Active" ? "Temporary client pause requested" : "Client self-service resumed"
      );
      showToast(`Subscription has been ${newStatus.toLowerCase()} successfully`, "success");
      fetchSubscriptions();
      if (selectedSub?.id === sub.id) {
        setSelectedSub((prev) => ({ ...prev, status: newStatus }));
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Subscriptions"
        description="View your active platform licenses, review billing intervals, and request plan adjustments."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {subscriptions.map((sub) => (
          <Card key={sub.id} className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-2xs font-mono font-semibold text-slate-500">{sub.subscriptionNumber}</span>
                <Badge status={sub.status} />
              </div>

              <h3 className="text-lg font-bold text-slate-900">{sub.planName}</h3>
              <p className="text-2xl font-extrabold text-blue-900 mt-2">
                {formatCurrency(sub.subscriptionValue)}
                <span className="text-xs font-normal text-slate-500"> / {sub.billingInterval.toLowerCase()}</span>
              </p>

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span className="text-slate-400">Term Period:</span>
                  <span className="font-medium text-slate-800">{sub.startDate} to {sub.expiryDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Next Scheduled Billing:</span>
                  <span className="font-semibold text-slate-900">{sub.nextBillingDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Payment Terms:</span>
                  <span>{sub.paymentTerms}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSelectedSub(sub);
                  setIsModalOpen(true);
                }}
              >
                View Details & Logs
              </Button>

              <Button
                variant={sub.status === "Active" ? "outline" : "success"}
                size="sm"
                icon={sub.status === "Active" ? PauseCircle : PlayCircle}
                onClick={() => handleTogglePause(sub)}
              >
                {sub.status === "Active" ? "Pause Subscription" : "Resume Subscription"}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Subscription Detail Modal */}
      {selectedSub && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Subscription Details: ${selectedSub.subscriptionNumber}`}
          subtitle={selectedSub.planName}
          size="md"
        >
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Subscription Status:</span>
                <Badge status={selectedSub.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Recurring Price:</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedSub.subscriptionValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Interval:</span>
                <span>{selectedSub.billingInterval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Next Billing Date:</span>
                <span className="font-medium text-slate-800">{selectedSub.nextBillingDate}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Subscription Lifecycle Timeline
              </h4>
              <div className="border-l-2 border-blue-600 pl-4 space-y-3">
                {selectedSub.timeline?.map((entry, idx) => (
                  <div key={idx} className="text-xs relative">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 border-2 border-white" />
                    <p className="font-semibold text-slate-900">{entry.date}</p>
                    <p className="text-slate-600 mt-0.5">{entry.event}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
