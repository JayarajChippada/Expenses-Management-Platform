const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const goalSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Users",

      required: [true, ""],
    },

    categoryName: {
      type: String,

      default: "CUSTOM",
    },

    title: {
      type: String,

      required: true,

      maxLength: 50,
    },

    description: {
      type: String,

      maxLength: 200,
    },

    targetAmount: {
      type: Number,

      required: true,

      min: [1, "Amount must be greater than 0"],
    },

    currentAmount: {
      type: Number,

      required: true,

      min: [1, "Amount must be greater than 0"],
    },

    targetDate: {
      type: Date,

      required: true,
    },

    status: {
      type: String,

      enum: ["active", "completed", "paused"],

      default: "active",
    },

    priority: {
      type: String,

      enum: ["high", "medium", "low"],

      default: "medium",
    },
  },
  { timestamps: true, collection: "Goals" }
);

const goalModel = mongoose.model("Goals", goalSchema);

module.exports = goalModel;
