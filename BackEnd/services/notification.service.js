const Notification = require("../models/Notification");

// Create Notification
const createNotification = async (
  userId,
  title,
  message,
  type,
  relatedId = null,
) => {
  const notification = await Notification.create({
    userId,
    title,
    message,
    type,
    relatedId,
  });

  return notification;
};

// Get User Notifications
const getUserNotifications = async (userId) => {
  const notifications = await Notification.find({
    userId,
  }).sort({
    createdAt: -1,
  });

  return notifications;
};

// Mark One Notification As Read
const markNotificationAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      userId: userId,
    },
    {
      isRead: true,
    },
    {
      new: true,
    },
  );

  return notification;
};

// Mark All Notifications As Read
const markAllNotificationsAsRead = async (userId) => {
  const result = await Notification.updateMany(
    {
      userId: userId,
      isRead: false,
    },
    {
      isRead: true,
    },
  );

  return result;
};

// Delete Notification
const deleteUserNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId: userId,
  });

  return notification;
};

module.exports = {
  createNotification,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteUserNotification,
};
