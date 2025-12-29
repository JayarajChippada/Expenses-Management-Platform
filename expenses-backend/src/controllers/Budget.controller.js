const budgetService = require("../services/Budget.service");

const Budget = require("../models/classes/Budget");

const Validator = require("../utilities/validator");

let budgetController = {};

budgetController.addBudget = async (req, res, next) => {
  const {
    categoryName,

    budgetAmount,

    period,
  } = req.body;

  try {
    const userId = req.user.userId;

    // Implement Validations

    if (
      !categoryName ||
      !budgetAmount ||
      !period ||
      categoryName === "" ||
      budgetAmount === ""
    ) {
      let error = new Error("All fields are required");

      error.status = 400;

      throw error;
    }

    await Validator.validateCategory(userId, categoryName, "expense");

    const start = new Date(period.start);

    if (period.frequency === "Weekly") {
      period.end = new Date(start);
      period.end.setDate(start.getDate() + 7);
    }

    if (period.frequency === "Monthly") {
      period.end = new Date(start);
      period.end.setMonth(start.getMonth() + 1);
    }

    if (period.frequency === "Yearly") {
      period.end = new Date(start);
      period.end.setFullYear(start.getFullYear() + 1);
    }

    req.body.period = period;

    const budgetObj = new Budget({ userId: userId, ...req.body });

    const resObj = await budgetService.addBudget(budgetObj);

    if (resObj !== null) {
      res
        .status(201)
        .json({ success: true, message: "Budget set Successfully", data: resObj });
    } else {
      let error = new Error("Adding Budget failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Budget Controller addBudget() method Error: ", error);

    next(error);
  }
};

budgetController.fetchBudgets = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { month, year } = req.query;

    const budgets = await budgetService.fetchBudgets(userId, month, year);

    if (budgets !== null) {
      res.status(200).json({ success: true, data: budgets });
    } else {
      let error = new Error("No Budgets found!");

      error.status = 400;

      throw error;
    }
  } catch (error) {
    console.log("Budget Controller fetchBudgets() method Error: ", error);

    next(error);
  }
};

budgetController.fetchBudgetByCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const categoryName = req.params.categoryName;

    if (!categoryName || categoryName === "") {
      let error = new Error("Category is required");

      error.status = 400;

      throw error;
    }

    await Validator.validateCategory(userId, categoryName, "expense");

    const resObj = await budgetService.fetchBudgetByCategory(
      userId,
      categoryName
    );

    if (resObj !== null) {
      res.status(200).json({ success: true, data: resObj });
    } else {
      let error = new Error("No Budget found!");

      error.status = 400;

      throw error;
    }
  } catch (error) {
    console.log(
      "Budget Controller fetchBudgetByCategory() method Error: ",
      error
    );

    next(error);
  }
};

budgetController.updateBudget = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const budgetId = req.params.budgetId;
    if (req.body.categoryName)
      await Validator.validateCategory(userId, req.body.categoryName, "expense");

    const start = new Date(req.body.period.start);

    if (req.body.period.frequency === "Weekly") {
      req.body.period.end = new Date(start);
      req.body.period.end.setDate(start.getDate() + 7);
    }

    if (req.body.period.frequency === "Monthly") {
      req.body.period.end = new Date(start);
      req.body.period.end.setMonth(start.getMonth() + 1);
    }

    if (req.body.period.frequency === "Yearly") {
      req.body.period.end = new Date(start);
      req.body.period.end.setFullYear(start.getFullYear() + 1);
    }

    const budgetObj = new Budget({ userId: userId, ...req.body });

    const resObj = await budgetService.updateBudget(budgetId, budgetObj);

    if (resObj !== null) {
      res.status(200).json({
        success: true,
        message: "Budget Updated Successfully",

        data: resObj,
      });
    } else {
      let error = new Error("Updation of Budget is failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Budget Controller updateBudget() method Error: ", error);

    next(error);
  }
};

budgetController.deleteBudget = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const budgetId = req.params.budgetId;

    const resObj = await budgetService.deleteBudget(userId, budgetId);

    if (resObj !== null) {
      res.status(200).json({ success: true, message: resObj.message });
    } else {
      let error = new Error("Budget deletion failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Budget Controller deleteBudget() method Error: ", error);

    next(error);
  }
};

module.exports = budgetController;
