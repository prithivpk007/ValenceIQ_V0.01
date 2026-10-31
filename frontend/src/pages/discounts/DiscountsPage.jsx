import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { discountService } from "../../services/discountService";
import {
  Percent,
  Plus,
  Search,
  Tag,
  ToggleLeft,
  ToggleRight,
  Edit2,
  Trash2,
  Calendar,
  CheckCircle2,
} from "lucide-react";

export const DiscountsPage = () => {
  const { showToast } = useNotifications();
  const [discounts, setDiscounts] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    name: "",
    type: "Percentage",
    value: 15,
    minPurchase: 3000,
    minQuantity: 1,
    startDate: new Date().toISOString().split("T")[0],
    endDate: "2025-12-31",
    usageLimit: 50,
    scope: "Subscription-level",
    description: "",
  });

  const loadData = async () => {
    try {
      const res = await discountService.getAll({ search, type: typeFilter });
      setDiscounts(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, typeFilter]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      code: `PROMO${Math.floor(100 + Math.random() * 900)}`,
      name: "",
      type: "Percentage",
      value: 10,
      minPurchase: 2000,
      minQuantity: 1,
      startDate: new Date().toISOString().split("T")[0],
      endDate: "2025-12-31",
      usageLimit: 100,
      scope: "Subscription-level",
      description: "Promotional scale incentive",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (disc) => {
    setIsEditing(true);
    setSelectedDiscount(disc);
    setFormData({ ...disc });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (disc) => {
    try {
      await discountService.toggleStatus(disc.id);
      showToast(`Discount rule ${disc.code} updated`, "success");
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await discountService.update(selectedDiscount.id, formData);
        showToast("Discount rule updated", "success");
      } else {
        await discountService.create(formData);
        showToast("Discount rule created", "success");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await discountService.delete(selectedDiscount.id);
      showToast("Discount rule deleted", "success");
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
        title="Discount & Promotional Campaigns"
        description="Administer coupon codes, percentage markdowns, subscription-level scopes, and redemption ceilings."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            New Discount Code
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
              placeholder="Search by promo code or campaign title..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Discount Types</option>
            <option value="Percentage">Percentage (%)</option>
            <option value="Fixed">Fixed Amount (₹)</option>
          </select>
        </div>
      </Card>

      {/* Discounts Table */}
      <Card>
        {discounts.length === 0 ? (
          <EmptyState
            title="No discount campaigns found"
            description="Create a promotional coupon code for customer sales."
            actionText="Create Discount"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Promo Code</th>
                  <th className="p-3.5">Campaign Name</th>
                  <th className="p-3.5">Discount Value</th>
                  <th className="p-3.5">Scope & Threshold</th>
                  <th className="p-3.5">Validity Dates</th>
                  <th className="p-3.5">Usage / Limit</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {discounts.map((d) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {d.code}
                      </span>
                    </td>
                    <td className="p-3.5 font-medium text-slate-900">{d.name}</td>
                    <td className="p-3.5 font-bold text-emerald-700">
                      {d.type === "Percentage" ? `${d.value}% Off` : `Flat ₹${d.value} Off`}
                    </td>
                    <td className="p-3.5">
                      <p className="font-medium text-slate-800">{d.scope}</p>
                      <p className="text-2xs text-slate-400">Min: {formatCurrency(d.minPurchase)} (Qty: {d.minQuantity})</p>
                    </td>
                    <td className="p-3.5 text-2xs text-slate-500">
                      {d.startDate} to {d.endDate}
                    </td>
                    <td className="p-3.5">
                      <span className="font-semibold text-slate-900">{d.usageCount}</span>
                      <span className="text-slate-400"> / {d.usageLimit}</span>
                    </td>
                    <td className="p-3.5">
                      <Badge status={d.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1.5">
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={d.status === "Active" ? ToggleRight : ToggleLeft}
                        onClick={() => handleToggleStatus(d)}
                        title={d.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        {d.status === "Active" ? "Active" : "Inactive"}
                      </Button>
                      <Button variant="ghost" size="xs" icon={Edit2} onClick={() => handleOpenEdit(d)} />
                      <Button
                        variant="ghost"
                        size="xs"
                        icon={Trash2}
                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                        onClick={() => {
                          setSelectedDiscount(d);
                          setIsDeleteOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Discount: ${selectedDiscount?.code}` : "Create Promotional Rule"}
        subtitle="Establish discount criteria, usage caps, and expiration bounds"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? "Save Changes" : "Create Code"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Promo Code"
              id="disc-code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              placeholder="e.g. DIWALI2024"
              required
            />
            <Input
              label="Campaign Name"
              id="disc-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Festive Scale Booster"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Discount Type"
              id="disc-type"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              options={[
                { value: "Percentage", label: "Percentage (%)" },
                { value: "Fixed", label: "Fixed Amount (₹)" },
              ]}
            />
            <Input
              label={formData.type === "Percentage" ? "Value (%)" : "Value (₹)"}
              id="disc-value"
              type="number"
              value={formData.value}
              onChange={(e) => setFormData({ ...formData, value: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Application Scope"
              id="disc-scope"
              value={formData.scope}
              onChange={(e) => setFormData({ ...formData, scope: e.target.value })}
              options={[
                { value: "Subscription-level", label: "Subscription-level (Entire Plan)" },
                { value: "Product-level", label: "Product-level (Add-on specific)" },
              ]}
            />
            <Input
              label="Max Usage Limit"
              id="disc-limit"
              type="number"
              value={formData.usageLimit}
              onChange={(e) => setFormData({ ...formData, usageLimit: Number(e.target.value) })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Min Order Amount (₹)"
              id="disc-min"
              type="number"
              value={formData.minPurchase}
              onChange={(e) => setFormData({ ...formData, minPurchase: Number(e.target.value) })}
            />
            <Input
              label="Min Quantity"
              id="disc-qty"
              type="number"
              value={formData.minQuantity}
              onChange={(e) => setFormData({ ...formData, minQuantity: Number(e.target.value) })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Valid From"
              id="disc-start"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Valid Until"
              id="disc-end"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Discount Campaign"
        message={`Are you sure you want to delete ${selectedDiscount?.code}?`}
      />
    </div>
  );
};
