const express = require("express");
const incomeController = require("../controllers/Income.controller");
const { verifyToken } = require("../utilities/verifyUser");

const incomeRouter = express.Router();

incomeRouter.post("/", verifyToken, incomeController.addIncome);
incomeRouter.get("/", verifyToken, incomeController.fetchIncomesByUserId);
incomeRouter.get(
  "/category/:categoryName",
  verifyToken,
  incomeController.fetchIncomesByCategory
);
incomeRouter.get("/date", verifyToken, incomeController.fetchIncomesByDate);
incomeRouter.get("/search", verifyToken, incomeController.fetchIncomesBySearch);
incomeRouter.patch("/:incomeId", verifyToken, incomeController.updateIncome);
incomeRouter.delete("/:incomeId", verifyToken, incomeController.deleteIncome);

module.exports = incomeRouter;
