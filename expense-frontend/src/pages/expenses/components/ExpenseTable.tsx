import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Box,
  TablePagination,
  Typography,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

interface Expense {
  _id: string;
  date: string;
  merchant: string;
  categoryName: string;
  amount: number;
  paymentMethod: string;
  notes?: string;
}

interface ExpenseTableProps {
  expenses: Expense[];
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
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

const getPaymentMethodColor = (method: string): string => {
  const colors: Record<string, string> = {
    Cash: "#22c55e",
    "Credit Card": "#667eea",
    "Debit Card": "#f59e0b",
    UPI: "#8b5cf6",
    "Net Banking": "#06b6d4",
  };
  return colors[method] || "#64748b";
};

const ExpenseTable = ({
  expenses,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onDelete,
}: ExpenseTableProps) => {
  const handleChangePage = (_: unknown, newPage: number) => {
    onPageChange(newPage + 1);
  };

  return (
    <Paper elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f8fafc" }}>
              <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Merchant</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
              <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
              <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {expenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography color="text.secondary">No expenses found</Typography>
                </TableCell>
              </TableRow>
            ) : (
              expenses.map((expense) => (
                <TableRow
                  key={expense._id}
                  sx={{
                    "&:hover": { bgcolor: "#f8fafc" },
                    transition: "background-color 0.2s",
                  }}
                >
                  <TableCell>
                    <Typography variant="body2">
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>
                      {expense.merchant}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expense.categoryName}
                      size="small"
                      sx={{
                        bgcolor: `${getCategoryColor(expense.categoryName)}15`,
                        color: getCategoryColor(expense.categoryName),
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={expense.paymentMethod}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderColor: getPaymentMethodColor(expense.paymentMethod),
                        color: getPaymentMethodColor(expense.paymentMethod),
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={600} color="#ef4444">
                      -₹{expense.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 0.5 }}>
                      <IconButton
                        size="small"
                        onClick={() => onEdit(expense)}
                        sx={{ color: "#667eea" }}
                      >
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => onDelete(expense._id)}
                        sx={{ color: "#ef4444" }}
                      >
                        <Delete fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={total}
        page={page - 1}
        onPageChange={handleChangePage}
        rowsPerPage={limit}
        rowsPerPageOptions={[10]}
        sx={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
      />
    </Paper>
  );
};

export default ExpenseTable;
