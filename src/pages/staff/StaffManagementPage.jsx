import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { useNotifications } from "../../context/NotificationContext";
import { staffService } from "../../services/staffService";
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Briefcase,
  Edit2,
  Trash2,
  Shield,
} from "lucide-react";

export const StaffManagementPage = () => {
  const { showToast } = useNotifications();
  const [staff, setStaff] = useState([]);
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "Sales & Client Success",
    role: "Senior Account Executive",
    phone: "+91 98000 00000",
    status: "Active",
  });

  const loadData = async () => {
    try {
      const res = await staffService.getAll({ search, department: deptFilter });
      setStaff(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, deptFilter]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      email: "",
      department: "Sales & Client Success",
      role: "Account Executive",
      phone: "+91 ",
      status: "Active",
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (member) => {
    setIsEditing(true);
    setSelectedStaff(member);
    setFormData({ ...member });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await staffService.update(selectedStaff.id, formData);
        showToast("Staff profile updated", "success");
      } else {
        await staffService.create(formData);
        showToast("Staff member added successfully", "success");
      }
      setIsModalOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDelete = async () => {
    try {
      await staffService.delete(selectedStaff.id);
      showToast("Staff member removed", "success");
      setIsDeleteOpen(false);
      loadData();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Team Member Directory"
        description="Manage internal sales reps, operations coordinators, account allocation counts, and access levels."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            Add Team Member
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
              placeholder="Search by staff member name, role, or email..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
          >
            <option value="All">All Departments</option>
            <option value="Sales & Client Success">Sales & Client Success</option>
            <option value="Customer Operations">Customer Operations</option>
            <option value="Billing & Finance">Billing & Finance</option>
            <option value="Support & Success">Support & Success</option>
          </select>
        </div>
      </Card>

      {/* Staff Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
              <tr>
                <th className="p-3.5 pl-5">Staff Member</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Designated Role</th>
                <th className="p-3.5">Assigned Accounts</th>
                <th className="p-3.5">Joined Date</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {staff.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3.5 pl-5">
                    <p className="font-semibold text-slate-900 text-sm">{m.name}</p>
                    <p className="text-2xs text-slate-500">{m.email} • {m.phone}</p>
                  </td>
                  <td className="p-3.5 font-medium">{m.department}</td>
                  <td className="p-3.5 text-slate-700">{m.role}</td>
                  <td className="p-3.5">
                    <span className="font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                      {m.assignedCustomersCount} Clients
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-500">{m.joinedDate}</td>
                  <td className="p-3.5">
                    <Badge status={m.status} />
                  </td>
                  <td className="p-3.5 pr-5 text-right space-x-1.5">
                    <Button variant="ghost" size="xs" icon={Edit2} onClick={() => handleOpenEdit(m)} />
                    <Button
                      variant="ghost"
                      size="xs"
                      icon={Trash2}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                      onClick={() => {
                        setSelectedStaff(m);
                        setIsDeleteOpen(true);
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add / Edit Staff Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isEditing ? `Edit Staff: ${selectedStaff?.name}` : "Add Internal Team Member"}
        subtitle="Configure internal permissions, role titles, and department affiliations"
        size="md"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? "Save Profile" : "Add Member"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            id="stf-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g. Arjun Mehta"
            required
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Work Email"
              id="stf-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="arjun@brightloop.io"
              required
            />
            <Input
              label="Phone Number"
              id="stf-phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="+91 97222 33445"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Department"
              id="stf-dept"
              value={formData.department}
              onChange={(e) => setFormData({ ...formData, department: e.target.value })}
              options={[
                { value: "Sales & Client Success", label: "Sales & Client Success" },
                { value: "Customer Operations", label: "Customer Operations" },
                { value: "Billing & Finance", label: "Billing & Finance" },
                { value: "Support & Success", label: "Support & Success" },
              ]}
            />
            <Input
              label="Designated Role / Title"
              id="stf-role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="e.g. Senior Account Executive"
              required
            />
          </div>

          <Select
            label="Status"
            id="stf-status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "Active", label: "Active" },
              { value: "On Leave", label: "On Leave" },
            ]}
          />
        </form>
      </Modal>

      {/* Delete Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Remove Staff Member"
        message={`Are you sure you want to remove ${selectedStaff?.name}?`}
      />
    </div>
  );
};
