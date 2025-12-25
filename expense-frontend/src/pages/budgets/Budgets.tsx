import { useState } from "react";
import { Box, Typography, Button, TextField, MenuItem } from "@mui/material";
import { Add } from "@mui/icons-material";
import BudgetCard from "./components/BudgetCard";
import BudgetModal from "./components/BudgetModal";

// Sample data with spent amounts
const sampleBudgets = [
  { _id: "1", categoryName: "Food & Dining", budgetAmount: 8000, spent: 6500, period: { frequency: "Monthly", start: "2024-12-01" } },
  { _id: "2", categoryName: "Transportation", budgetAmount: 3000, spent: 3500, period: { frequency: "Monthly", start: "2024-12-01" } },
  { _id: "3", categoryName: "Shopping", budgetAmount: 5000, spent: 2800, period: { frequency: "Monthly", start: "2024-12-01" } },
  { _id: "4", categoryName: "Entertainment", budgetAmount: 2000, spent: 1800, period: { frequency: "Monthly", start: "2024-12-01" } },
  { _id: "5", categoryName: "Bills & Utilities", budgetAmount: 5000, spent: 4200, period: { frequency: "Monthly", start: "2024-12-01" } },
  { _id: "6", categoryName: "Healthcare", budgetAmount: 2000, spent: 500, period: { frequency: "Monthly", start: "2024-12-01" } },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const years = [2023, 2024, 2025];

const Budgets = () => {
  const [budgetList, setBudgetList] = useState(sampleBudgets);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const handleAddBudget = () => {
    setSelectedBudget(null);
    setModalOpen(true);
  };

  const handleEditBudget = (budget: any) => {
    setSelectedBudget(budget);
    setModalOpen(true);
  };

  const handleDeleteBudget = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    setBudgetList((prev) => prev.filter((item) => item._id !== id));
  };

  const handleSubmitBudget = (data: any) => {
    if (data._id) {
      setBudgetList((prev) =>
        prev.map((item) => (item._id === data._id ? { ...item, ...data, spent: item.spent } : item))
      );
    } else {
      setBudgetList((prev) => [
        { ...data, _id: Date.now().toString(), spent: 0 },
        ...prev,
      ]);
    }
  };

  const totalBudget = budgetList.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgetList.reduce((sum, b) => sum + b.spent, 0);

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Budgets
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            select
            size="small"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            sx={{ minWidth: 130 }}
          >
            {months.map((month, index) => (
              <MenuItem key={month} value={index}>
                {month}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            size="small"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            sx={{ minWidth: 100 }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddBudget}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            }}
          >
            Create Budget
          </Button>
        </Box>
      </Box>

      {/* Summary */}
      <Box sx={{ display: "flex", gap: 3, mb: 4, flexWrap: "wrap" }}>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Total Budget</Typography>
          <Typography variant="h5" fontWeight={700} color="#667eea">₹{totalBudget.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Total Spent</Typography>
          <Typography variant="h5" fontWeight={700} color="#ef4444">₹{totalSpent.toLocaleString()}</Typography>
        </Box>
        <Box sx={{ bgcolor: "#f8fafc", px: 3, py: 2, borderRadius: 2, minWidth: 180 }}>
          <Typography variant="body2" color="text.secondary">Remaining</Typography>
          <Typography variant="h5" fontWeight={700} color="#22c55e">₹{(totalBudget - totalSpent).toLocaleString()}</Typography>
        </Box>
      </Box>

      {/* Budget Cards Grid */}
      <Box className="row g-3">
        {budgetList.map((budget) => (
          <Box key={budget._id} className="col-12 col-md-6 col-lg-4">
            <BudgetCard
              budget={budget}
              onEdit={() => handleEditBudget(budget)}
              onDelete={() => handleDeleteBudget(budget._id)}
            />
          </Box>
        ))}
      </Box>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitBudget}
        budget={selectedBudget}
      />
    </Box>
  );
};

export default Budgets;
