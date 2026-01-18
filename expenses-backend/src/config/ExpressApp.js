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
const IncomeRouter = require("../routes/Income.routes");
const ReportsRouter = require("../routes/Reports.routes");
const DevRouter = require("../routes/Dev.routes");

const Config = require("./Configs");

const App = (app) => {
  app.use(
    cors({
      origin: (origin, callback) => {
        const allowedOrigins = [
          Config.CORS_ORIGIN,
          Config.CORS_ORIGIN?.endsWith("/")
            ? Config.CORS_ORIGIN.slice(0, -1)
            : Config.CORS_ORIGIN + "/",
          "http://localhost:5173",
        ];

        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin) || Config.CORS_ORIGIN === "*") {
          callback(null, true);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      },
      credentials: true,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());
  // app.use(requestLogger);
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

  if (Config.NODE_ENV === "development") {
    app.use("/api/v1/dev", DevRouter);
  }

  app.use(errorLogger);
};

module.exports = App;
