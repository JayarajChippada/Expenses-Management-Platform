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

interface IncomeModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  income?: any;
}

const categories = [
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental Income",
  "Dividends",
  "Bonus",
  "Others",
];

const paymentMethods = ["Bank Transfer", "Cash", "Cheque", "UPI", "Net Banking"];

const IncomeModal = ({ open, onClose, onSubmit, income }: IncomeModalProps) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    source: "",
    categoryName: "",
    amount: "",
    paymentMethod: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (income) {
      setFormData({
        date: income.date?.split("T")[0] || new Date().toISOString().split("T")[0],
        source: income.source || "",
        categoryName: income.categoryName || "",
        amount: income.amount?.toString() || "",
        paymentMethod: income.paymentMethod || "",
        notes: income.notes || "",
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        source: "",
        categoryName: "",
        amount: "",
        paymentMethod: "",
        notes: "",
      });
    }
    setErrors({});
  }, [income, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.source.trim()) newErrors.source = "Source is required";
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
    }
    if (!formData.paymentMethod) newErrors.paymentMethod = "Payment method is required";
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
      amount: parseFloat(formData.amount),
      _id: income?._id,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {income ? "Edit Income" : "Add New Income"}
        <IconButton size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, pt: 1 }}>
          <TextField
            label="Date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            error={!!errors.date}
            helperText={errors.date}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Source / Description"
            name="source"
            value={formData.source}
            onChange={handleChange}
            error={!!errors.source}
            helperText={errors.source}
            fullWidth
            placeholder="e.g., Company Name, Client Name"
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
            label="Amount (₹)"
            name="amount"
            type="number"
            value={formData.amount}
            onChange={handleChange}
            error={!!errors.amount}
            helperText={errors.amount}
            fullWidth
            placeholder="Enter amount"
          />
          <TextField
            select
            label="Payment Method"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            error={!!errors.paymentMethod}
            helperText={errors.paymentMethod}
            fullWidth
          >
            {paymentMethods.map((method) => (
              <MenuItem key={method} value={method}>
                {method}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Notes (Optional)"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            fullWidth
            multiline
            rows={2}
            placeholder="Add any notes..."
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
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
          }}
        >
          {income ? "Update Income" : "Add Income"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default IncomeModal;
