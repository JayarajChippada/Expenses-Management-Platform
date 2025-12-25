import { type ReactNode } from "react";

export interface SummaryMetric {
  title: string;
  value: string;
  trend?: number;
  positive?: boolean;
  icon?: ReactNode;
  color?: string;
}
