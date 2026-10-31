import { Customer } from "../models/Customer.js";

// GET /customers
export const getAllCustomers = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 50 } = req.query;
    const filter = {};
    if (status && status !== "All") filter.status = status;
    if (search) {
      filter.$or = [
        { companyName: { $regex: search, $options: "i" } },
        { contactName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const customers = await Customer.find(filter)
      .populate("assignedStaffId", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Customer.countDocuments(filter);
    res.json({ success: true, data: customers, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// GET /customers/:id
export const getCustomerById = async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id).populate("assignedStaffId", "name email");
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    res.json({ success: true, data: customer });
  } catch (err) {
    next(err);
  }
};

// POST /customers
export const createCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.create(req.body);
    res.status(201).json({ success: true, data: customer, message: "Customer created successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /customers/:id
export const updateCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    res.json({ success: true, data: customer, message: "Customer updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE /customers/:id
export const deleteCustomer = async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ success: false, message: "Customer not found." });
    res.json({ success: true, data: customer, message: "Customer deleted successfully" });
  } catch (err) {
    next(err);
  }
};
