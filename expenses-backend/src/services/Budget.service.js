const budgetModel = require("../models/Budget.model");
const notificationService = require("./Notification.service");

let budgetService = {};

budgetService.addBudget = async (budgetObj) => {
  try {
    const resObj = await budgetModel.create(budgetObj);

    if (resObj) {
      // Notification
      await notificationService.createNotification(
        resObj.userId,
        "BUDGET_CREATED",
        `New budget created for ${resObj.categoryName}: ₹${resObj.budgetAmount}`,
        resObj._id
      );
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Budget Service addBudget() method Error: ", error);

    throw error;
  }
};

budgetService.fetchBudgets = async (userId, month, year) => {
  try {
    let query = { userId };

    if (year) {
      const targetYear = parseInt(year);
      let startDate, endDate;

      if (month !== undefined && month !== null && month !== "") {
        const targetMonth = parseInt(month); // ensure frontend contract
        startDate = new Date(targetYear, targetMonth, 1);
        endDate = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59, 999);
      } else {
        startDate = new Date(targetYear, 0, 1);
        endDate = new Date(targetYear, 11, 31, 23, 59, 59, 999);
      }

      // ✅ overlap logic
      query.$and = [
        { "period.start": { $lte: endDate } },
        { "period.end": { $gte: startDate } },
      ];
    }

    return await budgetModel.find(query).sort({ createdAt: -1 });
  } catch (error) {
    console.log("Budget Service fetchBudgets() Error:", error);
    throw error;
  }
};

budgetService.fetchBudgetByCategory = async (userId, categoryName) => {
  try {
    const resObj = await budgetModel.find({
      userId: userId,
      categoryName: categoryName,
    });

    if (resObj) {
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Budget Service fetchBudgetByCategory() method Error: ", error);
  }
};

budgetService.updateBudget = async (budgetId, budgetObj) => {
  try {
    const prevBudgetObj = await budgetModel.findOne({ _id: budgetId });

    if (budgetObj.categoryName)
      prevBudgetObj.categoryName = budgetObj.categoryName;

    if (budgetObj.budgetAmount)
      prevBudgetObj.budgetAmount = budgetObj.budgetAmount;

    if (budgetObj.period) prevBudgetObj.period = budgetObj.period;

    if (budgetObj.alertThreshold)
      prevBudgetObj.alertThreshold = budgetObj.alertThreshold;

    const resObj = await prevBudgetObj.save();

    if (resObj) {
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Budget Service updateBudget() method Error: ", error);

    throw error;
  }
};

budgetService.deleteBudget = async (userId, budgetId) => {
  try {
    const budgetObj = await budgetModel.findOne({ _id: budgetId });

    let budgetAmount = 0;

    if (budgetObj) budgetAmount = budgetObj.budgetAmount;

    const resObj = await budgetModel.deleteOne({ _id: budgetId });

    if (resObj.deletedCount > 0) {
      // Notification
      if (budgetObj) {
        await notificationService.createNotification(
          userId,
          "BUDGET_DELETED",
          `Budget for ${budgetObj.categoryName} deleted`,
          budgetId // Note: ID might not exist anymore but we use it as ref
        );
      }
      return { message: "Deletion Successful!" };
    } else {
      return null;
    }
  } catch (error) {
    console.log("Budget Service deleteBudget() method Error: ", error);

    throw error;
  }
};

module.exports = budgetService;
