import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ReportsState {
  data: any;
  filters: {
    dateRange: string;
    category?: string;
  };
  loading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  data: null,
  filters: {
    dateRange: "month",
  },
  loading: false,
  error: null,
};

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    reportsStart(state) {
      state.loading = true;
    },
    setReportsData(state, action: PayloadAction<any>) {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setReportsFilters(state, action: PayloadAction<any>) {
      state.filters = { ...state.filters, ...action.payload };
    },
    reportsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { reportsStart, setReportsData, setReportsFilters, reportsFailure } = reportsSlice.actions;
export default reportsSlice.reducer;
