const expenseModel = require("../models/Expense.model");
const budgetModel = require("../models/Budget.model");
const categoryService = require("./Category.service");
const notificationService = require("./Notification.service");

// Helper to update budget usage with notifications
const updateBudgetUsage = async (
  userId,
  categoryName,
  expenseDate,
  amountChange
) => {
  try {
    const date = new Date(expenseDate);
    // Find active budgets that cover this date and category
    const budgets = await budgetModel.find({
      userId: userId,
      categoryName: categoryName,
      "period.start": { $lte: date },
      "period.end": { $gte: date },
    });

    for (const budget of budgets) {
      const oldAmountSpent = budget.amountSpent;
      budget.amountSpent += amountChange;

      // Notifications only if spending increases
      if (amountChange > 0) {
        // Check Exceeded
        if (
          oldAmountSpent <= budget.budgetAmount &&
          budget.amountSpent > budget.budgetAmount
        ) {
          await notificationService.createNotification(
            userId,
            "BUDGET_EXCEEDED",
            `Budget exceeded for ${categoryName}! Limit: ₹${budget.budgetAmount}`,
            budget._id
          );
        }
        // Check Warning (only if not already exceeded)
        const warningLimit =
          budget.budgetAmount * (budget.alertThreshold / 100);
        if (
          oldAmountSpent < warningLimit &&
          budget.amountSpent >= warningLimit &&
          budget.amountSpent <= budget.budgetAmount
        ) {
          await notificationService.createNotification(
            userId,
            "BUDGET_WARNING",
            `You've used ${budget.alertThreshold}% of your ${categoryName} budget.`,
            budget._id
          );
        }
      }
      await budget.save();
    }
  } catch (error) {
    console.error("Error updating budget usage:", error);
    // Don't throw here, we don't want to fail the expense operation just because budget update failed?
    // Ideally we should transaction, but let's keep it simple as requested.
  }
};

let expenseService = {};

