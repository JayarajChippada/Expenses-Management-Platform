import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";

const ReportTrends = () => {
  const { trends } = useAppSelector((state) => state.reports);

  /* ============================
     NORMALIZE TRENDS DATA
  ============================ */
  const formattedData = useMemo(() => {
    if (!trends) return [];

    const map = new Map<string, { date: string; income: number; expenses: number }>();

    // Add expenses
    trends.expenses?.forEach((e: any) => {
      map.set(e._id, {
        date: e._id,
        expenses: Number(e.amount) || 0,
        income: 0,
      });
    });

    // Add incomes
    trends.incomes?.forEach((i: any) => {
      const existing = map.get(i._id);
      if (existing) {
        existing.income = Number(i.amount) || 0;
      } else {
        map.set(i._id, {
          date: i._id,
          income: Number(i.amount) || 0,
          expenses: 0,
        });
      }
    });

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [trends]);

  if (formattedData.length === 0) {
    return (
      <div className="p-5 text-center text-muted">
        <i className="bi bi-graph-up fs-1 d-block mb-3 opacity-25"></i>
        No trend data available for this period
      </div>
    );
  }

  /* ============================
     CALCULATIONS
  ============================ */
  const avgIncome =
    formattedData.reduce((sum, i) => sum + i.income, 0) / formattedData.length;

  const avgExpenses =
    formattedData.reduce((sum, i) => sum + i.expenses, 0) / formattedData.length;

  const avgSavings = avgIncome - avgExpenses;

  return (
    <div>
      {/* ============================
          SUMMARY CARDS
      ============================ */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4" style={{ borderLeft: '4px solid #22c55e' }}>
            <div className="card-body">
              <div className="small fw-bold text-success">AVG INCOME</div>
              <div className="h4 fw-bold">₹{Math.round(avgIncome).toLocaleString()}</div>
            </div>
          </div>
        </div>
              
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4" style={{ borderLeft: '4px solid #ef4444' }}>
            <div className="card-body">
              <div className="small fw-bold text-danger">AVG EXPENSES</div>
              <div className="h4 fw-bold">₹{Math.round(avgExpenses).toLocaleString()}</div>
            </div>
          </div>
        </div>
              
        <div className="col-md-4">
          <div className="card shadow-sm rounded-4" style={{ borderLeft: '4px solid #3b82f6' }}>
            <div className="card-body">
              <div className="small fw-bold text-primary-custom">AVG SAVINGS</div>
              <div className="h4 fw-bold">₹{Math.round(avgSavings).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================
          CHART
      ============================ */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
        <div className="card-header bg-white p-4">
          <h6 className="fw-bold mb-0">Cash Inflow vs Outflow</h6>
        </div>

        <div className="card-body p-4 pt-0">
          <div style={{ height: "350px" }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formattedData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="var(--border-color)"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${v / 1000}k`}
                />
                <Tooltip
                  formatter={(v?: number) => [
                    `₹${(v ?? 0).toLocaleString()}`,
                    "",
                  ]}
                />
                <Legend />

                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#22c55e"
                  strokeWidth={3}
                  name="Income"
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={3}
                  name="Expenses"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportTrends;
