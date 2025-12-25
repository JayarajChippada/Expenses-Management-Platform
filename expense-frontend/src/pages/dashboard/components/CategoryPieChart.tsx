import { Card, CardContent, Typography, Box } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Sample data - will be connected to Redux
const data = [
  { name: "Food & Dining", value: 3500, color: "#667eea" },
  { name: "Transportation", value: 2200, color: "#764ba2" },
  { name: "Shopping", value: 1800, color: "#22c55e" },
  { name: "Entertainment", value: 1200, color: "#f59e0b" },
  { name: "Bills & Utilities", value: 2500, color: "#ef4444" },
  { name: "Others", value: 800, color: "#8b5cf6" },
];

const CategoryPieChart = () => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card elevation={0} sx={{ height: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
          Expenses by Category
        </Typography>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [`₹${value.toLocaleString()}`, '']}
              contentStyle={{
                borderRadius: 8,
                border: "none",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Legend */}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1.5, mt: 2 }}>
          {data.map((item) => (
            <Box key={item.name} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
              <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: item.color }} />
              <Typography variant="caption" color="text.secondary">
                {item.name} ({Math.round((item.value / total) * 100)}%)
              </Typography>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CategoryPieChart;
