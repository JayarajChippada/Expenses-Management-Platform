import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface SummaryItem {
  amount: number;
  trend: number;
  positive: boolean;
}

export interface DashboardSummary {
  totalIncomes: number;
  totalExpenses: number;
  monthlyBudget: number;
  savings: number;
  budgetAlerts: number;
}

export interface MonthlyExpense {
  month: string;
  income: number;
  expenses: number;
}

export interface ExpenseByCategory {
  category: string;
  amount: number;
}

export interface CategoryInfo {
  categoryName: string;
  icon: string;
  color: string;
}

export interface BudgetUsage {
  category: string;
  spent: number;
  limit: number;
  usedPercentage: number;
}

export interface RecentTransaction {
  categoryName: string;
  date: string;
  amount: number;
  paymentMethod: string;
  merchant: string;
  type: "expense" | "income";
}

export interface DashboardData {
  summary: DashboardSummary;
  monthlyExpenses: MonthlyExpense[];
  expensesByCategory: ExpenseByCategory[];
  categories: CategoryInfo[];
  budgetUsage: BudgetUsage[];
  recentTransactions: RecentTransaction[];
}

export interface DashboardState extends DashboardData {
  loading: boolean;
  error: string | null;
}

const initialState: DashboardState = {
  summary: {
    totalIncomes: 0,
    totalExpenses: 0,
    monthlyBudget: 0,
    savings: 0,
    budgetAlerts: 0,
  },
  monthlyExpenses: [],
  expensesByCategory: [],
  categories: [],
  budgetUsage: [],
  recentTransactions: [],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    dashboardStart(state) {
      state.loading = true;
      state.error = null;
    },
    dashboardSuccess(state, action: PayloadAction<DashboardData>) {
      state.loading = false;
      state.summary = action.payload.summary;
      state.monthlyExpenses = action.payload.monthlyExpenses;
      state.expensesByCategory = action.payload.expensesByCategory;
      state.categories = action.payload.categories;
      state.budgetUsage = action.payload.budgetUsage;
      state.recentTransactions = action.payload.recentTransactions;
      state.error = null;
    },
    dashboardFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { dashboardStart, dashboardSuccess, dashboardFailure } =
  dashboardSlice.actions;
export default dashboardSlice.reducer;
