import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useAppSelector } from "../../../store/hooks";

const ExpenseTrendChart = () => {
  const { monthlyExpenses } = useAppSelector((state) => state.dashboard);

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold mb-0">Monthly Expense Trend</h6>
          <div className="d-flex gap-3">
            <div className="d-flex align-items-center gap-1">
              <span
                className="rounded-circle"
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#6366f1",
                }}
              ></span>
              <small className="text-muted extra-small">Expenses</small>
            </div>
            <div className="d-flex align-items-center gap-1">
              <span
                className="rounded-circle"
                style={{
                  width: "12px",
                  height: "12px",
                  backgroundColor: "#22c55e",
                }}
              ></span>
              <small className="text-muted extra-small">Income</small>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthlyExpenses}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border-color)"
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "var(--text-muted)" }}
              tickFormatter={(value) =>
                `₹${value >= 1000 ? (value / 1000).toFixed(0) + "k" : value}`
              }
            />
            <Tooltip
              formatter={(v: any) => [`₹${v?.toLocaleString()}`, ""]}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-md)",
                padding: "12px",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
              }}
              itemStyle={{ color: "var(--text-main)" }}
              labelStyle={{ color: "var(--text-muted)" }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#6366f1"
              strokeWidth={3}
              dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ExpenseTrendChart;
