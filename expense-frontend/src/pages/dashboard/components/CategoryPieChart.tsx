import { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useAppSelector } from "../../../app/hooks";

interface ChartData {
  name: string;
  value: number;
  color: string;
  [key: string]: any;
}

const CategoryPieChart = () => {
  const { expensesByCategory, categories } = useAppSelector(
    (state) => state.dashboard
  );

  const chartData: ChartData[] = useMemo(() => {
    if (!expensesByCategory?.length || !categories?.length) return [];

    return expensesByCategory
      .map((item: any) => {

        const categoryName = item.category; 

        const categoryInfo = categories.find(
          (c: any) => c.categoryName === categoryName
        );
        return {
          name: categoryName,
          value: Number(item.amount) || 50,
          color: categoryInfo?.color || "#63f184ff",
        };
      })
      .filter((item) => item.value > 0);
  }, [expensesByCategory, categories]);

  const total = useMemo(
    () => chartData.reduce((sum, item) => sum + item.value, 0),
    [chartData]
  );

  if (!chartData.length) {
    return (
      <div className="card h-100 shadow-sm border-0 rounded-4">
        <div className="card-body d-flex align-items-center justify-content-center text-muted">
          No expense data available
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <h6 className="fw-bold mb-4">Expenses by Category</h6>


        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={90}
              paddingAngle={5}
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>

            <Tooltip
              formatter={(value?: number, name?: string) => {
                const safeValue = typeof value === "number" ? value : 0;
                return [`₹${safeValue.toLocaleString()}`, name ?? ""];
              }}
              contentStyle={{
                borderRadius: 12,
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-md)",
                backgroundColor: "var(--bg-card)",
                color: "var(--text-main)",
              }}
              itemStyle={{ color: "var(--text-main)" }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div
          className="d-flex flex-wrap gap-2 mt-3 overflow-auto"
          style={{ maxHeight: "100px" }}
        >
          {chartData.map((item) => (
            <div
              key={item.name}
              className="d-flex align-items-center gap-2 bg-light px-2 py-1 rounded-pill"
            >
              <span
                className="rounded-circle"
                style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: item.color,
                }}
              />
              <span className="extra-small fw-medium text-dark">
                {item.name}
              </span>
              <span className="extra-small text-muted border-start ps-2">
                ₹{item.value.toLocaleString()} (
                {total > 0 ? Math.round((item.value / total) * 100) : 0}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPieChart;
