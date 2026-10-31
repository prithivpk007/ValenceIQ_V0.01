import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, CardHeader, CardContent } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select, Textarea } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useNotifications } from "../../context/NotificationContext";
import { planService } from "../../services/planService";
import { productService } from "../../services/productService";
import {
  Layers,
  Plus,
  LayoutGrid,
  List,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Clock,
  Edit2,
  Trash2,
  ShieldAlert,
} from "lucide-react";

export const PlansPage = () => {
  const { showToast } = useNotifications();
  const [plans, setPlans] = useState([]);
  const [products, setProducts] = useState([]);
  const [viewMode, setViewMode] = useState("cards"); // 'cards' | 'table'
  const [intervalFilter, setIntervalFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    billingInterval: "Monthly",
    price: 1560,
    associatedProducts: ["prod_1"],
    minQuantity: 1,
    availableFrom: "2024-01-01",
    availableUntil: "2025-12-31",
    description: "",
    features: ["Core Platform Access", "Standard Analytics"],
    autoClosureRules: "Cancel after 3 failed consecutive payment attempts (15-day grace).",
    earlyClosureRules: "Customer may cancel with 30-day notice; no fee.",
    pauseRules: "Allowed up to 60 days once per calendar year.",
    renewalRules: "Auto-renews monthly unless cancelled 7 days prior to billing date.",
  });

  const loadData = async () => {
    try {
      const [plansRes, prodRes] = await Promise.all([
        planService.getAll({ billingInterval: intervalFilter }),
        productService.getAll(),
      ]);
      setPlans(plansRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [intervalFilter]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      code: `PL-${Math.floor(100 + Math.random() * 900)}`,
      billingInterval: "Monthly",
      price: 1560,
      associatedProducts: ["prod_1"],
      minQuantity: 1,
      availableFrom: new Date().toISOString().split("T")[0],
      availableUntil: "2025-12-31",
      description: "",
      features: ["ValenceIQ Core Engine", "Automated Billing & Invoicing", "Email Support"],
      autoClosureRules: "Automatic account termination after 15 days of non-payment.",
      earlyClosureRules: "Early termination permitted with 30-day advance notice.",
      pauseRules: "Permitted up to 60 days per calendar year.",
      renewalRules: "Auto-renews on scheduled billing cycle unless cancelled.",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (plan) => {
    setIsEditing(true);
    setSelectedPlan(plan);
    setFormData({ ...plan });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await planService.update(selectedPlan.id, formData);
        showToast("Subscription plan updated", "success");
      } else {
        await planService.create(formData);
        showToast("Subscription plan created", "success");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await planService.delete(selectedPlan.id);
      showToast("Plan deleted successfully", "success");
      setIsDeleteOpen(false);
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
        title="Subscription Plan Management"
        description="Structure recurring tiers, billing intervals, automatic renewal policies, and closure terms."
        action={
          <div className="flex items-center gap-2">
            <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                onClick={() => setViewMode("cards")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "cards" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Grid Cards"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  viewMode === "table" ? "bg-white text-slate-900 shadow-2xs" : "text-slate-500 hover:text-slate-900"
                }`}
                title="Table View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>

            <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
              New Plan
            </Button>
          </div>
        }
      />

      {/* Interval Filters */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
        {["All", "Daily", "Weekly", "Monthly", "Yearly"].map((interval) => (
          <button
            key={interval}
            onClick={() => setIntervalFilter(interval)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-colors ${
              intervalFilter === interval
                ? "bg-blue-700 text-white"
                : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {interval} {interval !== "All" && "Interval"}
          </button>
        ))}
      </div>

      {/* Plan Cards View */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <Card key={plan.id} className="p-6 flex flex-col justify-between hover:border-blue-300">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xs font-mono font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {plan.code}
                  </span>
                  <Badge status={plan.status} />
                </div>

                <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
                <p className="text-2xs text-slate-500 line-clamp-2 mt-1 min-h-[32px]">{plan.description}</p>

                <div className="mt-4 pb-4 border-b border-slate-100">
                  <span className="text-3xl font-extrabold text-blue-900">{formatCurrency(plan.price)}</span>
                  <span className="text-xs text-slate-500 font-normal"> / {plan.billingInterval.toLowerCase()}</span>
                </div>

                {/* Features */}
                <div className="mt-4 space-y-2 text-xs text-slate-700">
                  {plan.features?.map((f, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>

                {/* Lifecycle Rules Preview */}
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-1.5 text-2xs text-slate-500">
                  <p>
                    <span className="font-semibold text-slate-700">Available:</span> {plan.availableFrom} to {plan.availableUntil}
                  </p>
                  <p>
                    <span className="font-semibold text-slate-700">Pause Policy:</span> {plan.pauseRules}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsDetailOpen(true);
                  }}
                >
                  Lifecycle Rules
                </Button>
                <div className="flex gap-1.5">
                  <Button variant="ghost" size="xs" icon={Edit2} onClick={() => handleOpenEdit(plan)}>
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="xs"
                    icon={Trash2}
                    className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    onClick={() => {
                      setSelectedPlan(plan);
                      setIsDeleteOpen(true);
                    }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        /* Table View */
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Plan Title</th>
                  <th className="p-3.5">Interval</th>
                  <th className="p-3.5">Recurring Price</th>
                  <th className="p-3.5">Min Qty</th>
                  <th className="p-3.5">Availability</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {plans.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80">
                    <td className="p-3.5 pl-5 font-semibold text-slate-900">
                      {p.name}
                      <span className="block text-2xs font-mono text-slate-400 font-normal">{p.code}</span>
                    </td>
                    <td className="p-3.5 font-medium">{p.billingInterval}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(p.price)}</td>
                    <td className="p-3.5">{p.minQuantity}</td>
                    <td className="p-3.5 text-2xs text-slate-500">{p.availableFrom} to {p.availableUntil}</td>
                    <td className="p-3.5"><Badge status={p.status} /></td>
                    <td className="p-3.5 pr-5 text-right space-x-1">
                      <Button variant="ghost" size="xs" onClick={() => handleOpenEdit(p)}>
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => {
                          setSelectedPlan(p);
                          setIsDetailOpen(true);
                        }}
                      >
                        Rules
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Create / Edit Plan Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Plan: ${selectedPlan?.name}` : "Create Subscription Plan"}
        subtitle="Configure billing rules, closure triggers, and pause allowances"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? "Save Plan" : "Create Plan"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Plan Name"
              id="plan-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Enterprise Intelligence Plan"
              required
            />
            <Input
              label="Plan Code"
              id="plan-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. PL-ENT-AI"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Billing Interval"
              id="plan-interval"
              value={formData.billingInterval}
              onChange={(e) => setFormData({ ...formData, billingInterval: e.target.value })}
              options={[
                { value: "Daily", label: "Daily" },
                { value: "Weekly", label: "Weekly" },
                { value: "Monthly", label: "Monthly" },
                { value: "Yearly", label: "Yearly" },
              ]}
            />
            <Input
              label="Recurring Price (₹)"
              id="plan-price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
              required
            />
            <Input
              label="Min Order Quantity"
              id="plan-min-qty"
              type="number"
              value={formData.minQuantity}
              onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Available From"
              id="plan-from"
              type="date"
              value={formData.availableFrom}
              onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })}
            />
            <Input
              label="Available Until"
              id="plan-until"
              type="date"
              value={formData.availableUntil}
              onChange={(e) => setFormData({ ...formData, availableUntil: e.target.value })}
            />
          </div>

          <Textarea
            label="Plan Summary / Description"
            id="plan-desc"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />

          {/* Lifecycle & Closure Rules */}
          <div className="p-4 bg-slate-50 rounded-xl space-y-3 border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Subscription Lifecycle & Governance Rules
            </h4>
            <Input
              label="Automatic Closure Rule"
              id="auto-closure"
              value={formData.autoClosureRules}
              onChange={(e) => setFormData({ ...formData, autoClosureRules: e.target.value })}
              helperText="Condition under which the system closes a defaulting subscription"
            />
            <Input
              label="Early Closure Rule"
              id="early-closure"
              value={formData.earlyClosureRules}
              onChange={(e) => setFormData({ ...formData, earlyClosureRules: e.target.value })}
              helperText="Notice period and penalties for client early termination"
            />
            <Input
              label="Pausing Allowance Rule"
              id="pause-rule"
              value={formData.pauseRules}
              onChange={(e) => setFormData({ ...formData, pauseRules: e.target.value })}
              helperText="Allowed pause window duration and annual frequency"
            />
            <Input
              label="Renewal & Evergreen Rules"
              id="renewal-rule"
              value={formData.renewalRules}
              onChange={(e) => setFormData({ ...formData, renewalRules: e.target.value })}
              helperText="Advance notice requirement for automated recurring renewal"
            />
          </div>
        </form>
      </Modal>

      {/* Plan Detail & Lifecycle Modal */}
      {selectedPlan && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedPlan.name}
          subtitle={`Plan Policy & Rules Specification (${selectedPlan.billingInterval})`}
          size="md"
        >
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 flex justify-between items-center">
              <div>
                <span className="text-2xs uppercase tracking-wider text-blue-700 font-semibold">Price per cycle</span>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(selectedPlan.price)}</p>
              </div>
              <Badge status={selectedPlan.status} />
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Automatic Closure Rules:</span>
                <p className="text-slate-600">{selectedPlan.autoClosureRules}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Early Cancellation Terms:</span>
                <p className="text-slate-600">{selectedPlan.earlyClosureRules}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Pause & Suspend Policy:</span>
                <p className="text-slate-600">{selectedPlan.pauseRules}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg">
                <span className="font-semibold text-slate-900 block mb-0.5">Renewal Governance:</span>
                <p className="text-slate-600">{selectedPlan.renewalRules}</p>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Plan"
        message={`Are you sure you want to delete ${selectedPlan?.name}? Existing active subscriptions on this plan will not be modified.`}
      />
    </div>
  );
};
