import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { type Pagination } from "../../types/common";

interface Income {
  _id: string;
  source: string;
  categoryName: string;
  amount: number;
  date: string;
  paymentMethod: string;
  notes: string;
}

interface IncomeFilters {
  search?: string;
  category?: string;
  range?: string;
}

interface IncomeState {
  list: Income[];
  filters: IncomeFilters;
  pagination: Pagination;
  loading: boolean;
  error: string | null;
}

const initialState: IncomeState = {
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

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    incomeStart(state) {
      state.loading = true;
    },
    setIncome(
      state,
      action: PayloadAction<{ data: Income[]; pagination: Pagination }>
    ) {
      state.list = action.payload.data;
      state.pagination = action.payload.pagination;
      state.loading = false;
      state.error = null;
    },
    setIncomeFilters(state, action: PayloadAction<IncomeFilters>) {
      state.filters = action.payload;
      state.pagination.page = 1;
    },
    setIncomePage(state, action: PayloadAction<number>) {
      state.pagination.page = action.payload;
    },
    incomeFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const {
  incomeStart,
  setIncome,
  setIncomeFilters,
  setIncomePage,
  incomeFailure,
} = incomeSlice.actions;

export default incomeSlice.reducer;
