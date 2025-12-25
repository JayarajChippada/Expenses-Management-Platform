import { createSlice, type PayloadAction } from '@reduxjs/toolkit'


interface DashboardSummary {
    totalExpenses: number;
    monthlyBudget: number;
    savings: number;
    budgetAlerts: number;
}


interface DashboardState {
    summary: DashboardSummary | null;
    expensesByCategory: any[];
    budgetUsage: any[];
    recentTransactions: any[];
    loading: boolean;
    error: string | null;
}

const initialState: DashboardState = {
    summary: null,
    expensesByCategory: [],
    budgetUsage: [],
    recentTransactions: [],
    loading: false,
    error: null
}

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState,
    reducers: {
        dashboardStart(state) {
            state.loading = true
        },
        dashboardSuccess(state, action: PayloadAction<DashboardState>) {
            state.summary = action.payload.summary
            state.expensesByCategory = action.payload.expensesByCategory
            state.budgetUsage = action.payload.budgetUsage
            state.recentTransactions = action.payload.recentTransactions
            state.loading = false
            state.error = null
        },
        dashboardFailure(state, action: PayloadAction<string>) {
            state.loading = false
            state.error = action.payload
        }
    }
})

export const { dashboardStart, dashboardSuccess, dashboardFailure } = dashboardSlice.actions;
export default dashboardSlice.reducer;