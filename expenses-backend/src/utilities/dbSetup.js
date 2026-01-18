const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");
const Category = require("../models/Category.model");
const Expense = require("../models/Expense.model");
const Income = require("../models/Income.model");
const Budget = require("../models/Budget.model");
const Goal = require("../models/Goal.model");
const Notification = require("../models/Notification.model");

const clearAndSeed = async () => {
  try {
    // Clear all collections
    await User.deleteMany({});
    await Category.deleteMany({});
    await Expense.deleteMany({});
    await Income.deleteMany({});
    await Budget.deleteMany({});
    await Goal.deleteMany({});
    await Notification.deleteMany({});

    // Cleanup accidental indexes on Categories (if any)
    try {
      await Category.collection.dropIndex("email_1");
    } catch (e) {
      // Index might not exist, ignore
    }

    // Create Dummy User
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash("Password123@", salt);

    const user = await User.create({
      fullName: "JayarajChippada",
      email: "jayaraj@gmail.com",
      password: hashedPassword,
      currency: "INR",
      timeZone: "Asia/Kolkata",
    });

    const userId = user._id;

    // Create Categories
    const categories = [
      {
        userId,
        categoryName: "Housing",
        type: "expense",
        icon: "🏠",
        color: "#6366f1",
        keywords: ["rent", "maintenance"],
      },
      {
        userId,
        categoryName: "Food",
        type: "expense",
        icon: "🍕",
        color: "#f59e0b",
        keywords: ["restaurant", "swiggy", "zomato", "grocery"],
      },
      {
        userId,
        categoryName: "Salary",
        type: "income",
        icon: "💰",
        color: "#10b981",
      },
      {
        userId,
        categoryName: "Entertainment",
        type: "expense",
        icon: "🎮",
        color: "#8b5cf6",
        keywords: ["netflix", "movies", "games"],
      },
      {
        userId,
        categoryName: "Travel",
        type: "expense",
        icon: "✈️",
        color: "#3b82f6",
        keywords: ["uber", "ola", "flight", "train"],
      },
      {
        userId,
        categoryName: "Investment",
        type: "income",
        icon: "📈",
        color: "#06b6d4",
      },
      {
        userId,
        categoryName: "Health",
        type: "expense",
        icon: "🏥",
        color: "#ef4444",
        keywords: ["hospital", "pharmacy", "medicine"],
      },
      {
        userId,
        categoryName: "Shopping",
        type: "expense",
        icon: "🛍️",
        color: "#ec4899",
        keywords: ["amazon", "flipkart", "myntra"],
      },
    ];
    await Category.insertMany(categories);

    const now = new Date();

    // Create Incomes
    const incomes = [
      {
        userId,
        categoryName: "Salary",
        source: "Infosys",
        amount: 75000,
        date: new Date(now.getFullYear(), now.getMonth(), 1),
        notes: "Monthly Salary",
        paymentMethod: "Bank Transfer",
      },
      {
        userId,
        categoryName: "Investment",
        source: "Infosys",
        amount: 8000,
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        notes: "Dividends",
        paymentMethod: "Bank Transfer",
      },
      {
        userId,
        categoryName: "Salary",
        source: "Infosys",
        amount: 75000,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        notes: "Previous Month Salary",
        paymentMethod: "Bank Transfer",
      },
    ];
    await Income.insertMany(incomes);

    // Create Expenses - CURRENT MONTH
    const currentMonthExpenses = [
      {
        userId,
        categoryName: "Housing",
        amount: 20000,
        date: new Date(now.getFullYear(), now.getMonth(), 5),
        merchant: "Housing Society",
        paymentMethod: "UPI",
        notes: "Monthly Rent",
      },
      {
        userId,
        categoryName: "Food",
        amount: 850,
        date: new Date(now.getFullYear(), now.getMonth(), 2),
        merchant: "Dominos",
        paymentMethod: "UPI",
        notes: "Dinner",
      },
      {
        userId,
        categoryName: "Travel",
        amount: 450,
        date: new Date(now.getFullYear(), now.getMonth(), 4),
        merchant: "Uber",
        paymentMethod: "Cash",
      },
      {
        userId,
        categoryName: "Entertainment",
        amount: 2500,
        date: new Date(now.getFullYear(), now.getMonth(), 10),
        merchant: "PVR Cinemas",
        paymentMethod: "Debit Card",
      },
      {
        userId,
        categoryName: "Health",
        amount: 1200,
        date: new Date(now.getFullYear(), now.getMonth(), 12),
        merchant: "Apollo Pharmacy",
        paymentMethod: "UPI",
      },
      {
        userId,
        categoryName: "Shopping",
        amount: 4500,
        date: new Date(now.getFullYear(), now.getMonth(), 15),
        merchant: "Amazon",
        paymentMethod: "Debit Card",
      },
      {
        userId,
        categoryName: "Food",
        amount: 350,
        date: new Date(now.getFullYear(), now.getMonth(), 18),
        merchant: "Starbucks",
        paymentMethod: "Debit Card",
      },
    ];
    await Expense.insertMany(currentMonthExpenses);

    // Create Expenses - PREVIOUS MONTH
    const prevMonthExpenses = [
      {
        userId,
        categoryName: "Housing",
        amount: 20000,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 5),
        merchant: "Housing Society",
        paymentMethod: "UPI",
      },
      {
        userId,
        categoryName: "Food",
        amount: 600,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 8),
        merchant: "Restaurant",
        paymentMethod: "Cash",
      },
      {
        userId,
        categoryName: "Travel",
        amount: 3000,
        date: new Date(now.getFullYear(), now.getMonth() - 1, 20),
        merchant: "Indigo",
        paymentMethod: "Debit Card",
        notes: "Flight to Home",
      },
    ];
    await Expense.insertMany(prevMonthExpenses);

    // Create Budgets
    const budgets = [
      {
        userId,
        categoryName: "Food",
        budgetAmount: 12000,
        amountSpent: 1200,
        period: {
          frequency: "Monthly",
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        },
        alertThreshold: 80,
      },
      {
        userId,
        categoryName: "Travel",
        budgetAmount: 5000,
        amountSpent: 450,
        period: {
          frequency: "Monthly",
          start: new Date(now.getFullYear(), now.getMonth(), 1),
          end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
        },
        alertThreshold: 75,
      },
    ];
    await Budget.insertMany(budgets);

    // Create Goals
    const goals = [
      {
        userId,
        title: "Europe Trip",
        targetAmount: 200000,
        currentAmount: 45000,
        targetDate: new Date(now.getFullYear() + 1, 5, 20),
        categoryName: "Goal",
        status: "active",
      },
      {
        userId,
        title: "New Laptop",
        targetAmount: 120000,
        currentAmount: 80000,
        targetDate: new Date(now.getFullYear(), now.getMonth() + 3, 10),
        categoryName: "Goal",
        status: "active",
      },
    ];
    await Goal.insertMany(goals);

    // Create Notifications
    const notifications = [
      {
        userId,
        title: "Welcome!",
        message: "Welcome to your new Expense Management Dashboard!",
        isRead: false,
        referenceId: new mongoose.Types.ObjectId(), // Simulated reference
        date: new Date(),
      },
      {
        userId,
        title: "Budget Warning",
        message: "You've used 80% of your Food budget.",
        isRead: false,
        referenceId: new mongoose.Types.ObjectId(),
        date: new Date(),
      },
    ];
    await Notification.insertMany(notifications);

    return {
      success: true,
      message: "Database reset and seeded successfully!",
      credentials: { email: "jayaraj@gmail.com", password: "Password123@" },
    };
  } catch (error) {
    console.error("Database Seeding Error:", error);
    throw error;
  }
};

module.exports = { clearAndSeed };
