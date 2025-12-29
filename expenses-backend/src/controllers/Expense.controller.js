const expenseService = require("../services/Expense.service");

const Expense = require("../models/classes/Expense");

const { getStartDateFromRange } = require("../utilities/dateRange");

const Validator = require("../utilities/validator");

let expenseController = {};

expenseController.addExpense = async (req, res, next) => {
  const {
    categoryName,

    amount,

    paymentMethod,

    date,
  } = req.body;

  try {
    const userId = req.user.userId;

    // Implement validations here

    if (
      !categoryName ||
      !amount ||
      !paymentMethod ||
      !date ||
      categoryName === "" ||
      amount === "" ||
      paymentMethod === "" ||
      date === ""
    ) {
      let error = new Error("All fields are required");

      error.status = 400;

      throw error;
    }
    if (date > Date.now()) {
      let error = new Error("Future Date is not allowed");

      error.status = 400;

      throw error;
    }
    await Validator.validateCategory(userId, categoryName, "expense");

    const expenseObj = new Expense({ userId: userId, ...req.body });

    const resObj = await expenseService.addExpense(expenseObj);

    if (resObj !== null) {
      res
        .status(201)
        .json({ success: true, message: "Expense Added Successfully", data: resObj });
    } else {
      let error = new Error("Adding Expenses failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Expense Controller addExpense() method Error: ", error);

    next(error);
  }
};

expenseController.fetchExpensesByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const data = await expenseService.fetchExpensesByUserId(userId, page, limit);

    if (data) {
      res.status(200).json({
        success: true,
        data: data.expenses,
        pagination: data.pagination,
      });
    } else {
      let error = new Error("No Expenses found!");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(
      "Expense Controller fetchExpensesByUserId() method Error: ",
      error
    );

    next(error);
  }
};

expenseController.fetchExpensesByCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const categoryName = req.params.categoryName;

    await Validator.validateCategory(userId, categoryName, "expense");

    const { page, limit } = req.query;

    const result = await expenseService.fetchExpensesByCategory(
      userId,
      categoryName,
      page,
      limit
    );

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: result.pagination
      });
    } else {
      res.status(404).json({ success: false, message: "No Expenses found" });
    }
  } catch (error) {
    console.log(
      "Expense Controller fetchExpensesByCategory() method Error: ",
      error
    );

    next(error);
  }
};

expenseController.fetchExpensesByDate = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { range = "ALL", page, limit } = req.query;

    const dateObj = getStartDateFromRange(range);

    if (!dateObj) {
      return res.status(400).json({ success: false, message: "Invalid date range" });
    }

    const result = await expenseService.fetchExpensesByDate(
      userId,
      dateObj.startDate,
      dateObj.endDate,
      page,
      limit
    );

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: result.pagination
      });
    } else {
      res.status(404).json({ success: false, message: "No Expenses found" });
    }
  } catch (error) {
    console.log(
      "Expense Controller fetchExpensesByDate() method Error: ",
      error
    );

    next(error);
  }
};

expenseController.fetchExpensesBySearch = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const { search, page, limit } = req.query;

    const result = await expenseService.fetchExpensesBySearch(userId, search, page, limit);

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: result.pagination
      });
    } else {
      res.status(404).json({ success: false, message: "No Expenses found" });
    }
  } catch (error) {
    console.log(
      "Expense Controller fetchExpensesBySearch() method Error: ",
      error
    );

    next(error);
  }
};

expenseController.updateExpense = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const expenseId = req.params.expenseId;

    // Implement validations here

    if (req.body.categoryName)
      await Validator.validateCategory(userId, req.body.categoryName);

    if (req.body.date) {
      if (new Date(req.body.date) > Date.now()) {
        let error = new Error("Future Date is not allowed");

        error.status = 400;

        throw error;
      }
    }

    const expenseObj = new Expense({ userId: userId, ...req.body });

    const resObj = await expenseService.updateExpense(expenseId, expenseObj);

    if (resObj !== null) {
      res.status(200).json({
        success: true,
        message: "Expense Updated Successfully",

        data: resObj,
      });
    } else {
      let error = new Error("Expense updation failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Expense Controller updateExpense() method Error: ", error);

    next(error);
  }
};

expenseController.deleteExpense = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const expenseId = req.params.expenseId;

    const resObj = await expenseService.deleteExpense(userId, expenseId);

    if (resObj !== null) {
      res.status(200).json({ success: true, message: resObj.message });
    } else {
      let error = new Error("Expense deletion failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Expense Controller deleteExpense() method Error: ", error);

    next(error);
  }
};

expenseController.importExpenses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { expenses } = req.body;

    if (!expenses || !Array.isArray(expenses) || expenses.length === 0) {
      let error = new Error("No expenses data provided");
      error.status = 400;
      throw error;
    }

    const resObj = await expenseService.importExpenses(userId, expenses);

    if (resObj) {
      res
        .status(200)
        .json({ success: true, message: "Expenses imported successfully", count: resObj.length });
    } else {
      let error = new Error("Import failed!");
      error.status = 500;
      throw error;
    }
  } catch (error) {
    console.log("Expense Controller importExpenses() method Error: ", error);
    next(error);
  }
};

module.exports = expenseController;
