import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type Pagination } from "../../types/common"

interface Income {
  _id: string
  source: string
  categoryName: string
  amount: number
  date: string
  paymentMethod: string
  notes: string
}

interface IncomeFilters {
  search?: string
  category?: string
  dateRange?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

interface IncomeState {
  list: Income[]
  filters: IncomeFilters
  pagination: Pagination
  loading: boolean
  error: string | null
}

const initialState: IncomeState = {
  list: [],
  filters: {
    page: 1,
    limit: 10,
    search: "",
    category: "",
    dateRange: "ALL"
  },
  pagination: {
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  },
  loading: false,
  error: null,
}

const incomeSlice = createSlice({
  name: "income",
  initialState,
  reducers: {
    incomeStart(state) {
      state.loading = true
      state.error = null
    },
    incomeFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    incomeSuccess(state, action: PayloadAction<{ data: Income[]; pagination: Pagination }>) {
      state.list = action.payload.data
      state.pagination = action.payload.pagination
      state.loading = false
      state.error = null
    },
    createIncomeSuccess(state, action: PayloadAction<Income>) {
      state.list.unshift(action.payload)
      state.loading = false
    },
    updateIncomeSuccess(state, action: PayloadAction<Income>) {
      const index = state.list.findIndex((item) => item._id === action.payload._id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
    },
    deleteIncomeSuccess(state, action: PayloadAction<string>) {
      state.list = state.list.filter((item) => item._id !== action.payload)
      state.loading = false
    },
    setIncomeFilters(state, action: PayloadAction<Partial<IncomeFilters>>) {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setIncomePage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload
    },
    resetIncomeFilters(state) {
      state.filters = initialState.filters
    }
  },
})

export const {
  incomeStart,
  incomeFailure,
  incomeSuccess,
  createIncomeSuccess,
  updateIncomeSuccess,
  deleteIncomeSuccess,
  setIncomeFilters,
  setIncomePage,
  resetIncomeFilters,
} = incomeSlice.actions

export default incomeSlice.reducer
