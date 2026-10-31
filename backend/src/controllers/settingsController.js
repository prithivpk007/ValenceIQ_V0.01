import { Settings } from "../models/Settings.js";

// GET /settings
export const getSettings = async (req, res, next) => {
  try {
    let settings = await Settings.findOne({ singletonKey: "global" });
    if (!settings) {
      // Create defaults on first access
      settings = await Settings.create({ singletonKey: "global" });
    }
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
};

// PUT /settings/:category
export const updateSettings = async (req, res, next) => {
  try {
    const { category } = req.params;
    const allowed = ["company", "billingPreferences", "notifications", "appearance"];
    if (!allowed.includes(category)) {
      return res.status(400).json({ success: false, message: `Invalid settings category: ${category}` });
    }

    const updateObj = {};
    Object.entries(req.body).forEach(([key, value]) => {
      updateObj[`${category}.${key}`] = value;
    });

    const settings = await Settings.findOneAndUpdate(
      { singletonKey: "global" },
      { $set: updateObj },
      { new: true, upsert: true }
    );
    res.json({ success: true, data: settings, message: "Settings saved successfully" });
  } catch (err) {
    next(err);
  }
};
