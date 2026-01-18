const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const notificationSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Users",

      required: [true, ""],
    },

    title: {
      type: String,
      required: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,

      required: true,
    },

    message: {
      type: String,

      required: true,

      maxLength: 200,
    },

    date: {
      type: Date,

      required: true,
    },

    isRead: {
      type: Boolean,

      default: false,
    },
  },
  { timestamps: true, collection: "Notifications" }
);

const notificationModel = mongoose.model("Notifications", notificationSchema);

module.exports = notificationModel;
