import { User } from "../models/User.js";

// GET /staff  — users with role admin or staff
export const getAllStaff = async (req, res, next) => {
  try {
    const { search, department, page = 1, limit = 50 } = req.query;
    const filter = { role: { $in: ["admin", "staff"] } };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    const staff = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await User.countDocuments(filter);
    res.json({ success: true, data: staff, total, page: Number(page) });
  } catch (err) {
    next(err);
  }
};

// POST /staff
export const createStaff = async (req, res, next) => {
  try {
    const body = { ...req.body };
    if (!body.role || !["admin", "staff"].includes(body.role)) body.role = "staff";
    const user = await User.create(body);
    const out = user.toObject();
    delete out.password;
    res.status(201).json({ success: true, data: out, message: "Staff member created successfully" });
  } catch (err) {
    next(err);
  }
};

// PUT /staff/:id
export const updateStaff = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body; // never allow bulk password updates via this route
    const user = await User.findByIdAndUpdate(req.params.id, rest, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Staff member not found." });
    res.json({ success: true, data: user, message: "Staff member updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE /staff/:id
export const deleteStaff = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "Staff not found." });
    res.json({ success: true, data: user, message: "Staff member removed" });
  } catch (err) {
    next(err);
  }
};
