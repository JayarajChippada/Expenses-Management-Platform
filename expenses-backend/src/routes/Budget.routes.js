const express = require("express");

const budgetController = require("../controllers/Budget.controller");

const { verifyToken } = require("../utilities/verifyUser");

const budgetRouter = express.Router();

budgetRouter.post("/", verifyToken, budgetController.addBudget);

budgetRouter.get("/", verifyToken, budgetController.fetchBudgets);

budgetRouter.get(
  "/category/:categoryName",
  verifyToken,
  budgetController.fetchBudgetByCategory
);

budgetRouter.patch("/:budgetId", verifyToken, budgetController.updateBudget);

budgetRouter.delete("/:budgetId", verifyToken, budgetController.deleteBudget);

module.exports = budgetRouter;
