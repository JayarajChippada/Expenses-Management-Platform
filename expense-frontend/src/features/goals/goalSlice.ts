import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface Goal {
  _id: string;
  title: string;
  categoryName: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  status: "active" | "completed";
  priority: "high" | "medium" | "low"
}

interface GoalState {
  list: Goal[];
  loading: boolean;
  error: string | null;
}

const initialState: GoalState = {
  list: [],
  loading: false,
  error: null,
};

const goalSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {
    goalStart(state) {
      state.loading = true;
    },
    setGoals(state, action: PayloadAction<Goal[]>) {
      state.list = action.payload;
      state.loading = false;
    },
    goalFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
  },
});

export const { goalStart, setGoals, goalFailure } = goalSlice.actions;
export default goalSlice.reducer;
