import { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  InputAdornment,
  Button,
} from "@mui/material";
import { Search, FilterList, Clear } from "@mui/icons-material";

interface ExpenseFiltersProps {
  onFilterChange: (filters: any) => void;
}

const categories = [
  "All Categories",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Bills & Utilities",
  "Healthcare",
  "Travel",
  "Others",
];

const dateRanges = [
  { label: "All Time", value: "all" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "3months" },
  { label: "This Year", value: "year" },
];

const ExpenseFilters = ({ onFilterChange }: ExpenseFiltersProps) => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [dateRange, setDateRange] = useState("all");

  const handleSearchChange = (value: string) => {
    setSearch(value);
    onFilterChange({ search: value, category, dateRange });
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    onFilterChange({ search, category: value, dateRange });
  };

  const handleDateRangeChange = (value: string) => {
    setDateRange(value);
    onFilterChange({ search, category, dateRange: value });
  };

  const clearFilters = () => {
    setSearch("");
    setCategory("All Categories");
    setDateRange("all");
    onFilterChange({ search: "", category: "All Categories", dateRange: "all" });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        mb: 3,
        alignItems: "center",
      }}
    >
      <TextField
        size="small"
        placeholder="Search expenses..."
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
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
        onChange={(e) => handleCategoryChange(e.target.value)}
        sx={{ minWidth: 180 }}
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        value={dateRange}
        onChange={(e) => handleDateRangeChange(e.target.value)}
        sx={{ minWidth: 150 }}
      >
        {dateRanges.map((range) => (
          <MenuItem key={range.value} value={range.value}>
            {range.label}
          </MenuItem>
        ))}
      </TextField>

      <Button
        variant="outlined"
        size="small"
        startIcon={<Clear />}
        onClick={clearFilters}
        sx={{
          textTransform: "none",
          borderColor: "divider",
          color: "text.secondary",
          "&:hover": { borderColor: "#667eea", color: "#667eea" },
        }}
      >
        Clear
      </Button>
    </Box>
  );
};

export default ExpenseFilters;
