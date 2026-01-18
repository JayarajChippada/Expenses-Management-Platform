import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type Pagination } from "../../types/common"

interface Expense {
  _id: string
  categoryName: string
  merchant: string
  amount: number
  date: string
  paymentMethod: string
  notes: string
}

interface ExpenseFilters {
  search?: string
  category?: string
  dateRange?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
}

interface ExpenseState {
  list: Expense[]
  filters: ExpenseFilters
  pagination: Pagination
  loading: boolean
  error: string | null
}

const initialState: ExpenseState = {
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

const expenseSlice = createSlice({
  name: "expenses",
  initialState,
  reducers: {
    expenseStart(state) {
      state.loading = true
      state.error = null
    },
    expenseFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    expenseSuccess(state, action: PayloadAction<{ data: Expense[]; pagination: Pagination }>) {
      state.list = action.payload.data
      state.pagination = action.payload.pagination
      state.loading = false
      state.error = null
    },
    createExpenseSuccess(state, action: PayloadAction<Expense>) {
      state.list.unshift(action.payload)
      state.loading = false
    },
    updateExpenseSuccess(state, action: PayloadAction<Expense>) {
      const index = state.list.findIndex((item) => item._id === action.payload._id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
    },
    deleteExpenseSuccess(state, action: PayloadAction<string>) {
      state.list = state.list.filter((item) => item._id !== action.payload)
      state.loading = false
    },
    setExpenseFilters(state, action: PayloadAction<Partial<ExpenseFilters>>) {
      state.filters = { ...state.filters, ...action.payload, page: 1 }
    },
    setExpensePage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload
    },
    resetExpenseFilters(state) {
      state.filters = initialState.filters
    }
  },
})

export const {
  expenseStart,
  expenseFailure,
  expenseSuccess,
  createExpenseSuccess,
  updateExpenseSuccess,
  deleteExpenseSuccess,
  setExpenseFilters,
  setExpensePage,
  resetExpenseFilters,
} = expenseSlice.actions

export default expenseSlice.reducer
