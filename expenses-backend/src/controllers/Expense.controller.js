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
      res.status(201).json({
        success: true,
        message: "Expense Added Successfully",
        data: resObj,
      });
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

    const data = await expenseService.fetchExpensesByUserId(
      userId,
      page,
      limit
    );

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
        pagination: result.pagination,
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
      return res
        .status(400)
        .json({ success: false, message: "Invalid date range" });
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
        pagination: result.pagination,
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

    const result = await expenseService.fetchExpensesBySearch(
      userId,
      search,
      page,
      limit
    );

    if (result !== null) {
      res.status(200).json({
        success: true,
        data: result.expenses,
        pagination: result.pagination,
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
      res.status(200).json({
        success: true,
        message: "Expenses imported successfully",
        count: resObj.length,
      });
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

const exceljs = require("exceljs");
const PDFDocument = require("pdfkit");

expenseController.exportExpenses = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { format } = req.query;

    const expenses = await expenseService.fetchAllExpensesByUserId(userId);

    if (format === "excel") {
      const workbook = new exceljs.Workbook();
      const worksheet = workbook.addWorksheet("Expenses");

      worksheet.columns = [
        { header: "Date", key: "date", width: 15 },
        { header: "Category", key: "category", width: 20 },
        { header: "Merchant", key: "merchant", width: 20 },
        { header: "Amount", key: "amount", width: 12 },
        { header: "Payment Method", key: "paymentMethod", width: 15 },
        { header: "Notes", key: "notes", width: 30 },
      ];

      expenses.forEach((exp) => {
        worksheet.addRow({
          date: new Date(exp.date).toLocaleDateString(),
          category: exp.categoryName,
          merchant: exp.merchant,
          amount: exp.amount,
          paymentMethod: exp.paymentMethod,
          notes: exp.notes,
        });
      });

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        "attachment filename=" + "expenses.xlsx"
      );

      return workbook.xlsx.write(res).then(() => {
        res.status(200).end();
      });
    } else if (format === "pdf") {
      const doc = new PDFDocument();
      let filename = "expenses.pdf";
      filename = encodeURIComponent(filename);

      res.setHeader(
        "Content-disposition",
        'attachment filename="' + filename + '"'
      );
      res.setHeader("Content-type", "application/pdf");

      doc.fontSize(20).text("Expense Report", { align: "center" });
      doc.moveDown();

      const tableTop = 150;
      doc.fontSize(12).text("Date", 50, tableTop);
      doc.text("Category", 150, tableTop);
      doc.text("Merchant", 250, tableTop);
      doc.text("Amount", 350, tableTop);
      doc.text("Payment", 450, tableTop);

      let y = tableTop + 25;
      expenses.forEach((exp) => {
        if (y > 700) {
          doc.addPage();
          y = 50;
        }
        doc.fontSize(10).text(new Date(exp.date).toLocaleDateString(), 50, y);
        doc.text(exp.categoryName, 150, y);
        doc.text(exp.merchant || "-", 250, y);
        doc.text(exp.amount.toString(), 350, y);
        doc.text(exp.paymentMethod, 450, y);
        y += 20;
      });

      doc.pipe(res);
      doc.end();
    } else {
      res.status(400).json({ success: false, message: "Invalid format" });
    }
  } catch (error) {
    console.log("Expense Controller exportExpenses() method Error: ", error);
    next(error);
  }
};

module.exports = expenseController;
