const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categorySchema = Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,

      ref: "Users",

      required: [true, ""],
    },

    categoryName: {
      required: [true, ""],

      type: String,
    },

    color: {
      type: String,

      match: [/^#([0-9A-F]{3}){1,2}$/i, "Invalid Hex Color"],

      default: "#4F46E5",
    },

    icon: {
      type: String,

      default: "",
    },

    keywords: {
      type: [],

      default: [],
    },

    type: {
      type: String,
      enum: ["expense", "income", "goal", "budget"],
      default: "expense",
    },
  },
  { timestamps: true, collection: "Categories" }
);

const categoryModel = mongoose.model("Categories", categorySchema);

module.exports = categoryModel;
