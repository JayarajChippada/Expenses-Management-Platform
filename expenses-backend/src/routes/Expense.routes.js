const express = require("express");

const expenseController = require("../controllers/Expense.controller");

const { verifyToken } = require("../utilities/verifyUser");

const expenseRouter = express.Router();

expenseRouter.post("/", verifyToken, expenseController.addExpense);

expenseRouter.post("/import", verifyToken, expenseController.importExpenses);

expenseRouter.get("/", verifyToken, expenseController.fetchExpensesByUserId);

expenseRouter.get(
  "/category/:categoryName",
  verifyToken,
  expenseController.fetchExpensesByCategory
);

expenseRouter.get("/date", verifyToken, expenseController.fetchExpensesByDate);

expenseRouter.get(
  "/search",
  verifyToken,
  expenseController.fetchExpensesBySearch
);

expenseRouter.patch(
  "/:expenseId",
  verifyToken,
  expenseController.updateExpense
);

expenseRouter.delete(
  "/:expenseId",
  verifyToken,
  expenseController.deleteExpense
);

module.exports = expenseRouter;
