const express = require("express");

const goalController = require("../controllers/Goal.controller");

const { verifyToken } = require("../utilities/verifyUser");

const goalRouter = express.Router();

goalRouter.post("/", verifyToken, goalController.addGoal);

goalRouter.get("/", verifyToken, goalController.fetchGoalsByUserId);

goalRouter.get(
  "/status/:status",
  verifyToken,
  goalController.fetchGoalsByStatus
);

goalRouter.patch("/add-funds/:goalId", verifyToken, goalController.addFunds);

goalRouter.patch("/:goalId", verifyToken, goalController.updateGoal);

goalRouter.delete("/:goalId", verifyToken, goalController.deleteGoal);

module.exports = goalRouter;
