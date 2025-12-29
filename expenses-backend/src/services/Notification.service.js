const notificationModel = require("../models/Notification.model");

let notificationService = {};

notificationService.createNotification = async (userId, title, message, referenceId) => {
    try {
        const newNotification = await notificationModel.create({
            userId,
            title,
            message,
            referenceId,
            date: new Date(),
            isRead: false
        });
        return newNotification;
    } catch (error) {
        console.log("Notification Service createNotification() method Error: ", error);
        // We generally don't want to crash the main flow if notification fails, but logging is important
        // throw error; 
    }
};

notificationService.fetchNotifications = async (userId) => {
    try {
        const notifications = await notificationModel
            .find({ userId: userId })
            .sort({ createdAt: -1 });
        return notifications;
    } catch (error) {
        console.log("Notification Service fetchNotifications() method Error: ", error);
        throw error;
    }
};

notificationService.markAsRead = async (userId, notificationId) => {
    try {
        const resObj = await notificationModel.findOneAndUpdate(
            { _id: notificationId, userId: userId },
            { $set: { isRead: true } },
            { new: true }
        );
        return resObj;
    } catch (error) {
        console.log("Notification Service markAsRead() method Error: ", error);
        throw error;
    }
};

notificationService.markAllAsRead = async (userId) => {
    try {
        const resObj = await notificationModel.updateMany(
            { userId: userId, isRead: false },
            { $set: { isRead: true } }
        );
        return resObj;
    } catch (error) {
        console.log("Notification Service markAllAsRead() method Error: ", error);
        throw error;
    }
};

notificationService.deleteNotification = async (userId, notificationId) => {
    try {
        const resObj = await notificationModel.deleteOne({
            _id: notificationId,
            userId: userId,
        });
        return resObj;
    } catch (error) {
        console.log("Notification Service deleteNotification() method Error: ", error);
        throw error;
    }
};

module.exports = notificationService