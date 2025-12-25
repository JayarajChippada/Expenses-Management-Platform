import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import expensesReducer from "../features/expenses/expenseSlice";
import budgetsReducer from "../features/budgets/budgetSlice";
import goalsReducer from "../features/goals/goalSlice";
import uiReducer from "../features/ui/uiSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import reportsReducer from "../features/reports/reportsSlice";
import incomeReducer from "../features/income/incomeSlice";

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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
