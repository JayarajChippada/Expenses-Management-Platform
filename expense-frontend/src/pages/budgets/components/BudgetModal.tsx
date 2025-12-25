import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  budget?: any;
}

const categories = [
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Others",
];

const frequencies = ["Monthly", "Weekly", "Yearly"];

const BudgetModal = ({ open, onClose, onSubmit, budget }: BudgetModalProps) => {
  const [formData, setFormData] = useState({
    categoryName: "",
    budgetAmount: "",
    frequency: "Monthly",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (budget) {
      setFormData({
        categoryName: budget.categoryName || "",
        budgetAmount: budget.budgetAmount?.toString() || "",
        frequency: budget.period?.frequency || "Monthly",
        startDate: budget.period?.start?.split("T")[0] || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        categoryName: "",
        budgetAmount: "",
        frequency: "Monthly",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [budget, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      newErrors.budgetAmount = "Valid budget amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = () => {
    if (!validateForm()) return;
    onSubmit({
      categoryName: formData.categoryName,
      budgetAmount: parseFloat(formData.budgetAmount),
      period: {
        frequency: formData.frequency,
        start: formData.startDate,
      },
      _id: budget?._id,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {budget ? "Edit Budget" : "Create New Budget"}
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <TextField
            select
            label="Category"
            name="categoryName"
            value={formData.categoryName}
            onChange={handleChange}
            error={!!errors.categoryName}
            helperText={errors.categoryName}
            fullWidth
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Budget Amount (₹)"
            name="budgetAmount"
            type="number"
            value={formData.budgetAmount}
            onChange={handleChange}
            error={!!errors.budgetAmount}
            helperText={errors.budgetAmount}
            fullWidth
            placeholder="Enter budget amount"
          />
          <TextField
            select
            label="Frequency"
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            fullWidth
          >
            {frequencies.map((freq) => (
              <MenuItem key={freq} value={freq}>
                {freq}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Start Date"
            name="startDate"
            type="date"
            value={formData.startDate}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            textTransform: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {budget ? "Update Budget" : "Create Budget"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default BudgetModal;
