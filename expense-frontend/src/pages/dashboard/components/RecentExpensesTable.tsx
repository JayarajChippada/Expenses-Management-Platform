import { Card, CardContent, Typography, Box, Chip, IconButton } from "@mui/material";
import { MoreVert, TrendingUp, TrendingDown } from "@mui/icons-material";

interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: string;
  amount: number;
  type: "expense" | "income";
}

// Sample data - will be connected to Redux
const transactions: Transaction[] = [
  { id: "1", date: "Dec 25", merchant: "Swiggy", category: "Food", amount: 450, type: "expense" },
  { id: "2", date: "Dec 24", merchant: "Amazon", category: "Shopping", amount: 2500, type: "expense" },
  { id: "3", date: "Dec 24", merchant: "Salary", category: "Income", amount: 50000, type: "income" },
  { id: "4", date: "Dec 23", merchant: "Uber", category: "Transport", amount: 350, type: "expense" },
  { id: "5", date: "Dec 23", merchant: "Netflix", category: "Entertainment", amount: 649, type: "expense" },
  { id: "6", date: "Dec 22", merchant: "Freelance", category: "Income", amount: 15000, type: "income" },
];

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Food: "#667eea",
    Shopping: "#22c55e",
    Income: "#10b981",
    Transport: "#f59e0b",
    Entertainment: "#8b5cf6",
    Bills: "#ef4444",
  };
  return colors[category] || "#64748b";
};

const RecentExpensesTable = () => {
  return (
    <Card elevation={0} sx={{ height: "100%", boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography variant="h6" fontWeight={600}>
            Recent Transactions
          </Typography>
          <IconButton size="small">
            <MoreVert />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {transactions.map((tx, index) => (
            <Box
              key={tx.id}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                py: 1.5,
                borderBottom: index < transactions.length - 1 ? "1px solid rgba(0,0,0,0.06)" : "none",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    bgcolor: tx.type === "income" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  }}
                >
                  {tx.type === "income" ? (
                    <TrendingUp sx={{ fontSize: 18, color: "#22c55e" }} />
                  ) : (
                    <TrendingDown sx={{ fontSize: 18, color: "#ef4444" }} />
                  )}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={500}>
                    {tx.merchant}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {tx.date}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: "right" }}>
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: tx.type === "income" ? "#22c55e" : "#ef4444" }}
                >
                  {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                </Typography>
                <Chip
                  label={tx.category}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: `${getCategoryColor(tx.category)}15`,
                    color: getCategoryColor(tx.category),
                    fontWeight: 500,
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentExpensesTable;
