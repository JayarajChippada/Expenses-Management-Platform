import { useEffect, useMemo } from "react";
import SummaryCard from "./components/SummaryCard";
import ExpenseTrendChart from "./components/ExpenseTrendChart";
import CategoryPieChart from "./components/CategoryPieChart";
import BudgetUsageCard from "./components/BudgetUsageCard";
import RecentExpensesTable from "./components/RecentExpensesTable";
import { type SummaryMetric } from "./dashboard.types";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import {
  dashboardStart,
  dashboardSuccess,
  dashboardFailure,
} from "../../store/slices/dashboard.slice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

const Dashboard = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { summary, loading, error } = useAppSelector(
    (state) => state.dashboard
  );

  useEffect(() => {
    const getDashboardData = async () => {
      dispatch(dashboardStart());
      try {
        const response = await api.get(API_ENDPOINTS.DASHBOARD.BASE);
        dispatch(dashboardSuccess(response.data.data));
      } catch (err: any) {
        dispatch(
          dashboardFailure(
            err.response?.data?.message || "Failed to fetch dashboard data"
          )
        );
      }
    };

    getDashboardData();
  }, [dispatch]);

  const metrics: SummaryMetric[] = useMemo(
    () => [
      {
        title: "Total Income",
        value: `₹${summary.totalIncomes.toLocaleString()}`,
        trend: 0,
        positive: true,
        icon: "bi-graph-up",
        color: "#22c55e",
      },
      {
        title: "Total Expenses",
        value: `₹${summary.totalExpenses.toLocaleString()}`,
        trend: 0,
        positive: false,
        icon: "bi-graph-down",
        color: "#ef4444",
      },
      {
        title: "Net Savings",
        value: `₹${summary.savings.toLocaleString()}`,
        trend: 0,
        positive: summary.savings >= 0,
        icon: "bi-wallet2",
        color: "#6366f1",
      },
      {
        title: "Savings Rate",
        value:
          summary.totalIncomes > 0
            ? `${((summary.savings / summary.totalIncomes) * 100).toFixed(1)}%`
            : "0%",
        icon: "bi-percent",
        color: "#a855f7",
      },
    ],
    [summary]
  );

  if (loading && !summary.totalIncomes) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "400px" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-fluid p-0">
        <div
          className="alert alert-danger shadow-sm border-0 rounded-4 p-4 d-flex align-items-center gap-3"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill fs-4"></i>
          <div>
            <div className="fw-bold">Error loading dashboard</div>
            <div className="small opacity-75">{error}</div>
          </div>
          <button
            className="btn btn-outline-danger btn-sm ms-auto"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-0">
      <div className="mb-4">
        <h4 className="fw-bold text-dark mb-1">Dashboard</h4>
        <p className="text-muted small">
          Welcome back, {user?.fullName?.split(" ")?.[0] || "User"}! Here's your
          financial overview.
        </p>
      </div>
      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {metrics.map((metric) => (
          <div key={metric.title} className="col-12 col-sm-6 col-xl-3">
            <SummaryCard metric={metric} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-lg-8">
          <ExpenseTrendChart />
        </div>
        <div className="col-12 col-lg-4">
          <CategoryPieChart />
        </div>
      </div>

      {/* Budget & Transactions Row */}
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <BudgetUsageCard />
        </div>
        <div className="col-12 col-lg-6">
          <RecentExpensesTable />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
