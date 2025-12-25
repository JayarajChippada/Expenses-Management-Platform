import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Period {
    frequency: string;
    start: string;
    end: string;
}
interface Budget {
    _id: string;
    categoryName: string;
    budgetAmount: number;
    period: Period
}

interface BudgetState {
  list: Budget[];
  loading: boolean;
  error: string | null;
}

const initialState: BudgetState = {
  list: [],
  loading: false,
  error: null,
};

const budgetSlice = createSlice({
  name: "budgets",
  initialState,
  reducers: {
    budgetStart(state) {
      state.loading = true
    },
    setBudgets(state, action: PayloadAction<Budget[]>) {
      state.list = action.payload
      state.loading = false
    },
    budgetFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
  },
});

export const { budgetStart, setBudgets, budgetFailure } = budgetSlice.actions;
export default budgetSlice.reducer;