const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const incomeSchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: [true, "User Id is required"],
    },
    source: {
      type: String,
      required: [true, "Source is Required"],
      maxLength: 50,
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
    paymentMethod: {
      type: String,
      enum: ["UPI",  "Cash", "Net Banking", "Cheque", "Bank Transfer"],
      required: true,
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
  { collection: "Incomes" }
);

const incomeModel = mongoose.model("Incomes", incomeSchema);

module.exports = incomeModel;
