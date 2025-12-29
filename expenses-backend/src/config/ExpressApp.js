const bodyParser = require("body-parser");

const cors = require("cors");

const requestLogger = require("../utilities/requestLogger");

const errorLogger = require("../utilities/errorLogger");

const AuthRouter = require("../routes/Auth.routes");

const BudgetRouter = require("../routes/Budget.routes");

const CategoryRouter = require("../routes/Category.routes");

const ExpenseRouter = require("../routes/Expense.routes");

const GoalRouter = require("../routes/Goal.routes");

const NotificationRouter = require("../routes/Notification.routes");
const DashboardRouter = require("../routes/Dashboard.routes");
const UserRouter = require("../routes/User.routes");
const IncomeRouter = require("../routes/Income.route");
const ReportsRouter = require("../routes/Reports.route");



const App = (app) => {
  app.use(cors());

  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(bodyParser.json());

  app.use(requestLogger);

  app.use("/api/v1/auth", AuthRouter);

  app.use("/api/v1/users", UserRouter);

  app.use("/api/v1/expenses", ExpenseRouter);

  app.use("/api/v1/categories", CategoryRouter);

  app.use("/api/v1/budgets", BudgetRouter);

  app.use("/api/v1/goals", GoalRouter);

  app.use("/api/v1/notifications", NotificationRouter);
  app.use("/api/v1/dashboard", DashboardRouter);
  app.use("/api/v1/income", IncomeRouter);
  app.use("/api/v1/reports", ReportsRouter);



  app.use(errorLogger);
};

module.exports = App;
