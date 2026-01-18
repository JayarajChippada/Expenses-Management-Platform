import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useAppSelector } from "../../../store/hooks";
import { useMemo } from "react";

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Shopping: "#22c55e",
    Food: "#6366f1",
    Transportation: "#f59e0b",
    Entertainment: "#a855f7",
    Bills: "#ef4444",
    Healthcare: "#ec4899",
  };
  return colors[category] || "#64748b";
};

const formatCurrency = (value: number) =>
  value >= 1000 ? `₹${(value / 1000).toFixed(1)}k` : `₹${value}`;

const ReportMerchants = () => {
  const { merchants: merchantData } = useAppSelector((state) => state.reports);

  // Top 5 merchants by spending
  const topMerchants = useMemo(
    () => [...merchantData].sort((a, b) => b.amount - a.amount).slice(0, 5),
    [merchantData]
  );

  const totalSpent = merchantData.reduce((sum, m) => sum + (m.amount || 0), 0);

  const totalTransactions = merchantData.reduce(
    (sum, m) => sum + (m.count || 0),
    0
  );

  if (!merchantData || merchantData.length === 0) {
    return (
      <div className="p-5 text-center text-muted">
        <i className="bi bi-shop-window fs-1 d-block mb-3 opacity-25"></i>
        No merchant data available for this period
      </div>
    );
  }

  return (
    <div>
      <div className="row g-4 mb-4">
        {/* BAR CHART */}
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-white border-bottom-0 p-4">
              <h6 className="fw-bold mb-0">Top 5 Merchants by Spending</h6>
            </div>
            <div className="card-body p-4 pt-0">
              <div style={{ height: "280px" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topMerchants}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="_id"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 13, fontWeight: "bold" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={formatCurrency}
                      tick={{ fontSize: 12 }}
                    />
                    <Tooltip
                      formatter={(v: any) => [
                        `₹${Number(v).toLocaleString()}`,
                        "Amount",
                      ]}
                    />
                    <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={40}>
                      {topMerchants.map((m, index) => (
                        <Cell
                          key={m._id}
                          fill={
                            index === 0
                              ? "var(--primary-color)"
                              : getCategoryColor(m.categoryName)
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* SUMMARY CARDS */}
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4 small text-uppercase opacity-75">
                Activity Highlights
              </h6>

              <div className="d-flex flex-column gap-4">
                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-4 bg-primary-subtle p-3">
                    <i className="bi bi-shop-window fs-4"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">
                      Merchants Transacted
                    </div>
                    <div className="h4 fw-bold mb-0">{merchantData.length}</div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-4 bg-danger-subtle p-3">
                    <i className="bi bi-cart-x fs-4 text-danger"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">
                      Total Net Spent
                    </div>
                    <div className="h4 fw-bold mb-0 text-danger">
                      ₹{totalSpent.toLocaleString()}
                    </div>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div className="rounded-4 bg-success-subtle p-3">
                    <i className="bi bi-arrow-repeat fs-4 text-success"></i>
                  </div>
                  <div>
                    <div className="text-muted small fw-bold">
                      Total Frequency
                    </div>
                    <div className="h4 fw-bold mb-0 text-success">
                      {totalTransactions}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MERCHANT TABLE */}
      <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-white border-bottom-0 p-4">
          <h6 className="fw-bold mb-0">Full Merchant Tracking List</h6>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light">
              <tr>
                <th className="px-4 py-3 text-uppercase small">
                  Merchant Name
                </th>
                <th className="py-3 text-uppercase small">Primary Category</th>
                <th className="py-3 text-uppercase small text-center">
                  Frequency
                </th>
                <th className="px-4 py-3 text-uppercase small text-end">
                  Net Spend
                </th>
              </tr>
            </thead>
            <tbody>
              {merchantData.map((merchant: any) => (
                <tr key={merchant._id}>
                  <td className="px-4 fw-bold">{merchant._id}</td>
                  <td>
                    <span
                      className="badge rounded-pill"
                      style={{
                        backgroundColor: `${getCategoryColor(
                          merchant.categoryName
                        )}20`,
                        color: getCategoryColor(merchant.categoryName),
                      }}
                    >
                      {merchant.categoryName}
                    </span>
                  </td>
                  <td className="text-center">{merchant.count} txns</td>
                  <td className="px-4 text-end fw-bold">
                    ₹{merchant.amount.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportMerchants;
