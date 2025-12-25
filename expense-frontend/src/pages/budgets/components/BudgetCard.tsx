import { Card, CardContent, Typography, Box, LinearProgress, IconButton, Chip } from "@mui/material";
import { Edit, Delete, TrendingUp } from "@mui/icons-material";

interface BudgetCardProps {
  budget: {
    _id: string;
    categoryName: string;
    budgetAmount: number;
    spent: number;
    period: { frequency: string };
  };
  onEdit: () => void;
  onDelete: () => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Food & Dining": "#667eea",
    Transportation: "#f59e0b",
    Shopping: "#22c55e",
    Entertainment: "#8b5cf6",
    "Bills & Utilities": "#ef4444",
    Healthcare: "#ec4899",
    Travel: "#06b6d4",
    Others: "#64748b",
  };
  return colors[category] || "#64748b";
};

const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const percentage = Math.min((budget.spent / budget.budgetAmount) * 100, 100);
  const isExceeded = budget.spent > budget.budgetAmount;
  const isWarning = percentage >= 80 && !isExceeded;

  const getProgressColor = () => {
    if (isExceeded) return "#ef4444";
    if (isWarning) return "#f59e0b";
    return "#22c55e";
  };

  const remaining = budget.budgetAmount - budget.spent;

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
        borderLeft: `4px solid ${getCategoryColor(budget.categoryName)}`,
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box>
            <Typography variant="h6" fontWeight={600}>
              {budget.categoryName}
            </Typography>
            <Chip
              label={budget.period.frequency}
              size="small"
              sx={{ mt: 0.5, height: 22, fontSize: 11 }}
            />
          </Box>
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton size="small" onClick={onEdit} sx={{ color: "#667eea" }}>
              <Edit fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={onDelete} sx={{ color: "#ef4444" }}>
              <Delete fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Spent
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ color: getProgressColor() }}>
              ₹{budget.spent.toLocaleString()} / ₹{budget.budgetAmount.toLocaleString()}
            </Typography>
          </Box>
          <LinearProgress
            variant="determinate"
            value={percentage}
            sx={{
              height: 10,
              borderRadius: 5,
              bgcolor: "rgba(0,0,0,0.08)",
              "& .MuiLinearProgress-bar": {
                bgcolor: getProgressColor(),
                borderRadius: 5,
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" color="text.secondary">
            {Math.round(percentage)}% used
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            {isExceeded ? (
              <Typography variant="body2" fontWeight={600} color="#ef4444">
                Exceeded by ₹{Math.abs(remaining).toLocaleString()}
              </Typography>
            ) : (
              <Typography variant="body2" fontWeight={600} color="#22c55e">
                ₹{remaining.toLocaleString()} remaining
              </Typography>
            )}
          </Box>
        </Box>

        {isExceeded && (
          <Chip
            label="Budget Exceeded!"
            size="small"
            sx={{
              mt: 1.5,
              bgcolor: "#fef2f2",
              color: "#ef4444",
              fontWeight: 500,
            }}
          />
        )}
        {isWarning && (
          <Chip
            label="Nearly Exhausted"
            size="small"
            sx={{
              mt: 1.5,
              bgcolor: "#fffbeb",
              color: "#f59e0b",
              fontWeight: 500,
            }}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetCard;
