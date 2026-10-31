import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { customerService } from "../../services/customerService";
import {
  Users,
  Plus,
  Search,
  Eye,
  Edit2,
  Trash2,
  Building,
  Mail,
  Phone,
  ArrowRight,
} from "lucide-react";

export const CustomersPage = () => {
  const { showToast } = useNotifications();
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    contactPerson: "",
    email: "",
    phone: "",
    billingAddress: "",
    taxId: "",
    status: "Active",
    assignedStaff: "Priya Sharma",
  });

  const fetchCustomers = async () => {
    const res = await customerService.getAll({ search, status: statusFilter });
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchCustomers();
  }, [search, statusFilter]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      contactPerson: "",
      email: "",
      phone: "+91 ",
      billingAddress: "",
      taxId: "GSTIN",
      status: "Active",
      assignedStaff: "Priya Sharma",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer) => {
    setIsEditing(true);
    setSelectedCustomer(customer);
    setFormData({ ...customer });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await customerService.update(selectedCustomer.id, formData);
        showToast("Customer profile updated", "success");
      } else {
        await customerService.create(formData);
        showToast("Customer onboarded successfully", "success");
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await customerService.delete(selectedCustomer.id);
      showToast("Customer deleted", "success");
      setIsDeleteOpen(false);
      fetchCustomers();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customer Account Directory"
        description="Enterprise client accounts, corporate billing details, assigned representatives, and subscription health."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Onboard Customer
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
              placeholder="Search by company name, primary contact person, or email..."
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
            <option value="Pending">Pending</option>
            <option value="Suspended">Suspended</option>
          </select>
        </div>
      </Card>

      {/* Customers Table */}
      <Card>
        {customers.length === 0 ? (
          <EmptyState
            title="No customer records found"
            description="Try adjusting your search criteria or register a new customer account."
            actionText="Onboard Customer"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Company / Client</th>
                  <th className="p-3.5">Primary Contact</th>
                  <th className="p-3.5">Tax Identifier</th>
                  <th className="p-3.5">Assigned AE</th>
                  <th className="p-3.5">Total Billed</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <Link to={`/customers/${c.id}`} className="font-semibold text-slate-900 text-sm hover:text-blue-700 block">
                        {c.name}
                      </Link>
                      <span className="text-2xs text-slate-400">{c.billingAddress?.split(",")[1] || "India"}</span>
                    </td>
                    <td className="p-3.5">
                      <p className="font-medium text-slate-800">{c.contactPerson}</p>
                      <p className="text-2xs text-slate-500">{c.email}</p>
                    </td>
                    <td className="p-3.5 font-mono text-2xs text-slate-600">{c.taxId || "—"}</td>
                    <td className="p-3.5 text-slate-700">{c.assignedStaff}</td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(c.totalSpent)}</td>
                    <td className="p-3.5">
                      <Badge status={c.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1.5">
                      <Link to={`/customers/${c.id}`}>
                        <button
                          className="p-1.5 rounded-md text-slate-400 hover:text-blue-700 hover:bg-slate-100 cursor-pointer"
                          title="View 360° Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </Link>
                      <button
                        onClick={() => handleOpenEdit(c)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-700 hover:bg-slate-100 cursor-pointer"
                        title="Edit Customer"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedCustomer(c);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-700 hover:bg-slate-100 cursor-pointer"
                        title="Delete Customer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Onboard / Edit Customer Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Customer: ${selectedCustomer?.name}` : "Onboard New Enterprise Customer"}
        subtitle="Record corporate billing details, tax compliance numbers, and designated account executive"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? "Update Customer" : "Onboard Customer"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Company Name"
              id="cust-name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. BluePeak Technologies Pvt Ltd"
              required
            />
            <Input
              label="Primary Contact Person"
              id="cust-contact"
              value={formData.contactPerson}
              onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              placeholder="e.g. Siddharth Rao"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              id="cust-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="contact@company.com"
              required
            />
            <Input
              label="Phone Number"
              id="cust-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 98765 43210"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Tax ID / GSTIN"
              id="cust-tax"
              value={formData.taxId}
              onChange={(e) => setFormData({ ...formData, taxId: e.target.value })}
              placeholder="GSTIN29AAACB1234F1Z8"
            />
            <Select
              label="Assigned Account Executive"
              id="cust-staff"
              value={formData.assignedStaff}
              onChange={(e) => setFormData({ ...formData, assignedStaff: e.target.value })}
              options={[
                { value: "Priya Sharma", label: "Priya Sharma (Senior AE)" },
                { value: "Arjun Mehta", label: "Arjun Mehta (Ops Specialist)" },
                { value: "Neha Nair", label: "Neha Nair (Billing Coordinator)" },
              ]}
            />
          </div>

          <Input
            label="Registered Billing Address"
            id="cust-addr"
            value={formData.billingAddress}
            onChange={(e) => setFormData({ ...formData, billingAddress: e.target.value })}
            placeholder="Floor, Tech Park, City, State, PIN"
            required
          />

          <Select
            label="Account Status"
            id="cust-status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "Active", label: "Active (Permitted to subscribe)" },
              { value: "Pending", label: "Pending (Under verification)" },
              { value: "Suspended", label: "Suspended (Past due escalation)" },
            ]}
          />
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Customer Account"
        message={`Are you sure you want to delete ${selectedCustomer?.name}? This will remove associated local records.`}
      />
    </div>
  );
};
