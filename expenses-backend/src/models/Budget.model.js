const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const periodSchema = Schema(
  {
    frequency: {
      type: String,

      enum: ["Monthly", "Yearly", "Weekly"],

      required: true,
    },

    start: {
      type: Date,

      required: true,
    },

    end: {
      type: Date,

      required: true,
    },
  },
  { _id: false }
);

const budgetSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Users",

      required: [true, "User Id is required"],
    },

    categoryName: {
      type: String,

      required: [true, "Category is required"],
    },

    budgetAmount: {
      type: Number,

      required: [true, "Budget Amount is required"],

      min: [1, "Budget must be greater than 0"],
    },

    amountSpent: {
      type: Number,

      default: 0,
    },

    period: periodSchema,

    alertThreshold: {
      type: Number,

      min: 1,

      max: 100,

      default: 80,
    },

    isActive: {
      type: Boolean,

      default: true,
    },
  },
  { timestamps: true, collection: "Budgets" }
);

const budgetModel = mongoose.model("Budgets", budgetSchema);

module.exports = budgetModel;
