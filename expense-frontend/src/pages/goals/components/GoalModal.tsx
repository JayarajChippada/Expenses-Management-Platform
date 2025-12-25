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

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  goal?: any;
}

const categories = [
  "Emergency Fund",
  "Vacation",
  "Car",
  "Home",
  "Education",
  "Retirement",
  "Wedding",
  "Gadgets",
  "Others",
];

const priorities = ["High", "Medium", "Low"];

const GoalModal = ({ open, onClose, onSubmit, goal }: GoalModalProps) => {
  const [formData, setFormData] = useState({
    title: "",
    categoryName: "",
    description: "",
    targetAmount: "",
    currentAmount: "",
    priority: "Medium",
    targetDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        categoryName: goal.categoryName || "",
        description: goal.description || "",
        targetAmount: goal.targetAmount?.toString() || "",
        currentAmount: goal.currentAmount?.toString() || "",
        priority: goal.priority || "Medium",
        targetDate: goal.targetDate?.split("T")[0] || "",
      });
    } else {
      setFormData({
        title: "",
        categoryName: "",
        description: "",
        targetAmount: "",
        currentAmount: "0",
        priority: "Medium",
        targetDate: "",
      });
    }
    setErrors({});
  }, [goal, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Goal title is required";
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Valid target amount is required";
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
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      status: "active",
      _id: goal?._id,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {goal ? "Edit Goal" : "Create New Goal"}
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <TextField
            label="Goal Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
            fullWidth
            placeholder="e.g., New Car, Emergency Fund"
          />
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
            label="Description (Optional)"
            name="description"
            value={formData.description}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
          />
          <TextField
            label="Target Amount (₹)"
            name="targetAmount"
            type="number"
            value={formData.targetAmount}
            onChange={handleChange}
            error={!!errors.targetAmount}
            helperText={errors.targetAmount}
            fullWidth
          />
          <TextField
            label="Current Amount (₹)"
            name="currentAmount"
            type="number"
            value={formData.currentAmount}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            select
            label="Priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            fullWidth
          >
            {priorities.map((p) => (
              <MenuItem key={p} value={p.toLowerCase()}>
                {p}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Target Date"
            name="targetDate"
            type="date"
            value={formData.targetDate}
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
          {goal ? "Update Goal" : "Create Goal"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GoalModal;
