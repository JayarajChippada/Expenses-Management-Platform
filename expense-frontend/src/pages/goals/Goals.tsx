import { useState } from "react";
import { Box, Typography, Button, Tabs, Tab } from "@mui/material";
import { Add } from "@mui/icons-material";
import GoalCard from "./components/GoalCard";
import GoalModal from "./components/GoalModal";

// Sample data
const sampleGoals = [
  { _id: "1", title: "Emergency Fund", categoryName: "Emergency Fund", description: "6 months of expenses", targetAmount: 200000, currentAmount: 150000, status: "active" as const, priority: "high" as const, targetDate: "2025-06-01" },
  { _id: "2", title: "Goa Vacation", categoryName: "Vacation", description: "Family trip to Goa", targetAmount: 50000, currentAmount: 50000, status: "completed" as const, priority: "medium" as const, targetDate: "2024-12-25" },
  { _id: "3", title: "New Laptop", categoryName: "Gadgets", description: "MacBook Pro for work", targetAmount: 150000, currentAmount: 45000, status: "active" as const, priority: "medium" as const, targetDate: "2025-03-01" },
  { _id: "4", title: "Home Down Payment", categoryName: "Home", description: "2BHK apartment", targetAmount: 1000000, currentAmount: 250000, status: "active" as const, priority: "high" as const, targetDate: "2026-01-01" },
  { _id: "5", title: "Masters Degree", categoryName: "Education", description: "MBA program fees", targetAmount: 500000, currentAmount: 100000, status: "active" as const, priority: "low" as const, targetDate: "2025-08-01" },
];

const Goals = () => {
  const [goalList, setGoalList] = useState(sampleGoals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<any>(null);
  const [activeTab, setActiveTab] = useState(0);

  const activeGoals = goalList.filter((g) => g.status === "active" && g.currentAmount < g.targetAmount);
  const completedGoals = goalList.filter((g) => g.status === "completed" || g.currentAmount >= g.targetAmount);

  const displayedGoals = activeTab === 0 ? activeGoals : completedGoals;

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setModalOpen(true);
  };

  const handleEditGoal = (goal: any) => {
    setSelectedGoal(goal);
    setModalOpen(true);
  };

  const handleDeleteGoal = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    setGoalList((prev) => prev.filter((item) => item._id !== id));
  };

  const handleSubmitGoal = (data: any) => {
    if (data._id) {
      setGoalList((prev) =>
        prev.map((item) => (item._id === data._id ? { ...item, ...data } : item))
      );
    } else {
      setGoalList((prev) => [
        { ...data, _id: Date.now().toString() },
        ...prev,
      ]);
    }
  };

  const totalTarget = goalList.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goalList.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Financial Goals
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddGoal}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          Add Goal
        </Button>
      </Box>

      {/* Summary */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Total Goals</Typography>
          <Typography variant="h5" fontWeight={700} color="#667eea">{goalList.length}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Total Target</Typography>
          <Typography variant="h5" fontWeight={700}>₹{totalTarget.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Total Saved</Typography>
          <Typography variant="h5" fontWeight={700} color="#22c55e">₹{totalSaved.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Completed</Typography>
          <Typography variant="h5" fontWeight={700} color="#8b5cf6">{completedGoals.length}</Typography>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{ mb: 3, borderBottom: "1px solid rgba(0,0,0,0.08)" }}
      >
        <Tab label={`Active (${activeGoals.length})`} sx={{ textTransform: "none" }} />
        <Tab label={`Completed (${completedGoals.length})`} sx={{ textTransform: "none" }} />
      </Tabs>

      {/* Goal Cards Grid */}
      <Box className="row g-3">
        {displayedGoals.length === 0 ? (
          <Box className="col-12">
            <Typography color="text.secondary" sx={{ textAlign: "center", py: 4 }}>
              No {activeTab === 0 ? "active" : "completed"} goals found
            </Typography>
          </Box>
        ) : (
          displayedGoals.map((goal) => (
            <Box key={goal._id} className="col-12 col-md-6 col-lg-4">
              <GoalCard
                goal={goal}
                onEdit={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal._id)}
              />
            </Box>
          ))
        )}
      </Box>

      <GoalModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitGoal}
        goal={selectedGoal}
      />
    </Box>
  );
};

export default Goals;
