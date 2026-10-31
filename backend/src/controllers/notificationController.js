import { Notification } from "../models/Notification.js";

// GET /notifications
export const getAllNotifications = async (req, res, next) => {
  try {
    const { userId } = req.query;
    const filter = userId
      ? { $or: [{ userId }, { userId: null }] }
      : {};
    const notifications = await Notification.find(filter).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// PATCH /notifications/:id/read
export const markAsRead = async (req, res, next) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notif) return res.status(404).json({ success: false, message: "Notification not found." });
    res.json({ success: true, data: notif });
  } catch (err) {
    next(err);
  }
};

// PATCH /notifications/mark-all-read
export const markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany({}, { read: true });
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// DELETE /notifications/clear
export const clearAllNotifications = async (req, res, next) => {
  try {
    await Notification.deleteMany({});
    res.json({ success: true, data: [], message: "All notifications cleared" });
  } catch (err) {
    next(err);
  }
};
