import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";

/* Category color map (fallback-safe) */
const CATEGORY_COLORS: Record<string, string> = {
  Shopping: "#6366f1",
  Food: "#22c55e",
  Travel: "#f59e0b",
  Entertainment: "#a855f7",
  Bills: "#ef4444",
  Uncategorized: "#94a3b8",
};

const ReportCategories = () => {
  const { categories: rawCategoryData } = useAppSelector(
    (state) => state.reports
  );

  /* ============================
     NORMALIZE DATA (FIX)
  ============================ */
  const categoryData = useMemo(() => {
    if (!rawCategoryData?.length) return [];

    return rawCategoryData.map((item: any) => ({
      name: item._id, // ✅ FIX
      amount: Number(item.amount) || 0,
      count: item.count || 0,
      color: CATEGORY_COLORS[item._id] || "#6366f1",
    }));
  }, [rawCategoryData]);

  if (!categoryData.length) {
    return (
      <div className="p-5 text-center text-muted">
        <i className="bi bi-tags fs-1 d-block mb-3 opacity-25"></i>
        No category data available for this period
      </div>
    );
  }

  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div>
      <div className="row g-4 mb-4">
        {/* ============================
            BAR CHART
        ============================ */}
        <div className="col-lg-7">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 opacity-75 small text-uppercase">
                Spending by Category
              </h6>

              <div style={{ height: "300px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={categoryData}
                    layout="vertical"
                    margin={{ left: 20 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--border-color)"
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      tickFormatter={(v) => `₹${v / 1000}k`}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      type="category"
                      dataKey="name" // ✅ FIX
                      width={100}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(v?: number) => [
                        `₹${(v ?? 0).toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Bar
                      dataKey="amount"
                      radius={[0, 10, 10, 0]}
                      barSize={18}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* ============================
            PIE CHART
        ============================ */}
        <div className="col-lg-5">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 opacity-75 small text-uppercase">
                Distribution Percentage
              </h6>

              <div style={{ height: "220px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="amount"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={3}
                      stroke="none"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v?: number) => [
                        `₹${(v ?? 0).toLocaleString()}`,
                        "",
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="d-flex flex-wrap gap-2 mt-4 justify-content-center">
                {categoryData.map((item) => (
                  <div
                    key={item.name}
                    className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded-pill"
                  >
                    <span
                      className="rounded-circle"
                      style={{
                        width: 6,
                        height: 6,
                        backgroundColor: item.color,
                      }}
                    />
                    <span className="extra-small fw-bold text-muted">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============================
          TABLE
      ============================ */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white p-4">
          <h6 className="fw-bold mb-0">Detailed Category Metrics</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3">Category</th>
                <th className="text-center">Share</th>
                <th className="px-4 text-end">Amount Spent</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item) => (
                <tr key={item.name}>
                  <td className="px-4 fw-bold">{item.name}</td>
                  <td className="text-center">
                    {total > 0
                      ? Math.round((item.amount / total) * 100)
                      : 0}
                    %
                  </td>
                  <td className="px-4 text-end fw-bold">
                    ₹{item.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot className="bg-light">
              <tr>
                <td className="px-4 fw-bold">TOTAL</td>
                <td></td>
                <td className="px-4 text-end fw-bold text-primary">
                  ₹{total.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportCategories;
