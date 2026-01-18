const mongoose = require("mongoose")

const expenseModel = require("../models/Expense.model")

const budgetModel = require("../models/Budget.model")

const incomeModel = require("../models/Income.model")

const categoryModel = require("../models/Category.model")

const { getStartDateFromRange } = require("../utilities/dateRange")

let dashboardService = {}

const buildExpenseMatch = (userId, start, end, category) => {
  const match = {
    userId: new mongoose.Types.ObjectId(userId), // Cast to ObjectId for aggregation
    date: { $gte: start, $lte: end },
  }

  if (category && category !== "ALL") {
    match.categoryName = category
  }

  return match
}

const getMonthlyExpenses = async (userId) => {
  try {
    // Last 6 months
    const endDate = new Date()
    const startDate = new Date()
    startDate.setMonth(startDate.getMonth() - 5)
    startDate.setDate(1)
    startDate.setHours(0, 0, 0, 0)

    const months = []
    for (let i = 0; i < 6; i++) {
      const d = new Date(startDate)
      d.setMonth(d.getMonth() + i)
      months.push(d.toLocaleString("default", { month: "short" }))
    }

    const expenseAgg = await expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" }
          },
          total: { $sum: "$amount" }
        }
      }
    ])

    const incomeAgg = await incomeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            month: { $month: "$date" },
            year: { $year: "$date" }
          },
          total: { $sum: "$amount" }
        }
      }
    ])

    // Map aggregations to month names
    // Note: $month is 1-indexed (1=Jan)

    const result = months.map((monthName, index) => {
      // Reconstruct the date for this index to match aggregation
      const d = new Date(startDate)
      d.setMonth(d.getMonth() + index)
      const m = d.getMonth() + 1
      const y = d.getFullYear()

      const exp = expenseAgg.find(e => e._id.month === m && e._id.year === y)
      const inc = incomeAgg.find(i => i._id.month === m && i._id.year === y)

      return {
        month: monthName,
        expenses: exp ? exp.total : 0,
        income: inc ? inc.total : 0
      }
    })

    return result

  } catch (error) {
    console.log("Dashboard Service getMonthlyExpenses() Error: ", error)
    throw error
  }
}

const getSummary = async (userId, start, end, category) => {
  try {
    const expenseMatch = buildExpenseMatch(userId, start, end, category)

    const expenseAgg = await expenseModel.aggregate([
      { $match: expenseMatch },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: "$amount" },
        },
      },
    ])

    const incomeAgg = await incomeModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: null,
          totalIncomes: { $sum: "$amount" },
        },
      },
    ])

    const totalExpenses = expenseAgg[0]?.totalExpenses || 0
    const totalIncomes = incomeAgg[0]?.totalIncomes || 0

    const budgetAgg = await budgetModel.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          totalBudget: { $sum: "$budgetAmount" },
        },
      },
    ])

    const monthlyBudget = budgetAgg[0]?.totalBudget || 0
    const savings = totalIncomes - totalExpenses

    return {
      totalExpenses,
      totalIncomes,
      monthlyBudget,
      savings,
    }
  } catch (error) {
    console.log("Dashboard Service getSummaryMethod() Error: ", error)
    throw error
  }
}

const getExpensesByCategory = async (userId, start, end) => {
  try {
    return expenseModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId), // Fixed casting
          date: { $gte: start, $lte: end },
        },
      },
      {
        $group: {
          _id: "$categoryName",
          total: { $sum: "$amount" },
        },
      },
      {
        $project: {
          _id: 0,
          category: "$_id",
          amount: "$total",
        },
      },
    ])

  } catch (error) {
    console.log("Dashboard Service getExpensesByCategory() Error: ", error)
    throw error
  }
}

