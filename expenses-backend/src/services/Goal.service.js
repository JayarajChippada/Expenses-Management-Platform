const goalModel = require("../models/Goal.model");
const notificationService = require("./Notification.service");

let goalService = {};

goalService.addGoal = async (goalObj) => {
  try {
    if (goalObj.currentAmount >= goalObj.targetAmount) {
      goalObj.status = "completed";
    }

    const resObj = await goalModel.create(goalObj);

    if (resObj) {
      // Notification
      await notificationService.createNotification(
        resObj.userId,
        "GOAL_CREATED",
        `New goal created: ${resObj.title}`,
        resObj._id
      );

      if (resObj.status === "completed") {
        await notificationService.createNotification(
          resObj.userId,
          "GOAL_ACHIEVED",
          `Goal Achieved: ${resObj.title}! 🎉`,
          resObj._id
        );
      }
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Goal Service addGoal() method Error: ", error);

    throw error;
  }
};

goalService.updateGoal = async (goalId, goalObj) => {
  try {
    const prevGoalObj = await goalModel.findOne({ _id: goalId });
    const wasCompleted = prevGoalObj.status === "completed";

    if (goalObj.categoryName) prevGoalObj.categoryName = goalObj.categoryName;

    if (goalObj.title) prevGoalObj.title = goalObj.title;

    if (goalObj.description) prevGoalObj.description = goalObj.description;

    if (goalObj.targetAmount) prevGoalObj.targetAmount = goalObj.targetAmount;

    if (goalObj.currentAmount)
      prevGoalObj.currentAmount = goalObj.currentAmount;

    if (goalObj.targetDate) prevGoalObj.targetDate = goalObj.targetDate;

    if (goalObj.status) prevGoalObj.status = goalObj.status;

    if (goalObj.priority) prevGoalObj.priority = goalObj.priority;

    if (prevGoalObj.currentAmount >= prevGoalObj.targetAmount) {
      prevGoalObj.status = "completed";
    }

    const resObj = await prevGoalObj.save();

    if (resObj) {
      if (!wasCompleted && resObj.status === "completed") {
        await notificationService.createNotification(
          resObj.userId,
          "GOAL_ACHIEVED",
          `Goal Achieved: ${resObj.title}! 🎉`,
          resObj._id
        );
      }
      return resObj;
    }
  } catch (error) {
    console.log("Goal Service updateGoal() method Error: ", error);

    throw error;
  }
};

goalService.deleteGoal = async (userId, goalId) => {
  try {
    const goalObj = await goalModel.findOne({ _id: goalId });
    const resObj = await goalModel.deleteOne({ _id: goalId });

    if (resObj.deletedCount > 0) {
      if (goalObj) {
        await notificationService.createNotification(
          userId,
          "GOAL_DELETED",
          `Goal deleted: ${goalObj.title}`,
          goalId
        );
      }
      return { message: "Deletion Successful!" };
    }
  } catch (error) {
    console.log("Goal Service deleteGoal() method Error: ", error);

    throw error;
  }
};

goalService.addFunds = async (userId, goalId, fundAmount) => {
  try {
    const goal = await goalModel.findOne({ _id: goalId, userId: userId });

    if (!goal) {
      throw new Error("Goal not found");
    }

    const wasCompleted = goal.status === "completed";
    goal.currentAmount += Number(fundAmount);

    if (goal.currentAmount >= goal.targetAmount) {
      goal.status = "completed";
    }

    const updatedGoal = await goal.save();

    if (!wasCompleted && updatedGoal.status === "completed") {
      await notificationService.createNotification(
        userId,
        "GOAL_ACHIEVED",
        `Goal Achieved: ${updatedGoal.title}! 🎉`,
        updatedGoal._id
      );
    }

    return updatedGoal;
  } catch (error) {
    console.log("Goal Service addFunds() method Error: ", error);

    throw error;
  }
};

goalService.fetchGoalsByUserId = async (userId) => {
  try {
    const goals = await goalModel
      .find({ userId: userId })
      .sort({ targetDate: -1 });

    if (goals.length > 0) {
      return goals;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Goal Service fetchGoalsByUserId() method Error: ", error);

    throw error;
  }
};

goalService.fetchGoalsByStatus = async (userId, status) => {
  try {
    const goals = await goalModel
      .find({ userId: userId, status: status })
      .sort({ targetDate: -1 });

    if (goals.length > 0) {
      return goals;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Goal Service fetchGoalsByStatus() method Error: ", error);

    throw error;
  }
};

module.exports = goalService;
