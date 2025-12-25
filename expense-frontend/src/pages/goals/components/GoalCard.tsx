import { Card, CardContent, Typography, Box, LinearProgress, IconButton, Chip } from "@mui/material";
import { Edit, Delete, Flag, CheckCircle } from "@mui/icons-material";

interface GoalCardProps {
  goal: {
    _id: string;
    title: string;
    categoryName: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    status: "active" | "completed";
    priority: "high" | "medium" | "low";
    targetDate?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Emergency Fund": "#ef4444",
    Vacation: "#06b6d4",
    Car: "#f59e0b",
    Home: "#22c55e",
    Education: "#667eea",
    Retirement: "#8b5cf6",
    Wedding: "#ec4899",
    Gadgets: "#64748b",
    Others: "#6b7280",
  };
  return colors[category] || "#6b7280";
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };
  return colors[priority] || "#6b7280";
};

const GoalCard = ({ goal, onEdit, onDelete }: GoalCardProps) => {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.status === "completed" || goal.currentAmount >= goal.targetAmount;
  const remaining = goal.targetAmount - goal.currentAmount;

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
        position: "relative",
        overflow: "visible",
      }}
    >
      {isCompleted && (
        <Box
          sx={{
            position: "absolute",
            top: -8,
            right: -8,
            bgcolor: "#22c55e",
            borderRadius: "50%",
            p: 0.5,
          }}
        >
          <CheckCircle sx={{ color: "white", fontSize: 24 }} />
        </Box>
      )}
      
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
              <Flag sx={{ fontSize: 18, color: getPriorityColor(goal.priority) }} />
              <Chip
                label={goal.priority}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 10,
                  textTransform: "capitalize",
                  bgcolor: `${getPriorityColor(goal.priority)}15`,
                  color: getPriorityColor(goal.priority),
                  fontWeight: 600,
                }}
              />
            </Box>
            <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
              {goal.title}
            </Typography>
            <Chip
              label={goal.categoryName}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: `${getCategoryColor(goal.categoryName)}15`,
                color: getCategoryColor(goal.categoryName),
              }}
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

        {goal.description && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {goal.description}
          </Typography>
        )}

        <Box sx={{ mb: 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              Progress
            </Typography>
            <Typography variant="body2" fontWeight={600}>
              {Math.round(percentage)}%
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
                bgcolor: isCompleted ? "#22c55e" : "#667eea",
                borderRadius: 5,
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" color="text.secondary">Saved</Typography>
            <Typography variant="body2" fontWeight={600} color="#22c55e">
              ₹{goal.currentAmount.toLocaleString()}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary">Target</Typography>
            <Typography variant="body2" fontWeight={600}>
              ₹{goal.targetAmount.toLocaleString()}
            </Typography>
          </Box>
        </Box>

        {goal.targetDate && (
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1.5 }}>
            Target: {new Date(goal.targetDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default GoalCard;
