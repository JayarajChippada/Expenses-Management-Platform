import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Pagination } from "../../types/common";

interface Period {
  frequency: string;
  start: string;
  end?: string;
}

interface Budget {
  _id: string;
  categoryName: string;
  budgetAmount: number;
  amountSpent: number;
  period: Period;
}

interface BudgetFilters {
  month?: number;
  year?: number;
  category?: string;
}

interface BudgetState {
  list: Budget[];
  filters: BudgetFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  list: [],
  filters: {
    month: new Date().getMonth(),
    year: new Date().getFullYear(),
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    budgetStart(state) {
      state.loading = true;
      state.error = null;
    },
    budgetSuccess(state, action: PayloadAction<{ data: Budget[]; pagination?: Pagination }>) {
      state.list = action.payload.data;
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination;
      }
      state.loading = false;
      state.error = null;
    },
    budgetFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createBudgetSuccess(state, action: PayloadAction<Budget>) {
      state.list.unshift(action.payload);
      state.loading = false;
    },
    updateBudgetSuccess(state, action: PayloadAction<Budget>) {
      const index = state.list.findIndex((item) => item._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      state.loading = false;
    },
    deleteBudgetSuccess(state, action: PayloadAction<string>) {
      state.list = state.list.filter((item) => item._id !== action.payload);
      state.loading = false;
    },
    setBudgetFilters(state, action: PayloadAction<Partial<BudgetFilters>>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetBudgetFilters(state) {
      state.filters = initialState.filters;
    }
  },
});

export const { 
  budgetStart, 
  budgetSuccess, 
  budgetFailure, 
  createBudgetSuccess, 
  updateBudgetSuccess, 
  deleteBudgetSuccess,
  setBudgetFilters,
  resetBudgetFilters
} = budgetSlice.actions;

export default budgetSlice.reducer;