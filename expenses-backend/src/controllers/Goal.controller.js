const goalService = require("../services/Goal.service");

const Goal = require("../models/classes/Goal");
const Validator = require("../utilities/validator");

let goalController = {};

goalController.addGoal = async (req, res, next) => {
  const {
    categoryName,

    title,

    targetAmount,

    currentAmount,

    targetDate,
  } = req.body;

  try {
    const userId = req.user.userId;

    if (
      !categoryName ||
      !title ||
      !targetAmount ||
      !currentAmount ||
      !targetDate ||
      categoryName === "" ||
      title === "" ||
      targetAmount === "" ||
      currentAmount === "" ||
      targetDate === ""
    ) {
      let error = new Error("All fields are required");

      error.status = 400;

      throw error;
    }

    await Validator.validateCategory(userId, categoryName, "goal");

    const goalObj = new Goal({ userId: userId, ...req.body });

    const resObj = await goalService.addGoal(goalObj);

    if (resObj !== null) {
      res.status(201).json({
        success: true,
        message: "Financial Goal set Successfully",
        data: resObj,
      });
    } else {
      let error = new Error("Adding Goal failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Goal Controller addGoal() method Error: ", error);

    next(error);
  }
};

goalController.updateGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const goalId = req.params.goalId;

    if (req.body.categoryName) {
      await Validator.validateCategory(userId, req.body.categoryName, "goal");
    }

    const goalObj = new Goal({ userId: userId, ...req.body });

    const resObj = await goalService.updateGoal(goalId, goalObj);

    if (resObj !== null) {
      res.status(200).json({
        success: true,
        message: "Goal Updated Successfully!",

        data: resObj,
      });
    } else {
      let error = new Error("Goal updation failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Goal Controller updateGoal() method Error: ", error);

    next(error);
  }
};

goalController.deleteGoal = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const goalId = req.params.goalId;

    const resObj = await goalService.deleteGoal(userId, goalId);

    if (resObj !== null) {
      res.status(200).json(resObj);
    } else {
      let error = new Error("Goal deletion failed!");

      error.status = 500;

      throw error;
    }
  } catch (error) {
    console.log("Goal Controller deleteGoal() method Error: ", error);

    next(error);
  }
};

goalController.addFunds = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const fundAmount = req.body.fundAmount;

    const goalId = req.params.goalId;

    const resObj = await goalService.addFunds(userId, goalId, fundAmount);

    if (resObj !== null) {
      res.status(200).json({
        success: true,
        message: "Funds added successfully",
        data: resObj,
      });
    } else {
      let error = new Error("Fund Updation Failed!");

      error.status = 400;

      throw error;
    }
  } catch (error) {
    console.log("Goal Controller addFunds() method Error: ", error);

    next(error);
  }
};

goalController.fetchGoalsByUserId = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const goals = await goalService.fetchGoalsByUserId(userId);

    if (goals !== null) {
      res.status(200).json(goals);
    } else {
      let error = new Error("No Goals found!");

      error.status = 400;

      throw error;
    }
  } catch (error) {
    console.log("Goal Controller fetchGoalsByUserId() method Error: ", error);

    next(error);
  }
};

goalController.fetchGoalsByStatus = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const status = req.params.status;

    let goals;
    if (status === "all") {
      goals = await goalService.fetchGoalsByUserId(userId);
    } else {
      goals = await goalService.fetchGoalsByStatus(userId, status);
    }

    if (goals !== null) {
      res.status(200).json(goals);
    } else {
      let error = new Error("No Goals found!");

      error.status = 400;

      throw error;
    }
  } catch (error) {
    console.log("Goal Controller fetchGoalsByStatus() method Error: ", error);

    next(error);
  }
};

module.exports = goalController;