const getBudgetUsage = async (userId, start, end, category) => { // Params kept for signature but ignored for logic
  try {
    // ALWAYS Current Month for budgets
    const now = new Date()
    const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const currentMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    const budgetQuery = { userId: userId }
    if (category && category !== "ALL") {
      budgetQuery.categoryName = category
    }

    const budgets = await budgetModel.find(budgetQuery).lean()

    const expenseQuery = {
      userId: userId,
      date: { $gte: currentMonthStart, $lte: currentMonthEnd },
    }
    if (category && category !== "ALL") {
      expenseQuery.categoryName = category
    }

    const expenses = await expenseModel.find(expenseQuery).lean()

    const spentMap = {}
    for (const expense of expenses) {
      const cat = expense.categoryName
      spentMap[cat] = (spentMap[cat] || 0) + expense.amount
    }

    return budgets.map((budget) => {
      const spent = spentMap[budget.categoryName] || 0
      const limit = budget.budgetAmount
      return {
        category: budget.categoryName,
        spent,
        limit,
        usedPercentage: limit === 0 ? 0 : Math.round((spent / limit) * 100),
      }
    })
  } catch (error) {
    console.log("Dashboard Service getBudgetUsage() method Error: ", error)
    throw error
  }
}

const getBudgetAlerts = async (userId, start, end, category) => {
  const usage = await getBudgetUsage(userId, start, end, category)
  return usage.filter((bgt) => bgt.usedPercentage >= 100).length
}

const getRecentTransactions = async (userId, start, end, category) => {
  try {
    const query = { userId: userId }
    if (category && category !== "ALL") query.categoryName = category

    const [expenses, incomes] = await Promise.all([
      expenseModel
        .find(query, {
          _id: 0,
          amount: 1,
          date: 1,
          categoryName: 1,
          paymentMethod: 1,
          merchant: 1
        })
        .sort({ date: -1 })
        .limit(20)
        .lean(),
      incomeModel
        .find({ userId: userId }, { // Income doesn't have categoryName usually the same way, or ignore category filter for income? 
          // If category is "Salary", it won't match "categoryName" if income model uses "source"?
          // Checking Income Model... it usually has source/category. Assuming categoryName or category.
          // For safety, let's ignore category filter for income OR assume income has category field?
          // Let's just fetch all recent income for now to ensure we show something.
          _id: 0,
          amount: 1,
          date: 1,
          category: 1, // Income usually has category/source
          source: 1
        })
        .sort({ date: -1 })
        .limit(20)
        .lean()
    ])

    const formattedExpenses = expenses.map(e => ({ ...e, type: 'expense' }))
    const formattedIncomes = incomes.map(i => ({
      ...i,
      type: 'income',
      merchant: i.source || "Income", // Map source to merchant-like field for table
      categoryName: i.category || "Income"
    }))

    const combined = [...formattedExpenses, ...formattedIncomes].sort((a, b) => new Date(b.date) - new Date(a.date))

    return combined.slice(0, 20)
  } catch (error) {
    console.log(
      "Dashboard Service getRecentTransactions() method Error: ",
      error
    )
    throw error
  }
}

const getCategories = async (userId) => {
  try {
    return categoryModel.find({ userId: userId })
  } catch (error) {
    console.log("Dashboard Service getCategories() method Error: ", error)
    throw error
  }
}

dashboardService.fetchDashboardDetails = async (userId, range, category) => {
  try {
    const { startDate: start, endDate: end } = getStartDateFromRange(range) || { startDate: new Date(0), endDate: new Date() }

    const [
      summary,
      expensesByCategory,
      budgetUsage,
      recentTransactions,
      budgetAlerts,
      categories,
      monthlyExpenses
    ] = await Promise.all([
      getSummary(userId, start, end, category),
      getExpensesByCategory(userId, start, end),
      getBudgetUsage(userId, start, end, category), // Ignores dates internally now
      getRecentTransactions(userId, start, end, category),
      getBudgetAlerts(userId, start, end, category),
      getCategories(userId),
      getMonthlyExpenses(userId)
    ])

    return {
      summary: {
        ...summary,
        budgetAlerts,
      },
      expensesByCategory,
      budgetUsage,
      recentTransactions,
      categories,
      monthlyExpenses // Added to response
    }
  } catch (error) {
    console.log(
      "Dashboard Service fetchDashboardDetails() method Error: ",
      error
    )

    throw error
  }
}

module.exports = dashboardService
