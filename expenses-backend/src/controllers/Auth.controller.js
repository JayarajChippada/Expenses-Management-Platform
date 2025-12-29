const authService = require("../services/Auth.service");

const User = require("../models/classes/User");

const Validator = require("../utilities/validator");

let authController = {};

authController.signUp = async (req, res, next) => {
  const {
    fullName,

    email,

    password,
  } = req.body;

  try {
    //validate fields

    if (
      !fullName ||
      !email ||
      !password ||
      fullName === "" ||
      email === "" ||
      password === ""
    ) {
      let error = new Error("All fields are required");

      error.status = 400;

      throw error;
    }

    Validator.validateName(fullName);

    Validator.validateEmail(email);

    Validator.validatePassword(password);

    const userObj = new User(req.body);

    const resObj = await authService.signUp(userObj);

    if (resObj !== null) {
      res.status(200).json({ success: true, message: "User registered successfully" });
    } else {
      let error = new Error("User Registration Failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Auth Controller signup() method Error: ", error);

    next(error);
  }
};

authController.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // validate fields

    if (!email || !password || email === "" || password === "") {
      let error = new Error("All fields are required");

      error.status = 400;

      throw error;
    }

    Validator.validateEmail(email);

    const resObj = await authService.signIn(req.body);

    if (resObj !== null) {
      res
        .status(200)

        .cookie("access_token", resObj.token, { httpOnly: true })

        .json({
          success: true,
          token: resObj.token,
          user: resObj.userData,
        });
    } else {
      let error = new Error("Login Failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Auth Controller signIn() method Error: ", error);

    next(error);
  }
};

authController.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;

    if (!email || email === "") {
      let error = new Error("Email is required");

      error.status = 400;

      throw error;
    }

    Validator.validateEmail(email);

    const resetUrl = await authService.forgotPassword(email);

    if (resetUrl !== null) {
      res.status(200).json({ success: true, message: resetUrl });
    } else {
      let error = new Error("Something went wrong! Try again...");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Auth Controller forgotPassword() method Error: ", error);

    next(error);
  }
};

authController.resetPassword = async (req, res, next) => {
  const { email, password } = req.body;

  const resetToken = req.params.token;

  try {
    // validate fields

    if (!email || !password || email === "" || password === "") {
      let error = new Error("All fields are required");

      error.status = 400;

      throw error;
    }

    Validator.validateEmail(email);

    Validator.validatePassword(password);

    const resObj = await authService.resetPassword(email, password, resetToken);

    if (resObj !== null) {
      res
        .status(200)
        .json({ success: true, message: `Password updated successfully for ${resObj.email}` });
    } else {
      let error = new Error("Something went wrong! Try again...");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Auth Controller resetPassword() method Error: ", error);

    next(error);
  }
};

module.exports = authController;