expenseService.addExpense = async (expenseObj) => {
  try {
    const resObj = await expenseModel.create(expenseObj);
    if (resObj) {
      // Update Budget
      await updateBudgetUsage(
        resObj.userId,
        resObj.categoryName,
        resObj.date,
        resObj.amount
      );
      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Expense Service addExpense() method Error: ", error);

    throw error;
  }
};

expenseService.fetchExpensesByUserId = async (userId, page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;
    const expenses = await expenseModel
      .find({ userId: userId })
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const total = await expenseModel.countDocuments({ userId: userId });

    return {
      expenses: expenses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total: total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(
      "Expense Service fetchExpensesByUserId() method Error: ",
      error
    );

    throw error;
  }
};

expenseService.fetchExpensesByCategory = async (
  userId,
  categoryName,
  page = 1,
  limit = 10
) => {
  try {
    const expenses = await expenseModel
      .find({ userId: userId, categoryName: categoryName })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await expenseModel.countDocuments({
      userId: userId,
      categoryName: categoryName,
    });

    return {
      expenses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(
      "Expense Service fetchExpensesByCategory() method Error: ",
      error
    );
    throw error;
  }
};

expenseService.fetchExpensesByDate = async (
  userId,
  startDate,
  endDate,
  page = 1,
  limit = 10
) => {
  try {
    const expenses = await expenseModel
      .find({ userId: userId, date: { $gte: startDate, $lte: endDate } })
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await expenseModel.countDocuments({
      userId: userId,
      date: { $gte: startDate, $lte: endDate },
    });

    return {
      expenses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log("Expense Service fetchExpensesByDate() method Error: ", error);
    throw error;
  }
};

expenseService.fetchExpensesBySearch = async (
  userId,
  search,
  page = 1,
  limit = 10
) => {
  try {
    const orConditions = [];
    orConditions.push({ merchant: { $regex: search, $options: "i" } });
    orConditions.push({ categoryName: { $regex: search, $options: "i" } });
    orConditions.push({ paymentMethod: { $regex: search, $options: "i" } });

    if (!isNaN(search)) {
      orConditions.push({ amount: Number(search) });
    }

    const query = { userId: userId, $or: orConditions };

    const expenses = await expenseModel
      .find(query)
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const total = await expenseModel.countDocuments(query);

    return {
      expenses,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.log(
      "Expense Service fetchExpensesBySearch() method Error: ",
      error
    );
    throw error;
  }
};

expenseService.updateExpense = async (expenseId, expenseObj) => {
  try {
    const prevExpenseObj = await expenseModel.findOne({ _id: expenseId });

    // Store old values for budget adjustment
    const oldCategory = prevExpenseObj.categoryName;
    const oldAmount = prevExpenseObj.amount;
    const oldDate = prevExpenseObj.date;

    if (expenseObj.categoryName)
      prevExpenseObj.categoryName = expenseObj.categoryName;

    if (expenseObj.amount) prevExpenseObj.amount = expenseObj.amount;

    if (expenseObj.merchant) prevExpenseObj.merchant = expenseObj.merchant;

    if (expenseObj.paymentMethod)
      prevExpenseObj.paymentMethod = expenseObj.paymentMethod;

    if (expenseObj.date) prevExpenseObj.date = expenseObj.date;

    if (expenseObj.notes) prevExpenseObj.notes = expenseObj.notes;

    const resObj = await prevExpenseObj.save();

    if (resObj) {
      // Revert old budget usage
      await updateBudgetUsage(resObj.userId, oldCategory, oldDate, -oldAmount);

      // Apply new budget usage
      await updateBudgetUsage(
        resObj.userId,
        resObj.categoryName,
        resObj.date,
        resObj.amount
      );

      return resObj;
    } else {
      return null;
    }
  } catch (error) {
    console.log("Expense Service updateExpense() method Error: ", error);

    throw error;
  }
};

expenseService.deleteExpense = async (userId, expenseId) => {
  try {
    const expenseObj = await expenseModel.findOne({ _id: expenseId });

    const amount = expenseObj.amount;
    const categoryName = expenseObj.categoryName;
    const date = expenseObj.date;

    const resObj = await expenseModel.deleteOne({ _id: expenseId });

    if (resObj.deletedCount > 0) {
      // Decrease budget usage
      await updateBudgetUsage(userId, categoryName, date, -amount);

      return { message: "Deletion Successful!" };
    } else {
      return null;
    }
  } catch (error) {
    console.log("Expense Service deleteExpense() method Error: ", error);

    throw error;
  }
};

expenseService.importExpenses = async (userId, expenses) => {
  try {
    const importedExpenses = [];

    for (const exp of expenses) {
      if (!exp.categoryName || !exp.amount || !exp.date) continue;

      // 1. Check/Create Category
      let category = await categoryService.fetchCategory(
        userId,
        exp.categoryName,
        "expense"
      );

      if (!category) {
        // Create new category
        const newCatObj = {
          userId,
          categoryName: exp.categoryName,
          type: "expense",
          color: "#6b7280", // default color
          icon: "bi-tag-fill", // default icon
        };
        // We bypass addCategory check because we just checked fetchCategory returns null
        // But categoryService.addCategory throws if exists?
        // Let's rely on addCategory's internal check or try/catch just in case of race condition
        try {
          await categoryService.addCategory(newCatObj);
        } catch (e) {
          // Ignore if already exists (race condition)
        }
      }

      // 2. Create Expense
      const expenseObj = {
        userId,
        categoryName: exp.categoryName,
        amount: exp.amount,
        description: exp.description || "Imported Expense",
        date: exp.date,
        merchant: exp.merchant || "",
        paymentMethod: exp.paymentMethod || "Cash",
        notes: exp.notes || "",
      };

      const newExpense = await expenseModel.create(expenseObj);
      importedExpenses.push(newExpense);

      // 3. Update Budget
      await updateBudgetUsage(
        userId,
        newExpense.categoryName,
        newExpense.date,
        newExpense.amount
      );
    }
    return importedExpenses;
  } catch (error) {
    console.log("Expense Service importExpenses() method Error: ", error);
    throw error;
  }
};

expenseService.fetchAllExpensesByUserId = async (userId) => {
  try {
    const expenses = await expenseModel
      .find({ userId: userId })
      .sort({ date: -1 });

    return expenses;
  } catch (error) {
    console.log(
      "Expense Service fetchAllExpensesByUserId() method Error: ",
      error
    );
    throw error;
  }
};

module.exports = expenseService;
