import React, { useState, useEffect } from "react";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Input, Select, Textarea } from "../../components/common/Input";
import { Modal } from "../../components/common/Modal";
import { ConfirmDialog } from "../../components/common/ConfirmDialog";
import { Pagination } from "../../components/common/Pagination";
import { EmptyState } from "../../components/common/EmptyState";
import { useNotifications } from "../../context/NotificationContext";
import { productService } from "../../services/productService";
import {
  Package,
  Plus,
  Search,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Layers,
  IndianRupee,
  PlusCircle,
  X,
} from "lucide-react";

export const ProductsPage = () => {
  const { showToast } = useNotifications();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "Subscription Software",
    category: "Platform",
    baseSalesPrice: 1000,
    costPrice: 300,
    status: "Active",
    description: "",
    notes: "",
    variants: [
      { id: "var_init_1", name: "Standard (Up to 25 seats)", priceAdjustment: 0, finalPrice: 1000 },
    ],
  });

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await productService.getAll({
        search,
        category: categoryFilter,
        status: statusFilter,
      });
      setProducts(res.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, categoryFilter, statusFilter]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setFormData({
      name: "",
      code: `BL-${Math.floor(100 + Math.random() * 900)}`,
      type: "Subscription Software",
      category: "Platform",
      baseSalesPrice: 1000,
      costPrice: 300,
      status: "Active",
      description: "",
      notes: "Standard SLA included.",
      variants: [
        { id: `var_${Date.now()}`, name: "Standard Base Tier", priceAdjustment: 0, finalPrice: 1000 },
      ],
    });
    setIsCreateOpen(true);
  };

  const handleOpenEdit = (product) => {
    setIsEditing(true);
    setSelectedProduct(product);
    setFormData({
      ...product,
      variants: product.variants || [],
    });
    setIsCreateOpen(true);
  };

  const handleAddVariant = () => {
    const base = Number(formData.baseSalesPrice) || 0;
    const adjustment = 560; // Matching specification example
    setFormData({
      ...formData,
      variants: [
        ...formData.variants,
        {
          id: `var_${Date.now()}`,
          name: "Professional (Expanded Tier)",
          priceAdjustment: adjustment,
          finalPrice: base + adjustment,
        },
      ],
    });
  };

  const handleVariantChange = (index, field, value) => {
    const updated = [...formData.variants];
    updated[index][field] = value;
    if (field === "priceAdjustment") {
      const base = Number(formData.baseSalesPrice) || 0;
      updated[index].finalPrice = base + Number(value);
    }
    setFormData({ ...formData, variants: updated });
  };

  const handleRemoveVariant = (index) => {
    const updated = [...formData.variants];
    updated.splice(index, 1);
    setFormData({ ...formData, variants: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await productService.update(selectedProduct.id, formData);
        showToast("Product updated successfully", "success");
      } else {
        await productService.create(formData);
        showToast("Product created successfully", "success");
      }
      setIsCreateOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await productService.delete(selectedProduct.id);
      showToast("Product removed successfully", "success");
      setIsDeleteOpen(false);
      fetchProducts();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const formatCurrency = (val) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(val || 0);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product & Variant Catalog"
        description="Configure subscription software packages, pricing models, and configurable tiered variants."
        action={
          <Button variant="primary" size="sm" icon={Plus} onClick={handleOpenCreate}>
            New Product
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
              placeholder="Search products by title, SKU code, or category..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Categories</option>
              <option value="Platform">Platform</option>
              <option value="Workflow">Workflow</option>
              <option value="Intelligence">Intelligence</option>
              <option value="Services">Services</option>
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Products Table */}
      <Card>
        {products.length === 0 ? (
          <EmptyState
            title="No products found"
            description="No items match your filter criteria. Try clearing search or create a new product."
            actionText="Create Product"
            onAction={handleOpenCreate}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3.5 pl-5">Product Details</th>
                  <th className="p-3.5">Category & SKU</th>
                  <th className="p-3.5">Base Price</th>
                  <th className="p-3.5">Cost Price</th>
                  <th className="p-3.5">Configured Variants</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 pr-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-3.5 pl-5">
                      <p className="font-semibold text-slate-900 text-sm">{p.name}</p>
                      <p className="text-2xs text-slate-500 line-clamp-1 max-w-sm mt-0.5">{p.description}</p>
                    </td>
                    <td className="p-3.5">
                      <span className="font-mono text-2xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {p.code}
                      </span>
                      <p className="text-2xs text-slate-400 mt-1">{p.category}</p>
                    </td>
                    <td className="p-3.5 font-bold text-slate-900">{formatCurrency(p.baseSalesPrice)}</td>
                    <td className="p-3.5 text-slate-500">{formatCurrency(p.costPrice)}</td>
                    <td className="p-3.5">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700 bg-blue-50 px-2 py-0.5 rounded text-2xs border border-blue-100">
                        <Layers className="w-3 h-3 text-blue-600" />
                        {p.variants?.length || 0} Tier{p.variants?.length === 1 ? "" : "s"}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <Badge status={p.status} />
                    </td>
                    <td className="p-3.5 pr-5 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsDetailOpen(true);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-blue-700 hover:bg-slate-100 cursor-pointer"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-amber-700 hover:bg-slate-100 cursor-pointer"
                        title="Edit Product"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProduct(p);
                          setIsDeleteOpen(true);
                        }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-rose-700 hover:bg-slate-100 cursor-pointer"
                        title="Delete Product"
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

      {/* Create / Edit Product Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title={isEditing ? `Edit Product: ${selectedProduct?.name}` : "Create New Software Product"}
        subtitle="Manage base sales pricing, cost margins, and tiered variants"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              {isEditing ? "Save Changes" : "Create Product"}
            </Button>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Product Name"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Brightloop Core SaaS Platform"
              required
            />
            <Input
              label="SKU Code"
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              placeholder="e.g. BL-CORE"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select
              label="Category"
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={[
                { value: "Platform", label: "Platform" },
                { value: "Workflow", label: "Workflow" },
                { value: "Intelligence", label: "Intelligence" },
                { value: "Services", label: "Professional Services" },
              ]}
            />
            <Input
              label="Base Sales Price (₹)"
              id="baseSalesPrice"
              type="number"
              value={formData.baseSalesPrice}
              onChange={(e) => {
                const base = Number(e.target.value);
                setFormData({
                  ...formData,
                  baseSalesPrice: base,
                  variants: formData.variants.map((v) => ({
                    ...v,
                    finalPrice: base + Number(v.priceAdjustment || 0),
                  })),
                });
              }}
              required
            />
            <Input
              label="Estimated Cost Price (₹)"
              id="costPrice"
              type="number"
              value={formData.costPrice}
              onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
              required
            />
          </div>

          <Textarea
            label="Product Description"
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Detailed overview of module capabilities..."
          />

          {/* Product Variants Configuration Section */}
          <div className="pt-3 border-t border-slate-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Configurable Variants & Tiers
                </h4>
                <p className="text-2xs text-slate-500">
                  Example: Base = ₹1,000 + Adjustment ₹560 = Final ₹1,560
                </p>
              </div>
              <Button type="button" variant="outline" size="xs" icon={PlusCircle} onClick={handleAddVariant}>
                Add Variant Tier
              </Button>
            </div>

            <div className="space-y-2.5">
              {formData.variants?.map((variant, idx) => (
                <div key={variant.id || idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                  <div className="grow w-full">
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(idx, "name", e.target.value)}
                      placeholder="Variant Tier Name (e.g. Professional 100 Seats)"
                      className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    />
                  </div>
                  <div className="w-36 shrink-0">
                    <div className="flex items-center gap-1">
                      <span className="text-2xs text-slate-400">Adj:</span>
                      <input
                        type="number"
                        value={variant.priceAdjustment}
                        onChange={(e) => handleVariantChange(idx, "priceAdjustment", e.target.value)}
                        placeholder="Adjustment"
                        className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded text-xs text-slate-900 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="w-32 shrink-0 text-right">
                    <span className="text-2xs text-slate-400 block">Final Price:</span>
                    <span className="font-bold text-xs text-blue-900">
                      {formatCurrency(variant.finalPrice)}
                    </span>
                  </div>
                  {formData.variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(idx)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </form>
      </Modal>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal
          isOpen={isDetailOpen}
          onClose={() => setIsDetailOpen(false)}
          title={selectedProduct.name}
          subtitle={`SKU: ${selectedProduct.code} • ${selectedProduct.category}`}
          size="md"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 rounded-xl text-xs">
              <div>
                <span className="text-slate-400 block">Base Price:</span>
                <span className="text-base font-bold text-slate-900">{formatCurrency(selectedProduct.baseSalesPrice)}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Cost Price:</span>
                <span className="text-base font-medium text-slate-700">{formatCurrency(selectedProduct.costPrice)}</span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Description</h4>
              <p className="text-xs text-slate-700 leading-relaxed">{selectedProduct.description}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">
                Available Product Variants
              </h4>
              <div className="divide-y divide-slate-100 border border-slate-200 rounded-lg">
                {selectedProduct.variants?.map((v) => (
                  <div key={v.id} className="p-3 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-medium text-slate-900">{v.name}</p>
                      <p className="text-2xs text-slate-400">Adjustment: +{formatCurrency(v.priceAdjustment)}</p>
                    </div>
                    <span className="font-bold text-blue-900">{formatCurrency(v.finalPrice)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message={`Are you sure you want to delete "${selectedProduct?.name}"? Any subscriptions referencing this product in the future will require re-configuration.`}
      />
    </div>
  );
};
