export interface Budget {
  _id: string;
  categoryName: string;
  budgetAmount: number;
  amountSpent: number;
  period: {
    frequency: string;
    start: string;
    end?: string;
  };
  user?: string;
}

export interface Expense {
  _id: string;
  date: string;
  merchant: string;
  categoryName: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
  user?: string;
}

export interface Income {
  _id: string;
  source: string;
  amount: number;
  categoryName: string;
  date: string;
  paymentMethod: string;
  notes?: string;
  user?: string;
}

export interface Goal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  categoryName: string;
  description?: string;
  priority?: string;
  targetDate?: string;
  status: "active" | "completed";
  user?: string;
}

export interface User {
  _id: string;
  fullName: string;
  email: string;
}
