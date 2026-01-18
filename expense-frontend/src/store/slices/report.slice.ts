import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface ReportsState {
  overview: any
  trends: {
    expenses: any[]
    incomes: any[]
  }
  categories: any[]
  merchants: any[]
  filters: {
    dateRange: string
    category?: string
  }
  loading: boolean
  error: string | null
}

const initialState: ReportsState = {
  overview: null,
  trends: { expenses: [], incomes: [] },
  categories: [],
  merchants: [],
  filters: {
    dateRange: "1M",
  },
  loading: false,
  error: null,
}

const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    reportsStart(state) {
      state.loading = true
      state.error = null
    },
    reportsOverviewSuccess(state, action: PayloadAction<any>) {
      state.overview = action.payload
      state.loading = false
    },
    reportsTrendsSuccess(state, action: PayloadAction<{ expenses: any[]; incomes: any[] }>) {
      state.trends = action.payload
      state.loading = false
    },
    reportsCategoriesSuccess(state, action: PayloadAction<any[]>) {
      state.categories = action.payload
      state.loading = false
    },
    reportsMerchantsSuccess(state, action: PayloadAction<any[]>) {
      state.merchants = action.payload
      state.loading = false
    },
    setReportsFilters(state, action: PayloadAction<any>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    reportsFailure(state, action: PayloadAction<string | null>) {
      state.loading = false
      state.error = action.payload
    },
  },
})

export const { 
  reportsStart, 
  reportsOverviewSuccess, 
  reportsTrendsSuccess, 
  reportsCategoriesSuccess, 
  reportsMerchantsSuccess, 
  setReportsFilters, 
  reportsFailure 
} = reportsSlice.actions

export default reportsSlice.reducer
