import { Card, CardContent, Typography, Box } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Sample data - will be connected to Redux
const data = [
  { month: "Jan", expenses: 4000, income: 6000 },
  { month: "Feb", expenses: 3500, income: 5800 },
  { month: "Mar", expenses: 4200, income: 6200 },
  { month: "Apr", expenses: 3800, income: 5500 },
  { month: "May", expenses: 4500, income: 6800 },
  { month: "Jun", expenses: 4100, income: 6100 },
  { month: "Jul", expenses: 3900, income: 5900 },
  { month: "Aug", expenses: 4300, income: 6400 },
  { month: "Sep", expenses: 4600, income: 6700 },
  { month: "Oct", expenses: 4200, income: 6300 },
  { month: "Nov", expenses: 4800, income: 7000 },
  { month: "Dec", expenses: 5200, income: 7500 },
];

const ExpenseTrendChart = () => {
  return (
    <Card elevation={0} sx={{ height: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            Monthly Expense Trend
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#667eea" }} />
              <Typography variant="caption" color="text.secondary">Expenses</Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: "#22c55e" }} />
              <Typography variant="caption" color="text.secondary">Income</Typography>
            </Box>
          </Box>
        </Box>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: "#888" }}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false}
              tick={{ fontSize: 12, fill: "#888" }}
              tickFormatter={(value) => `₹${value / 1000}k`}
            />
            <Tooltip 
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              contentStyle={{ 
                borderRadius: 8, 
                border: "none", 
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)" 
              }}
            />
            <Line
              type="monotone"
              dataKey="expenses"
              stroke="#667eea"
              strokeWidth={3}
              dot={{ fill: "#667eea", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="income"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ fill: "#22c55e", strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ExpenseTrendChart;
