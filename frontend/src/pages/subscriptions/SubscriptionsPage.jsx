import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { subscriptionService } from "../../services/subscriptionService";
import { customerService } from "../../services/customerService";
import { planService } from "../../services/planService";
import {
  Repeat,
  Plus,
  Search,
  PauseCircle,
  PlayCircle,
  RefreshCw,
  XCircle,
  Eye,
  Calendar,
  Clock,
  ArrowRight,
} from "lucide-react";

export const SubscriptionsPage = () => {
  const { showToast } = useNotifications();
  const [subscriptions, setSubscriptions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedSub, setSelectedSub] = useState(null);

  const [formData, setFormData] = useState({
    customerId: "cust_1",
    customerName: "TechScale Solutions Pvt Ltd",
    planId: "plan_enterprise_pro",
    planName: "Enterprise Intelligence Plan",
    startDate: new Date().toISOString().split("T")[0],
    expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
    nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
    billingInterval: "Monthly",
    paymentTerms: "Net 15",
    subscriptionValue: 5260,
    status: "Active",
  });

  const loadData = async () => {
    try {
      const [subRes, custRes, planRes] = await Promise.all([
        subscriptionService.getAll({ search, status: statusFilter }),
        customerService.getAll(),
        planService.getAll(),
      ]);
      setSubscriptions(subRes.data);
      setCustomers(custRes.data);
      setPlans(planRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, statusFilter]);

  const handleOpenCreate = () => {
    const cust = customers[0] || { id: "cust_1", name: "TechScale Solutions Pvt Ltd" };
    const pl = plans[0] || { id: "plan_starter", name: "Starter Growth Plan", price: 1560, billingInterval: "Monthly" };
    setFormData({
      customerId: cust.id,
      customerName: cust.name,
      planId: pl.id,
      planName: pl.name,
      startDate: new Date().toISOString().split("T")[0],
      expiryDate: new Date(Date.now() + 365 * 86400000).toISOString().split("T")[0],
      nextBillingDate: new Date(Date.now() + 30 * 86400000).toISOString().split("T")[0],
      billingInterval: pl.billingInterval || "Monthly",
      paymentTerms: "Net 15",
      subscriptionValue: pl.price || 1560,
      status: "Active",
    });
    setIsCreateOpen(true);
  };

  const handlePlanChange = (planId) => {
    const found = plans.find((p) => p.id === planId);
    if (found) {
      setFormData({
        ...formData,
        planId: found.id,
        planName: found.name,
        billingInterval: found.billingInterval,
        subscriptionValue: found.price,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cust = customers.find((c) => c.id === formData.customerId);
      const payload = {
        ...formData,
        customerName: cust ? cust.name : formData.customerName,
      };
      await subscriptionService.create(payload);
      showToast("Subscription provisioned successfully", "success");
      setIsCreateOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleStatusTransition = async (sub, targetStatus, reason = "") => {
    try {
      await subscriptionService.updateStatus(sub.id, targetStatus, reason);
      showToast(`Subscription ${sub.subscriptionNumber} marked as ${targetStatus}`, "success");
      loadData();
      if (selectedSub?.id === sub.id) {
        setSelectedSub((prev) => ({ ...prev, status: targetStatus }));
      }
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleRenew = async (sub) => {
    try {
      await subscriptionService.renew(sub.id);
      showToast(`Subscription ${sub.subscriptionNumber} successfully renewed!`, "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Contract Management"
        description="Monitor active customer recurring lifecycles, schedule automated renewals, and manage pause or termination requests."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Provision Subscription
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative grow">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by subscription #, client company, or plan package..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Paused">Paused</option>
            <option value="Closed">Closed</option>
            <option value="Draft">Draft</option>
            <option value="Quotation">Quotation</option>
            <option value="Confirmed">Confirmed</option>
          </select>
        </div>
      </Card>

      {/* Subscriptions Table */}
      <Card>
        {subscriptions.length === 0 ? (
          <EmptyState
            title="No subscriptions match criteria"
            description="Adjust search parameters or provision a new recurring subscription."
            actionText="Provision Subscription"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Subscription #</th>
                  <th className="p-3.5">Subscriber</th>
                  <th className="p-3.5">Plan / Package</th>
                  <th className="p-3.5">Next Billing</th>
                  <th className="p-3.5">Contract Value</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <span className="font-semibold text-slate-900 block">{sub.subscriptionNumber}</span>
                      <span className="text-2xs text-slate-400 font-mono">Terms: {sub.paymentTerms}</span>
                    </td>
                    <td className="p-3.5 font-medium">{sub.customerName}</td>
                    <td className="p-3.5">
                      <p className="font-medium text-slate-800">{sub.planName}</p>
                      <p className="text-2xs text-slate-400">Billed {sub.billingInterval}</p>
                    </td>
                    <td className="p-3.5 font-medium text-slate-900">{sub.nextBillingDate}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(sub.subscriptionValue)}</td>
                    <td className="p-3.5">
                      <Badge status={sub.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Eye}
                        onClick={() => {
                          setSelectedSub(sub);
                          setIsDetailOpen(true);
                        }}
                      >
                        Logs
                      </Button>

                      {sub.status === "Active" && (
                        <>
                          <Button
                            variant="secondary"
                            size="xs"
                            icon={PauseCircle}
                            onClick={() => handleStatusTransition(sub, "Paused", "Staff requested pause")}
                          >
                            Pause
                          </Button>
                          <Button
                            variant="outline"
                            size="xs"
                            icon={RefreshCw}
                            onClick={() => handleRenew(sub)}
                          >
                            Renew
                          </Button>
                        </>
                      )}

                      {sub.status === "Paused" && (
                        <Button
                          variant="success"
                          size="xs"
                          icon={PlayCircle}
                          onClick={() => handleStatusTransition(sub, "Active", "Resumed by operator")}
                        >
                          Resume
                        </Button>
                      )}

                      {sub.status !== "Closed" && (
                        <Button
                          variant="dangerOutline"
                          size="xs"
                          icon={XCircle}
                          onClick={() => handleStatusTransition(sub, "Closed", "Customer requested cancellation")}
                        >
                          Close
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Subscription Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Provision Subscription Agreement"
        subtitle="Initiate recurring platform access for an enterprise account"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Activate Subscription
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Customer Account"
            id="sub-cust"
            value={formData.customerId}
            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
            options={customers.map((c) => ({ value: c.id, label: c.name }))}
            required
          />

          <Select
            label="Subscription Plan"
            id="sub-plan"
            value={formData.planId}
            onChange={(e) => handlePlanChange(e.target.value)}
            options={plans.map((p) => ({
              value: p.id,
              label: `${p.name} — ₹${p.price}/${p.billingInterval}`,
            }))}
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Start Date"
              id="sub-start"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Expiry Date"
              id="sub-expiry"
              type="date"
              value={formData.expiryDate}
              onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Contract Value (₹)"
              id="sub-val"
              type="number"
              value={formData.subscriptionValue}
              onChange={(e) => setFormData({ ...formData, subscriptionValue: Number(e.target.value) })}
              required
            />
            <Select
              label="Payment Terms"
              id="sub-terms"
              value={formData.paymentTerms}
              onChange={(e) => setFormData({ ...formData, paymentTerms: e.target.value })}
              options={[
                { value: "Immediate", label: "Immediate" },
                { value: "Net 15", label: "Net 15 Days" },
                { value: "Net 30", label: "Net 30 Days" },
              ]}
            />
          </div>
        </form>
      </Modal>

      {/* Subscription Timeline & Detail Modal */}
      {selectedSub && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={`Subscription Audit: ${selectedSub.subscriptionNumber}`}
          subtitle={`${selectedSub.customerName} • ${selectedSub.planName}`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Subscription Status:</span>
                <Badge status={selectedSub.status} />
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Contract Value:</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedSub.subscriptionValue)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Billing Interval:</span>
                <span>{selectedSub.billingInterval}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Term Dates:</span>
                <span>{selectedSub.startDate} to {selectedSub.expiryDate}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                Lifecycle Event Log & State Audit
              </h4>
              <div className="border-l-2 border-blue-600 pl-4 space-y-3">
                {selectedSub.timeline?.map((entry, idx) => (
                  <div key={idx} className="relative">
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
