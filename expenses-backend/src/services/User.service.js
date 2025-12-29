const userModel = require("../models/User.model");

const mongoose = require("mongoose");

let userService = {};

userService.getUser = async (userId) => {
  try {
    const userObj = await userModel.findOne({ _id: userId }, { password: 0 });

    if (userObj) {
      return userObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("User Service getUser() method Error: ", error);

    throw error;
  }
};

userService.updateUser = async (userId, userObj) => {
  try {
    const userDetails = await userModel.findOne({ _id: userId });

    if (userObj.fullName) userDetails.fullName = userObj.fullName;

    if (userObj.email) userDetails.email = userObj.email;

    if (userObj.password) userDetails.password = userObj.password;

    if (userObj.profilePicture || userObj.profilePicture === "")
      userDetails.profilePicture = userObj.profilePicture;

    if (userObj.currency) userDetails.currency = userObj.currency;

    if (userObj.timeZone) userDetails.timeZone = userObj.timeZone;

    const resObj = await userDetails.save();

    if (resObj) {
      return { message: "User details updated Successfully!" };
    } else {
      return null;
    }
  } catch (error) {
    console.log("User Service updateUser() method Error: ", error);

    throw error;
  }
};

module.exports = userService;
