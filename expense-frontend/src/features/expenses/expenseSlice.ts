import { type Pagination } from "../../types/common";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Expense {
  _id: string;
  categoryName: string;
  merchant: string;
  amount: number;
  date: string;
  paymentMethod: string;
  notes: string;
}

interface ExpenseFilters {
  search?: string;
  category?: string;
  range?: string;
}

interface ExpenseState {
  list: Expense[];
  filters: ExpenseFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const initialState: ExpenseState = {
  list: [],
  filters: {},
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
};

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    expenseStart(state) {
      state.loading = true;
    },
    setExpenses(
      state,
      action: PayloadAction<{ data: any[]; pagination: any }>
    ) {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    setExpenseFilters(state, action: PayloadAction<any>) {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    setExpensePage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    expenseFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  expenseStart,
  setExpenses,
  setExpenseFilters,
  setExpensePage,
  expenseFailure,
} = expenseSlice.actions;

export default expenseSlice.reducer;