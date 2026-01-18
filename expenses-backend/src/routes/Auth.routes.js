const express = require("express");

const authController = require("../controllers/Auth.controller");
const { verifyToken } = require("../utilities/verifyUser");

const authRouter = express.Router();

authRouter.post("/sign-up", authController.signUp);

authRouter.post("/sign-in", authController.signIn);

authRouter.post("/forgot-password", authController.forgotPassword);

authRouter.patch("/reset-password/:token", authController.resetPassword);

authRouter.patch(
  "/change-password",
  verifyToken,
  authController.changePassword
);

module.exports = authRouter;
