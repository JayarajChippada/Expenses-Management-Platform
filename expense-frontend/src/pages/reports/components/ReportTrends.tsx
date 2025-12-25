import { Box, Card, CardContent, Typography } from "@mui/material";
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

const data = [
  { month: "Jan", expenses: 35000, income: 55000 },
  { month: "Feb", expenses: 32000, income: 52000 },
  { month: "Mar", expenses: 42000, income: 58000 },
  { month: "Apr", expenses: 38000, income: 54000 },
  { month: "May", expenses: 45000, income: 62000 },
  { month: "Jun", expenses: 41000, income: 58000 },
  { month: "Jul", expenses: 39000, income: 56000 },
  { month: "Aug", expenses: 43000, income: 60000 },
  { month: "Sep", expenses: 46000, income: 64000 },
  { month: "Oct", expenses: 42000, income: 61000 },
  { month: "Nov", expenses: 48000, income: 68000 },
  { month: "Dec", expenses: 52000, income: 72000 },
];

const ReportTrends = () => {
  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Income vs Expenses Trend
      </Typography>
      
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, '']} />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} name="Income" />
              <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} name="Expenses" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <Box className="row g-3">
        <Box className="col-md-4">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Avg Monthly Income</Typography>
              <Typography variant="h5" fontWeight={700} color="#22c55e">₹59,167</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box className="col-md-4">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Avg Monthly Expenses</Typography>
              <Typography variant="h5" fontWeight={700} color="#ef4444">₹41,917</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box className="col-md-4">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">Avg Monthly Savings</Typography>
              <Typography variant="h5" fontWeight={700} color="#667eea">₹17,250</Typography>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default ReportTrends;
