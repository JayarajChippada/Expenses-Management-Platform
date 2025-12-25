import { Box, Typography } from "@mui/material";
import { TrendingUp, TrendingDown, AccountBalanceWallet, Receipt, Savings, Warning } from "@mui/icons-material";
import SummaryCard from "./components/SummaryCard";
import ExpenseTrendChart from "./components/ExpenseTrendChart";
import CategoryPieChart from "./components/CategoryPieChart";
import BudgetUsageCard from "./components/BudgetUsageCard";
import RecentExpensesTable from "./components/RecentExpensesTable";
import { type SummaryMetric } from "./dashboard.types";

const Dashboard = () => {
  // Sample data - will come from Redux selectors
  const metrics: SummaryMetric[] = [
    {
      title: "Total Balance",
      value: "₹1,25,450",
      trend: 12,
      positive: true,
      icon: <AccountBalanceWallet sx={{ fontSize: 28 }} />,
      color: "#667eea",
    },
    {
      title: "Total Expenses",
      value: "₹42,350",
      trend: 8,
      positive: false,
      icon: <TrendingDown sx={{ fontSize: 28 }} />,
      color: "#ef4444",
    },
    {
      title: "Total Income",
      value: "₹85,000",
      trend: 15,
      positive: true,
      icon: <TrendingUp sx={{ fontSize: 28 }} />,
      color: "#22c55e",
    },
    {
      title: "Budget Alerts",
      value: "2",
      icon: <Warning sx={{ fontSize: 28 }} />,
      color: "#f59e0b",
    },
  ];

  return (
    <Box>
      {/* Summary Cards */}
      <Box className="row g-3 mb-4">
        {metrics.map((metric) => (
          <Box key={metric.title} className="col-12 col-sm-6 col-xl-3">
            <SummaryCard metric={metric} />
          </Box>
        ))}
      </Box>

      {/* Charts Row */}
      <Box className="row g-3 mb-4">
        <Box className="col-12 col-lg-8">
          <ExpenseTrendChart />
        </Box>
        <Box className="col-12 col-lg-4">
          <CategoryPieChart />
        </Box>
      </Box>

      {/* Budget & Transactions Row */}
      <Box className="row g-3">
        <Box className="col-12 col-lg-6">
          <BudgetUsageCard />
        </Box>
        <Box className="col-12 col-lg-6">
          <RecentExpensesTable />
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
