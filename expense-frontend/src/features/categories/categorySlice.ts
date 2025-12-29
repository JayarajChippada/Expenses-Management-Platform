import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface Category {
  _id: string;
  categoryName: string;
  icon: string;
  type: string;
  color: string;
  keywords: string[];
}

interface CategoryState {
  list: Category[];
  names: string[];
  loading: boolean;
  error: string | null;
}

const initialState: CategoryState = {
  list: [],
  names: [],
  loading: false,
  error: null,
};

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    categoryStart(state) {
      state.loading = true;
      state.error = null;
    },
    categoryFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    categorySuccess(state, action: PayloadAction<Category[]>) {
      state.list = action.payload;
      state.loading = false;
      state.error = null;
    },
    categoryNamesSuccess(state, action: PayloadAction<string[]>) {
      state.names = action.payload;
      state.loading = false;
      state.error = null;
    },
    createCategorySuccess(state, action: PayloadAction<Category>) {
      state.list.unshift(action.payload);
      if (!state.names.includes(action.payload.categoryName)) {
        state.names.push(action.payload.categoryName);
      }
      state.loading = false;
    },
    updateCategorySuccess(state, action: PayloadAction<Category>) {
      const index = state.list.findIndex((c) => c._id === action.payload._id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
      state.loading = false;
    },
    deleteCategorySuccess(state, action: PayloadAction<string>) {
      state.list = state.list.filter((c) => c._id !== action.payload);
      state.loading = false;
    },
    clearCategoryError(state) {
      state.error = null;
    },
  },
});

export const {
  categoryStart,
  categoryFailure,
  categorySuccess,
  categoryNamesSuccess,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
  clearCategoryError,
} = categorySlice.actions;

export default categorySlice.reducer;
