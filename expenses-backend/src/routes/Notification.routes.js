const express = require("express");

const notificationController = require("../controllers/Notification.controller");

const notificationRouter = express.Router();

const { verifyToken } = require("../utilities/verifyUser");

notificationRouter.get(
  "/",
  verifyToken,
  notificationController.fetchNotifications
);
notificationRouter.put(
  "/read-all",
  verifyToken,
  notificationController.markAllAsRead
);
notificationRouter.put(
  "/:notificationId/read",
  verifyToken,
  notificationController.markAsRead
);
notificationRouter.delete(
  "/:notificationId",
  verifyToken,
  notificationController.deleteNotification
);

module.exports = notificationRouter;
