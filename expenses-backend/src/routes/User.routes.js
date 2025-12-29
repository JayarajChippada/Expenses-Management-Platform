const express = require("express");

const userController = require("../controllers/User.controller");

const { verifyToken } = require("../utilities/verifyUser");

const userRouter = express.Router();

userRouter.get("/", verifyToken, userController.getUser);

userRouter.patch("/update/:userId", verifyToken, userController.updateUser);

userRouter.post("/sign-out", verifyToken, userController.signOut);

module.exports = userRouter;
