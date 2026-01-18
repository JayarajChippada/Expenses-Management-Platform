const mongoose = require("mongoose");

const userService = require("../services/User.service");

const Validator = require("../utilities/validator");

const User = require("../models/classes/User");

let userController = {};

userController.updateUser = async (req, res, next) => {
  const { fullName, email } = req.body;

  try {
    const userId = req.user.userId;

    if (req.body.fullName) Validator.validateName(fullName);

    if (req.body.email) Validator.validateEmail(email);

    const userObj = new User(req.body);

    const resObj = await userService.updateUser(userId, userObj);

    if (resObj !== null) {
      res
        .status(200)
        .json({
          success: true,
          message: "User updated successfully",
          data: resObj,
        });
    } else {
      let error = new Error("User updation Failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("User Controller updateUser() method Error: ", error);

    next(error);
  }
};

userController.getUser = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const resObj = await userService.getUser(userId);

    if (resObj !== null) {
      res.status(200).json({ success: true, data: resObj });
    } else {
      let error = new Error("User details not found!");

      error.status = 404;

      throw error;
    }
  } catch (error) {
    console.log("User Controller getUser() method Error: ", error);

    next(error);
  }
};

userController.signOut = async (req, res, next) => {
  try {
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User has been signed out!" });
  } catch (error) {
    console.log("User Controller signOut() method Error: ", error);

    next(error);
  }
};

module.exports = userController;
