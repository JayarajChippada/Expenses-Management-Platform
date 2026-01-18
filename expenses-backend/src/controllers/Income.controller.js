const incomeService = require("../services/Income.service");
const Income = require("../models/classes/Income");
const Validator = require("../utilities/validator");

let incomeController = {};

incomeController.addIncome = async (req, res, next) => {
  const { source, categoryName, amount, paymentMethod, date } = req.body;

  try {
    const userId = req.user.userId;

    if (!source || !categoryName || !amount || !paymentMethod || !date) {
      let error = new Error("All fields are required");
      error.status = 400;
      throw error;
    }
    if (new Date(date) > Date.now()) {
      let error = new Error("Future Date now allowed");
      error.status = 400;
      throw error;
    }

    const incomeObj = new Income({ userId: userId, ...req.body });
    const resObj = await incomeService.addIncome(incomeObj);

    if (resObj) {
      res.status(201).json({
        success: true,
        message: "Income Added Successfully",
        data: resObj,
      });
    } else {
      let error = new Error("Adding Income failed!");
      error.status = 500;
      throw error;
    }
  } catch (error) {
    console.log("Income Controller addIncome() method Error: ", error);
    next(error);
  }
};

incomeController.fetchIncomesByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { page = 1, limit = 10 } = req.query;

    const data = await incomeService.fetchIncomesByUserId(userId, page, limit);

    if (data) {
      res.status(200).json({
        success: true,
        data: data.incomes,
        pagination: data.pagination,
      });
    } else {
      let error = new Error("No Income entries found!");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(
      "Income Controller fetchIncomesByUserId() method Error: ",
      error
    );
    next(error);
  }
};

incomeController.updateIncome = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const incomeId = req.params.incomeId;
    const { date } = req.body;
    if (date && new Date(date) > Date.now()) {
      let error = new Error("Future Date now allowed");
      error.status = 400;
      throw error;
    }
    const incomeObj = { ...req.body, userId };
    const resObj = await incomeService.updateIncome(incomeId, incomeObj);

    if (resObj) {
      res.status(200).json({
        success: true,
        message: "Income Updated Successfully",
        data: resObj,
      });
    } else {
      let error = new Error("Income update failed!");
      error.status = 500;
      throw error;
    }
  } catch (error) {
    console.log("Income Controller updateIncome() method Error: ", error);
    next(error);
  }
};

incomeController.deleteIncome = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const incomeId = req.params.incomeId;

    const resObj = await incomeService.deleteIncome(userId, incomeId);

    if (resObj) {
      res.status(200).json({
        success: true,
        message: resObj.message,
      });
    } else {
      let error = new Error("Income deletion failed!");
      error.status = 500;
      throw error;
    }
  } catch (error) {
    console.log("Income Controller deleteIncome() method Error: ", error);
    next(error);
  }
};

incomeController.fetchIncomesByCategory = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const categoryName = req.params.categoryName;
    const { page, limit } = req.query;

    const result = await incomeService.fetchIncomesByCategory(
      userId,
      categoryName,
      page,
      limit
    );

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.incomes,
        pagination: result.pagination,
      });
    } else {
      res.status(404).json({ success: false, message: "No incomes found" });
    }
  } catch (error) {
    next(error);
  }
};

const { getStartDateFromRange } = require("../utilities/dateRange");

incomeController.fetchIncomesByDate = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { range, page, limit } = req.query;

    const dateObj = getStartDateFromRange(range);

    if (!dateObj) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid date range" });
    }

    const result = await incomeService.fetchIncomesByDate(
      userId,
      dateObj.startDate,
      dateObj.endDate,
      page,
      limit
    );

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.incomes,
        pagination: result.pagination,
      });
    } else {
      res.status(404).json({ success: false, message: "No incomes found" });
    }
  } catch (error) {
    next(error);
  }
};

incomeController.fetchIncomesBySearch = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { search, page, limit } = req.query;

    const result = await incomeService.fetchIncomesBySearch(
      userId,
      search,
      page,
      limit
    );

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.incomes,
        pagination: result.pagination,
      });
    } else {
      res.status(404).json({ success: false, message: "No incomes found" });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = incomeController;
