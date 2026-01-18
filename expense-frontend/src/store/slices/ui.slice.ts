import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type ThemeMode = "light" | "dark";

interface UIState {
  theme: ThemeMode;
  globalLoading: boolean;
  sidebarOpen: boolean;
}

const initialState: UIState = {
  theme: (localStorage.getItem("theme") as ThemeMode) || "light",
  globalLoading: false,
  sidebarOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<ThemeMode>) {
      state.theme = action.payload;
      localStorage.setItem("theme", action.payload);
    },
    setGlobalLoading(state, action: PayloadAction<boolean>) {
      state.globalLoading = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    closeSidebar(state) {
      state.sidebarOpen = false;
    },
    openSidebar(state) {
      state.sidebarOpen = true;
    },
  },
});

export const {
  setTheme,
  setGlobalLoading,
  toggleSidebar,
  closeSidebar,
  openSidebar,
} = uiSlice.actions;
export default uiSlice.reducer;
