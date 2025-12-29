const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const expenseSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Users",

      required: [true, "User Id is required"],
    },

    categoryName: {
      type: String,

      required: [true, "Category is Required"],
    },

    amount: {
      type: Number,

      required: [true, "Amount is required"],

      min: [1, "Amount must be greater than 0"],
    },

    merchant: {
      type: String,

      maxLength: 20, 

      default: "Unknown",
    },

    paymentMethod: {
      type: String,

      enum: ["UPI", "Credit Card", "Cash", "Net Banking", "Debit Card"],

      required: true,
    },

    source: {
      type: String,

      enum: ["MANUAL", "BANK", "SMS", "STATEMENT"],

      default: "MANUAL",
    },

    date: {
      type: Date,

      required: true,

      max: [Date.now(), "Future date not allowed"],
    },

    notes: {
      type: String,

      maxLength: 200,

      default: "",
    },
  },
  { timestamps: true },
  { collection: "Expenses" }
);

const expenseModel = mongoose.model("Expenses", expenseSchema);

module.exports = expenseModel;
