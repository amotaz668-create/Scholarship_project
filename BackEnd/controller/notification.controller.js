const notificationService = require("../services/notification.service");

// Get My Notifications
const getMyNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(
      req.user.id,
    );

    res.status(200).json({
      success: true,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark Notification As Read
const markAsRead = async (req, res) => {
  try {
    const notification = await notificationService.markNotificationAsRead(
      req.params.id,
      req.user.id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Mark All As Read
const markAllAsRead = async (req, res) => {
  try {
    await notificationService.markAllNotificationsAsRead(req.user.id);

    res.status(200).json({
      success: true,
      message: "All notifications marked as read",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete Notification
const deleteNotification = async (req, res) => {
  try {
    const notification = await notificationService.deleteUserNotification(
      req.params.id,
      req.user.id,
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
};
