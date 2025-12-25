import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { Add, Edit, Delete, Search, Clear } from "@mui/icons-material";
import IncomeModal from "./components/IncomeModal";

// Sample data for demo
const sampleIncome = [
  { _id: "1", date: "2024-12-25", source: "Monthly Salary", categoryName: "Salary", amount: 50000, paymentMethod: "Bank Transfer", notes: "" },
  { _id: "2", date: "2024-12-20", source: "Freelance Project", categoryName: "Freelance", amount: 15000, paymentMethod: "UPI", notes: "" },
  { _id: "3", date: "2024-12-15", source: "Stock Dividend", categoryName: "Dividends", amount: 2500, paymentMethod: "Bank Transfer", notes: "" },
  { _id: "4", date: "2024-12-10", source: "Rental Income", categoryName: "Rental Income", amount: 18000, paymentMethod: "Net Banking", notes: "" },
  { _id: "5", date: "2024-12-05", source: "Year-end Bonus", categoryName: "Bonus", amount: 25000, paymentMethod: "Bank Transfer", notes: "" },
  { _id: "6", date: "2024-11-25", source: "Consulting Fee", categoryName: "Freelance", amount: 8000, paymentMethod: "UPI", notes: "" },
  { _id: "7", date: "2024-11-20", source: "Interest Income", categoryName: "Investments", amount: 3200, paymentMethod: "Bank Transfer", notes: "" },
];

const categories = [
  "All Categories",
  "Salary",
  "Freelance",
  "Business",
  "Investments",
  "Rental Income",
  "Dividends",
  "Bonus",
  "Others",
];

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Salary: "#22c55e",
    Freelance: "#667eea",
    Business: "#f59e0b",
    Investments: "#8b5cf6",
    "Rental Income": "#06b6d4",
    Dividends: "#ec4899",
    Bonus: "#10b981",
    Others: "#64748b",
  };
  return colors[category] || "#64748b";
};

const Income = () => {
  const [incomeList, setIncomeList] = useState(sampleIncome);
  const [page, setPage] = useState(0);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");

  const filteredIncome = incomeList.filter((item) => {
    const matchesSearch = item.source.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All Categories" || item.categoryName === category;
    return matchesSearch && matchesCategory;
  });

  const handleAddIncome = () => {
    setSelectedIncome(null);
    setModalOpen(true);
  };

  const handleEditIncome = (income: any) => {
    setSelectedIncome(income);
    setModalOpen(true);
  };

  const handleDeleteIncome = (id: string) => {
    if (!window.confirm("Are you sure you want to delete this income?")) return;
    setIncomeList((prev) => prev.filter((item) => item._id !== id));
  };

  const handleSubmitIncome = (data: any) => {
    if (data._id) {
      setIncomeList((prev) =>
        prev.map((item) => (item._id === data._id ? { ...item, ...data } : item))
      );
    } else {
      setIncomeList((prev) => [
        { ...data, _id: Date.now().toString() },
        ...prev,
      ]);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h5" fontWeight={600}>
          Income
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleAddIncome}
          sx={{
            textTransform: "none",
            borderRadius: 2,
            background: "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #16a34a 0%, #15803d 100%)",
            },
          }}
        >
          Add Income
        </Button>
      </Box>

      {/* Filters */}
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mb: 3 }}>
        <TextField
          size="small"
          placeholder="Search income..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 250, flexGrow: 1, maxWidth: 350 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
        />
        <TextField
          select
          size="small"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          sx={{ minWidth: 180 }}
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Clear />}
          onClick={clearFilters}
          sx={{ textTransform: "none", borderColor: "divider", color: "text.secondary" }}
        >
          Clear
        </Button>
      </Box>

      {/* Table */}
      <Paper elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", borderRadius: 2 }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#f8fafc" }}>
                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Source</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="right">Amount</TableCell>
                <TableCell sx={{ fontWeight: 600 }} align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredIncome.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                    <Typography color="text.secondary">No income records found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredIncome.slice(page * 10, page * 10 + 10).map((income) => (
                  <TableRow key={income._id} sx={{ "&:hover": { bgcolor: "#f8fafc" } }}>
                    <TableCell>
                      {new Date(income.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        {income.source}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={income.categoryName}
                        size="small"
                        sx={{
                          bgcolor: `${getCategoryColor(income.categoryName)}15`,
                          color: getCategoryColor(income.categoryName),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>{income.paymentMethod}</TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight={600} color="#22c55e">
                        +₹{income.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton size="small" onClick={() => handleEditIncome(income)} sx={{ color: "#667eea" }}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteIncome(income._id)} sx={{ color: "#ef4444" }}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={filteredIncome.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={10}
          rowsPerPageOptions={[10]}
          sx={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}
        />
      </Paper>

      <IncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitIncome}
        income={selectedIncome}
      />
    </Box>
  );
};

export default Income;
