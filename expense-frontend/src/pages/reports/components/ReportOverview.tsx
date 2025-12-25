import { Box, Card, CardContent, Typography } from "@mui/material";
import { TrendingUp, TrendingDown, AccountBalanceWallet, Receipt } from "@mui/icons-material";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const monthlyData = [
  { month: "Jan", expenses: 35000, income: 55000, savings: 20000 },
  { month: "Feb", expenses: 32000, income: 52000, savings: 20000 },
  { month: "Mar", expenses: 42000, income: 58000, savings: 16000 },
  { month: "Apr", expenses: 38000, income: 54000, savings: 16000 },
  { month: "May", expenses: 45000, income: 62000, savings: 17000 },
  { month: "Jun", expenses: 41000, income: 58000, savings: 17000 },
];

const categoryData = [
  { name: "Food & Dining", value: 28, color: "#667eea" },
  { name: "Transportation", value: 18, color: "#f59e0b" },
  { name: "Shopping", value: 22, color: "#22c55e" },
  { name: "Entertainment", value: 12, color: "#8b5cf6" },
  { name: "Bills", value: 20, color: "#ef4444" },
];

const ReportOverview = () => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Financial Overview
      </Typography>

      {/* Summary Cards */}
      <Box className="row g-3 mb-4">
        <Box className="col-6 col-lg-3">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Income</Typography>
                  <Typography variant="h5" fontWeight={700} color="#22c55e">₹3.39L</Typography>
                  <Typography variant="caption" color="#22c55e">+12% from last period</Typography>
                </Box>
                <TrendingUp sx={{ color: "#22c55e", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box className="col-6 col-lg-3">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Expenses</Typography>
                  <Typography variant="h5" fontWeight={700} color="#ef4444">₹2.33L</Typography>
                  <Typography variant="caption" color="#ef4444">+8% from last period</Typography>
                </Box>
                <TrendingDown sx={{ color: "#ef4444", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box className="col-6 col-lg-3">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Net Savings</Typography>
                  <Typography variant="h5" fontWeight={700} color="#667eea">₹1.06L</Typography>
                  <Typography variant="caption" color="#667eea">31% savings rate</Typography>
                </Box>
                <AccountBalanceWallet sx={{ color: "#667eea", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
        <Box className="col-6 col-lg-3">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Transactions</Typography>
                  <Typography variant="h5" fontWeight={700}>248</Typography>
                  <Typography variant="caption" color="text.secondary">This period</Typography>
                </Box>
                <Receipt sx={{ color: "#64748b", fontSize: 32 }} />
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Charts Row */}
      <Box className="row g-3">
        <Box className="col-lg-8">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Income vs Expenses vs Savings</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
                  <Area type="monotone" dataKey="income" stackId="1" stroke="#22c55e" fill="#22c55e40" />
                  <Area type="monotone" dataKey="expenses" stackId="2" stroke="#ef4444" fill="#ef444440" />
                  <Area type="monotone" dataKey="savings" stackId="3" stroke="#667eea" fill="#667eea40" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>
        <Box className="col-lg-4">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Expense Distribution</Typography>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" outerRadius={70} dataKey="value" paddingAngle={3}>
                    {categoryData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => [`${v}%`, '']} />
                </PieChart>
              </ResponsiveContainer>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
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
    </Box>
  );
};

export default ReportOverview;
