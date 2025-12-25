import { Card, CardContent, Typography, Box, LinearProgress } from "@mui/material";

interface BudgetItem {
  category: string;
  spent: number;
  budget: number;
  color: string;
}

// Sample data - will be connected to Redux
const budgetData: BudgetItem[] = [
  { category: "Food & Dining", spent: 3500, budget: 4000, color: "#667eea" },
  { category: "Transportation", spent: 2200, budget: 2000, color: "#ef4444" },
  { category: "Shopping", spent: 1800, budget: 3000, color: "#22c55e" },
  { category: "Entertainment", spent: 1200, budget: 1500, color: "#f59e0b" },
  { category: "Bills & Utilities", spent: 2500, budget: 3000, color: "#8b5cf6" },
];

const BudgetUsageCard = () => {
  const getProgressColor = (spent: number, budget: number) => {
    const percentage = (spent / budget) * 100;
    if (percentage >= 100) return "#ef4444";
    if (percentage >= 80) return "#f59e0b";
    return "#22c55e";
  };

  return (
    <Card elevation={0} sx={{ height: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
          Budget Usage
        </Typography>
        
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {budgetData.map((item) => {
            const percentage = Math.min((item.spent / item.budget) * 100, 100);
            const progressColor = getProgressColor(item.spent, item.budget);
            const isExceeded = item.spent > item.budget;

            return (
              <Box key={item.category}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="body2" fontWeight={500}>
                    {item.category}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    fontWeight={600}
                    sx={{ color: isExceeded ? "#ef4444" : "text.primary" }}
                  >
                    ₹{item.spent.toLocaleString()} / ₹{item.budget.toLocaleString()}
                    {isExceeded && (
                      <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "#ef4444" }}>
                        (Exceeded!)
                      </Typography>
                    )}
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: "rgba(0,0,0,0.08)",
                    "& .MuiLinearProgress-bar": {
                      bgcolor: progressColor,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            );
          })}
        </Box>
      </CardContent>
    </Card>
  );
};

export default BudgetUsageCard;
