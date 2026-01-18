import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  categoryStart,
  categoryFailure,
  categoryNamesSuccess,
} from "../../../store/slices/category.slice";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";

interface IncomeFiltersProps {
  onFilterChange: (filters: any) => void;
}

const dateRanges = [
  { label: "All Time", value: "ALL" },
  { label: "Today", value: "TODAY" },
  { label: "Yesterday", value: "YESTERDAY" },
  { label: "Last 1 Month", value: "1M" },
  { label: "Last 3 Months", value: "3M" },
  { label: "Last 6 Months", value: "6M" },
  { label: "Last Year", value: "1Y" },
];

const IncomeFilters = ({ onFilterChange }: IncomeFiltersProps) => {
  const dispatch = useAppDispatch();
  const { names: categories } = useAppSelector((state) => state.categories);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [dateRange, setDateRange] = useState("ALL");

  const fetchNames = useCallback(async () => {
    dispatch(categoryStart());
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.NAMES("income"));
      dispatch(categoryNamesSuccess(response.data.data));
    } catch (error: any) {
      dispatch(
        categoryFailure(
          error.response?.data?.message || "Failed to fetch categories"
        )
      );
    }
  }, [dispatch]);

  useEffect(() => {
    fetchNames();
  }, [fetchNames]);

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
    setCategory("");
    setDateRange("ALL");
    onFilterChange({ search: "", category: "", dateRange: "ALL" });
  };

  return (
    <div className="row g-3 align-items-center">
      <div className="col-12 col-md-4">
        <div
          className="input-group search-input-group border w-100"
          style={{ background: "#fff" }}
        >
          <span className="input-group-text bg-transparent border-0 ps-3">
            <i className="bi bi-search text-muted small"></i>
          </span>
          <input
            type="text"
            className="form-control border-0 bg-transparent"
            placeholder="Search income..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <select
          className="form-select border-light-subtle rounded-3"
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 col-sm-6 col-md-3">
        <select
          className="form-select border-light-subtle rounded-3"
          value={dateRange}
          onChange={(e) => handleDateRangeChange(e.target.value)}
        >
          {dateRanges.map((range) => (
            <option key={range.value} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      <div className="col-12 col-md-2">
        <button
          className="btn btn-outline-light text-muted border-light-subtle w-100 d-flex align-items-center justify-content-center gap-2 rounded-3"
          onClick={clearFilters}
        >
          <i className="bi bi-x-circle"></i>
          Reset
        </button>
      </div>
    </div>
  );
};

export default IncomeFilters;
