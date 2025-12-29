const mongoose = require("mongoose");
const expenseModel = require("../models/Expense.model");
const incomeModel = require("../models/Income.model");
const { getStartDateFromRange } = require("../utilities/dateRange");

let reportsService = {};

reportsService.getOverview = async (userId, dateRange) => {
    try {
        const { startDate, endDate } = getStartDateFromRange(dateRange) || { startDate: new Date(0), endDate: new Date() };

        const expenseAgg = await expenseModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                }
            },
            {
                $group: {
                    _id: null,
                    totalExpenses: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const incomeAgg = await incomeModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                }
            },
            {
                $group: {
                    _id: null,
                    totalIncomes: { $sum: "$amount" },
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalExpenses = expenseAgg[0]?.totalExpenses || 0;
        const expenseCount = expenseAgg[0]?.count || 0;
        const totalIncomes = incomeAgg[0]?.totalIncomes || 0;
        const incomeCount = incomeAgg[0]?.count || 0;

        // --- Monthly Data for Area Chart (Group by Month) ---
        const monthlyExpenses = await expenseModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } }, // Group by Year-Month
                    expenses: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        const monthlyIncomes = await incomeModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m", date: "$date" } },
                    income: { $sum: "$amount" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Merge for Chart
        const monthlyDataMap = {};
        monthlyExpenses.forEach(e => {
            monthlyDataMap[e._id] = { month: e._id, expenses: e.expenses, income: 0 };
        });
        monthlyIncomes.forEach(i => {
            if (!monthlyDataMap[i._id]) monthlyDataMap[i._id] = { month: i._id, expenses: 0, income: 0 };
            monthlyDataMap[i._id].income = i.income;
        });
        const monthlyData = Object.values(monthlyDataMap).sort((a, b) => a.month.localeCompare(b.month));

        // --- Category Distribution for Pie Chart ---
        // Fetch categories to get colors
        const Categories = require("../models/Category.model");
        const userCategories = await Categories.find({ userId: userId });
        const colorMap = {};
        userCategories.forEach(c => colorMap[c.categoryName] = c.color);

        const categoryAgg = await expenseModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: "$categoryName",
                    value: { $sum: "$amount" }
                }
            },
            { $sort: { value: -1 } }
        ]);

        const categoryDistribution = categoryAgg.map(c => ({
            name: c._id,
            value: Math.round((c.value / (totalExpenses || 1)) * 100), // Percentage
            color: colorMap[c._id] || "#6366f1"
        }));


        return {
            totalExpenses,
            totalIncomes,
            balance: totalIncomes - totalExpenses,
            expenseCount,
            incomeCount,
            avgExpense: expenseCount > 0 ? Math.round(totalExpenses / expenseCount) : 0,
            avgIncome: incomeCount > 0 ? Math.round(totalIncomes / incomeCount) : 0,
            savingsRate: totalIncomes > 0 ? Math.round(((totalIncomes - totalExpenses) / totalIncomes) * 100) : 0,
            monthlyData,
            categoryDistribution
        };
    } catch (error) {
        console.log("Reports Service getOverview() method Error: ", error);
        throw error;
    }
}

reportsService.getTrends = async (userId, dateRange) => {
    try {
        const { startDate, endDate } = getStartDateFromRange(dateRange) || { startDate: new Date(0), endDate: new Date() };

        // Group expenses by date
        const expenseTrends = await expenseModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    amount: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Group incomes by date
        const incomeTrends = await incomeModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                    amount: { $sum: "$amount" },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        return {
            expenses: expenseTrends,
            incomes: incomeTrends,
        };
    } catch (error) {
        console.log("Reports Service getTrends() method Error: ", error);
        throw error;
    }
};

reportsService.getCategoryBreakdown = async (userId, dateRange) => {
    try {
        const { startDate, endDate } = getStartDateFromRange(dateRange) || { startDate: new Date(0), endDate: new Date() };

        const breakdown = await expenseModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: "$categoryName",
                    amount: { $sum: "$amount" },
                    count: { $sum: 1 },
                },
            },
            { $sort: { amount: -1 } },
        ]);

        return breakdown;
    } catch (error) {
        console.log("Reports Service getCategoryBreakdown() method Error: ", error);
        throw error;
    }
};

reportsService.getMerchantBreakdown = async (userId, dateRange) => {
    try {
        const { startDate, endDate } = getStartDateFromRange(dateRange) || { startDate: new Date(0), endDate: new Date() };

        const breakdown = await expenseModel.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    date: { $gte: startDate, $lte: endDate },
                },
            },
            {
                $group: {
                    _id: "$merchant",
                    amount: { $sum: "$amount" },
                    count: { $sum: 1 },
                    categoryName: { $first: "$categoryName" },
                },
            },
            { $sort: { amount: -1 } },
        ]);

        return breakdown;
    } catch (error) {
        console.log("Reports Service getMerchantBreakdown() method Error: ", error);
        throw error;
    }
};

module.exports = reportsService;
