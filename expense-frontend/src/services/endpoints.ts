export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    REFRESH: "/auth/refresh",
  },
  EXPENSES: {
    BASE: "/expenses",
    BY_ID: (id: string) => `/expenses/${id}`,
    STATS: "/expenses/stats",
  },
  INCOME: {
    BASE: "/income",
    BY_ID: (id: string) => `/income/${id}`,
    STATS: "/income/stats",
  },
  BUDGETS: {
    BASE: "/budgets",
    BY_ID: (id: string) => `/budgets/${id}`,
    USAGE: "/budgets/usage",
  },
  GOALS: {
    BASE: "/goals",
    BY_ID: (id: string) => `/goals/${id}`,
  },
  DASHBOARD: {
    SUMMARY: "/dashboard/summary",
    CHARTS: "/dashboard/charts",
    RECENT: "/dashboard/recent",
  },
  REPORTS: {
    OVERVIEW: "/reports/overview",
    TRENDS: "/reports/trends",
    CATEGORIES: "/reports/categories",
    MERCHANTS: "/reports/merchants",
    EXPORT: "/reports/export",
  },
  SETTINGS: {
    PROFILE: "/settings/profile",
    PREFERENCES: "/settings/preferences",
    PASSWORD: "/settings/password",
  },
};
