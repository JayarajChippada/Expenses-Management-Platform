import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { type Pagination } from "../../types/common"

interface Goal {
  _id: string
  title: string
  categoryName: string
  description: string
  targetAmount: number
  currentAmount: number
  status: "active" | "completed"
  priority: "high" | "medium" | "low"
  targetDate?: string
}

interface GoalFilters {
  category?: string
  status?: "active" | "completed" | "all"
  priority?: "high" | "medium" | "low" | "all"
}

interface GoalState {
  list: Goal[]
  filters: GoalFilters
  pagination: Pagination
  loading: boolean
  error: string | null
}

const initialState: GoalState = {
  list: [],
  filters: {
    status: "all",
    priority: "all",
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

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    goalStart(state) {
      state.loading = true
      state.error = null
    },
    goalSuccess(state, action: PayloadAction<{ data: Goal[]; pagination?: Pagination }>) {
      state.list = action.payload.data
      if (action.payload.pagination) {
        state.pagination = action.payload.pagination
      }
      state.loading = false
      state.error = null
    },
    goalFailure(state, action: PayloadAction<string>) {
      state.loading = false
      state.error = action.payload
    },
    createGoalSuccess(state, action: PayloadAction<Goal>) {
      state.list.unshift(action.payload)
      state.loading = false
    },
    updateGoalSuccess(state, action: PayloadAction<Goal>) {
      const index = state.list.findIndex((item) => item._id === action.payload._id)
      if (index !== -1) {
        state.list[index] = action.payload
      }
      state.loading = false
    },
    deleteGoalSuccess(state, action: PayloadAction<string>) {
      state.list = state.list.filter((item) => item._id !== action.payload)
      state.loading = false
    },
    setGoalFilters(state, action: PayloadAction<Partial<GoalFilters>>) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetGoalFilters(state) {
      state.filters = initialState.filters
    }
  },
})

export const { 
  goalStart, 
  goalSuccess, 
  goalFailure, 
  createGoalSuccess, 
  updateGoalSuccess, 
  deleteGoalSuccess,
  setGoalFilters,
  resetGoalFilters
} = goalSlice.actions

export default goalSlice.reducer
