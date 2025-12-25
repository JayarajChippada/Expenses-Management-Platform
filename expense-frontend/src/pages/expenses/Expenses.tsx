import { useState, useEffect } from "react";
import { Box, Typography, Button } from "@mui/material";
import { Add } from "@mui/icons-material";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseModal from "./components/ExpenseModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  expenseStart,
  setExpenses,
  setExpensePage,
  setExpenseFilters,
  expenseFailure,
} from "../../features/expenses/expenseSlice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

// Sample data for demo (will be replaced with API data)
const sampleExpenses = [
  { _id: "1", date: "2024-12-25", merchant: "Swiggy", categoryName: "Food & Dining", amount: 450, paymentMethod: "UPI", notes: "" },
  { _id: "2", date: "2024-12-24", merchant: "Amazon", categoryName: "Shopping", amount: 2500, paymentMethod: "Credit Card", notes: "" },
  { _id: "3", date: "2024-12-24", merchant: "Uber", categoryName: "Transportation", amount: 350, paymentMethod: "UPI", notes: "" },
  { _id: "4", date: "2024-12-23", merchant: "Netflix", categoryName: "Entertainment", amount: 649, paymentMethod: "Debit Card", notes: "" },
  { _id: "5", date: "2024-12-23", merchant: "Electricity Bill", categoryName: "Bills & Utilities", amount: 2200, paymentMethod: "Net Banking", notes: "" },
  { _id: "6", date: "2024-12-22", merchant: "Zomato", categoryName: "Food & Dining", amount: 380, paymentMethod: "UPI", notes: "" },
  { _id: "7", date: "2024-12-21", merchant: "Petrol", categoryName: "Transportation", amount: 1500, paymentMethod: "Cash", notes: "" },
  { _id: "8", date: "2024-12-20", merchant: "Flipkart", categoryName: "Shopping", amount: 3200, paymentMethod: "Credit Card", notes: "" },
  { _id: "9", date: "2024-12-19", merchant: "PVR Cinemas", categoryName: "Entertainment", amount: 800, paymentMethod: "UPI", notes: "" },
  { _id: "10", date: "2024-12-18", merchant: "Apollo Pharmacy", categoryName: "Healthcare", amount: 550, paymentMethod: "Cash", notes: "" },
];

const Expenses = () => {
  const dispatch = useAppDispatch();
  const { list, pagination, loading } = useAppSelector((state) => state.expenses);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  useEffect(() => {
    // Load sample data for demo
    dispatch(setExpenses({ data: sampleExpenses, pagination: { page: 1, limit: 10, total: 10, totalPages: 1 } }));
  }, [dispatch]);

  const fetchExpenses = async () => {
    dispatch(expenseStart());
    try {
      const response = await api.get(API_ENDPOINTS.EXPENSES.BASE, {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      dispatch(setExpenses(response.data));
    } catch (err: any) {
      dispatch(expenseFailure(err.response?.data?.message || "Failed to fetch expenses"));
      // Use sample data as fallback
      dispatch(setExpenses({ data: sampleExpenses, pagination: { page: 1, limit: 10, total: 10, totalPages: 1 } }));
    }
  };

  const handleFilterChange = (filters: any) => {
    dispatch(setExpenseFilters(filters));
  };

  const handlePageChange = (page: number) => {
    dispatch(setExpensePage(page));
  };

  const handleAddExpense = () => {
    setSelectedExpense(null);
    setModalOpen(true);
  };

  const handleEditExpense = (expense: any) => {
    setSelectedExpense(expense);
    setModalOpen(true);
  };

  const handleDeleteExpense = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    try {
      await api.delete(API_ENDPOINTS.EXPENSES.BY_ID(id));
      fetchExpenses();
    } catch (err) {
      console.error("Failed to delete expense");
    }
  };

  const handleSubmitExpense = async (data: any) => {
    try {
      if (data._id) {
        await api.put(API_ENDPOINTS.EXPENSES.BY_ID(data._id), data);
      } else {
        await api.post(API_ENDPOINTS.EXPENSES.BASE, data);
      }
      fetchExpenses();
    } catch (err) {
      console.error("Failed to save expense");
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Expenses
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddExpense}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
            },
          }}
        >
          Add Expense
        </Button>
      </Box>

      <ExpenseFilters onFilterChange={handleFilterChange} />

      <ExpenseTable
        expenses={list}
        page={pagination.page}
        limit={pagination.limit}
        total={pagination.total}
        onPageChange={handlePageChange}
        onEdit={handleEditExpense}
        onDelete={handleDeleteExpense}
      />

      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExpense}
        expense={selectedExpense}
      />
    </Box>
  );
};

export default Expenses;
