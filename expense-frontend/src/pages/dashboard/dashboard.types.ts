export interface SummaryMetric {
  title: string;
  value: string;
  trend?: number;
  positive?: boolean;
  icon?: string;  // Bootstrap icon class name
  color?: string;
}

export interface BudgetItem {
  category: string;
  spent: number;
  budget: number;
  color: string;
}
