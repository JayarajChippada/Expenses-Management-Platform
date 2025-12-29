const mongoose = require("mongoose");

const crypto = require("crypto");

const Schema = mongoose.Schema;

const userSchema = Schema(
  {
    fullName: {
      required: [true, "Firstname is required"],

      type: String,

      match: [/^[A-Za-z]{3,}$/, ""],
    },

    email: {
      required: [true, "Email is required"],

      type: String,

      unique: [true, ""],

      lowercase: true,

      validate: (value) => {
        const emailRegExp = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        return emailRegExp.test(value);
      },
    },

    password: {
      required: [true, "Password is required"],

      type: String,
    },

    profilePicture: {
      type: String,

      default: "",
    },

    currency: {
      type: String,

      enum: ["INR", "USD", "EUR"],

      default: "INR",
    },

    timeZone: {
      type: String,

      required: true,

      enum: ["Asia/Kolkata", "UTC", "America/New_York", "Europe/London"],

      default: "Asia/Kolkata",
    },

    passwordResetToken: String,

    passwordResetTokenExpiresAt: Date,
  },
  { timestamps: true },
  { collection: "Users" }
);

userSchema.methods.createResetToken = async function () {
  let resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetTokenExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const userModel = mongoose.model("Users", userSchema);

module.exports = userModel;
