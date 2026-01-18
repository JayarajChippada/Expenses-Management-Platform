const userModel = require("../models/User.model");

const bcryptjs = require("bcryptjs");

const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");

const sendMail = require("../utilities/sendMail");

const crypto = require("crypto");

const Config = require("../config/Configs");

let authService = {};

authService.signUp = async (userObj) => {
  try {
    const existingUser = await userModel.findOne({ email: userObj.email });

    if (existingUser) {
      let error = new Error("User with Email address already exists!");

      error.status = 400;

      throw error;
    }

    const salt = await bcryptjs.genSalt(10);

    const hashedPassword = await bcryptjs.hash(userObj.password, salt);

    userObj.password = hashedPassword;

    const resObj = await userModel.create(userObj);

    if (resObj) {
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Auth Service signUp() method Error: ", error);

    throw error;
  }
};

authService.signIn = async (userObj) => {
  try {
    const user = await userModel.findOne({ email: userObj.email });

    if (!user) {
      let error = new Error("Invalid email or password");

      error.status = 400;

      throw error;
    }

    const isMatch = await bcryptjs.compare(userObj.password, user.password);

    if (!isMatch) {
      let error = new Error("Invalid email or password");

      error.status = 400;

      throw error;
    }

    const token = jwt.sign(
      { userId: user._id },

      Config.JWT_TOKEN,

      { expiresIn: "7d" }
    );

    const {
      password,
      passwordResetToken,
      passwordResetTokenExpiresAt,
      ...userData
    } = user._doc;

    const resObj = {
      userData: userData,

      token: token,
    };

    return resObj;
  } catch (error) {
    console.log("Auth Service signIn() method Error: ", error);

    throw error;
  }
};

authService.forgotPassword = async (email) => {
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      let error = new Error("User not found");

      error.status = 400;

      throw error;
    } 

    const resetToken = await user.createResetToken();

    await user.save();

    // send mail

    // const resetUrl = `${req.protocol}://${req.get("host")}/api/v1/auth/reset-password/${resetToken}`

    const resetUrl = `http://localhost:3000/api/v1/auth/reset-password/${resetToken}`;

    const message = `This mail contains passwort reset link. This is valid for a time of only 10 minutes only\n\n${resetUrl}`;

    /*

        sendMail(

            {

                email: email,

                subject: "Password Reset Request:",

                message: message

            }

        ).catch(async (err) => {

            user.passwordResetToken = undefined

            user.passwordResetTokenExpiresAt = undefined

            await user.save()


 

            let error = new Error("Send Mail failed!")

            error.status = 500

            throw error

        })

*/

    return resetUrl;
  } catch (error) {
    console.log("Auth Service forgotPassword() method Error: ", error);

    throw error;
  }
};

authService.resetPassword = async (email, password, resetToken) => {
  try {
    const user = await userModel.findOne({ email: email });

    if (!user) {
      let error = new Error("User not found");

      error.status = 404;

      throw error;
    }

    const newResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    if (!newResetToken === user.passwordResetToken) {
      let error = new Error("Fake token sent by you");

      error.status = 400;

      throw error;
    }

    if (new Date() > user.passwordResetTokenExpiresAt) {
      let error = new Error("Password reset expired");

      error.status = 400;

      throw error;
    } else {
      let salt = await bcryptjs.genSalt(10);

      user.password = await bcryptjs.hash(password, salt);

      user.passwordResetToken = undefined;

      user.passwordResetTokenExpiresAt = undefined;

      await user.save();

      return user;
    }
  } catch (error) {
    console.log("Auth Service resetPassword() method Error: ", error);

    throw error;
  }
};

authService.changePassword = async (userId, oldPassword, newPassword) => {
  try {
    const user = await userModel.findById(userId);

    if (!user) {
      let error = new Error("User not found");
      error.status = 404;
      throw error;
    }

    const isMatch = await bcryptjs.compare(oldPassword, user.password);

    if (!isMatch) {
      let error = new Error("Invalid old password");
      error.status = 400;
      throw error;
    }

    const salt = await bcryptjs.genSalt(10);
    user.password = await bcryptjs.hash(newPassword, salt);

    await user.save();

    return { success: true };
  } catch (error) {
    console.log("Auth Service changePassword() method Error: ", error);
    throw error;
  }
};

module.exports = authService;
