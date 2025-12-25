import { Box, Card, CardContent, Typography } from "@mui/material";
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

const categoryData = [
  { name: "Food & Dining", amount: 45000, color: "#667eea" },
  { name: "Transportation", amount: 28000, color: "#f59e0b" },
  { name: "Shopping", amount: 35000, color: "#22c55e" },
  { name: "Entertainment", amount: 18000, color: "#8b5cf6" },
  { name: "Bills & Utilities", amount: 32000, color: "#ef4444" },
  { name: "Healthcare", amount: 12000, color: "#ec4899" },
  { name: "Others", amount: 15000, color: "#64748b" },
];

const ReportCategories = () => {
  const total = categoryData.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Expenses by Category
      </Typography>

      <Box className="row g-3">
        <Box className="col-lg-7">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Category Breakdown</Typography>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                  <XAxis type="number" tickFormatter={(v) => `₹${v/1000}k`} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" radius={[0, 4, 4, 0]}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box className="col-lg-5">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Distribution</Typography>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    dataKey="amount"
                    paddingAngle={3}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                {categoryData.map((item) => (
                  <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: item.color }} />
                    <Typography variant="caption">{item.name}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Category Details */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>Category Details</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {categoryData.map((item) => (
              <Box key={item.name} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1, borderBottom: "1px solid #f0f0f0" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: item.color }} />
                  <Typography variant="body2">{item.name}</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round((item.amount / total) * 100)}%
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{item.amount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportCategories;
