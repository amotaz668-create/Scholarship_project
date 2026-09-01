const express = require("express");

const router = express.Router();

const {
  getMyNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
} = require("../controller/notification.controller");

const {
  validateNotificationId,
} = require("../validators/notification.validator");

const { authenticate } = require("../middlewares/auth.middleware");

// Get My Notifications
router.get("/", authenticate, getMyNotifications);

// Mark All As Read
router.patch("/read-all", authenticate, markAllAsRead);

// Mark One As Read
router.patch("/:id/read", authenticate, validateNotificationId, markAsRead);

// Delete Notification
router.delete("/:id", authenticate, validateNotificationId, deleteNotification);

module.exports = router;
