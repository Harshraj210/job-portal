import Notification from "../models/NotificationModel.js";

// Get all notifications for the current user
const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .populate("relatedJob", "title companyName icon"); // Populate job details if needed
    
    return res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return res.status(500).json({ message: "Server error fetching notifications" });
  }
};

// Mark a specific notification as read
const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }

    return res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Helper: Delete notification (Optional, if needed later)
const deleteNotification = async (req, res) => {
    try {
        await Notification.findByIdAndDelete(req.params.id);
        return res.status(200).json({ message: "Notification deleted" });
    } catch (error) {
        return res.status(500).json({ message: "Server error" });
    }
}

// Get unread notification count
const getUnreadCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      recipient: req.user._id,
      isRead: false,
    });
    return res.status(200).json({ count });
  } catch (error) {
    console.error("Error fetching unread count:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export { getUserNotifications, markAsRead, deleteNotification, getUnreadCount };
