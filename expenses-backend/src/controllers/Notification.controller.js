const notificationService = require("../services/Notification.service");

let notificationController = {};

notificationController.fetchNotifications = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const data = await notificationService.fetchNotifications(userId);
    res.status(200).json({ success: true, data: data });
  } catch (error) {
    console.log(
      "Notification Controller fetchNotifications() method Error: ",
      error
    );
    next(error);
  }
};

notificationController.markAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.notificationId;
    const data = await notificationService.markAsRead(userId, notificationId);
    if (data) {
      res
        .status(200)
        .json({
          success: true,
          message: "Notification marked as read",
          data: data,
        });
    } else {
      let error = new Error("Notification not found");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log("Notification Controller markAsRead() method Error: ", error);
    next(error);
  }
};

notificationController.markAllAsRead = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    await notificationService.markAllAsRead(userId);
    res
      .status(200)
      .json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    console.log(
      "Notification Controller markAllAsRead() method Error: ",
      error
    );
    next(error);
  }
};

notificationController.deleteNotification = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const notificationId = req.params.notificationId;
    const resObj = await notificationService.deleteNotification(
      userId,
      notificationId
    );
    if (resObj.deletedCount > 0) {
      res
        .status(200)
        .json({ success: true, message: "Notification deleted successfully" });
    } else {
      let error = new Error("Notification not found");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(
      "Notification Controller deleteNotification() method Error: ",
      error
    );
    next(error);
  }
};

module.exports = notificationController;
