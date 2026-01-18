import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/auth.slice";
import expensesReducer from "./slices/expense.slice";
import budgetsReducer from "./slices/budget.slice";
import goalsReducer from "./slices/goal.slice";
import uiReducer from "./slices/ui.slice";
import dashboardReducer from "./slices/dashboard.slice";
import reportsReducer from "./slices/report.slice";
import incomeReducer from "./slices/income.slice";
import categoryReducer from "./slices/category.slice";
import notificationReducer from "./slices/notification.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    expenses: expensesReducer,
    budgets: budgetsReducer,
    goals: goalsReducer,
    ui: uiReducer,
    dashboard: dashboardReducer,
    reports: reportsReducer,
    income: incomeReducer,
    categories: categoryReducer,
    notifications: notificationReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
