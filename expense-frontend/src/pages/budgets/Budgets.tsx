import { useState, useEffect, useCallback } from "react";
import BudgetCard from "./components/BudgetCard";
import BudgetModal from "./components/BudgetModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { 
  budgetStart, 
  budgetSuccess, 
  budgetFailure, 
  createBudgetSuccess, 
  updateBudgetSuccess, 
  deleteBudgetSuccess,
  setBudgetFilters
} from "../../features/budgets/budgetSlice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];

const Budgets = () => {
  const dispatch = useAppDispatch();
  const { list: budgetList, loading, filters, error } = useAppSelector((state) => state.budgets);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<any>(null);

  const fetchBudgets = useCallback(async () => {
    dispatch(budgetStart());
    try {
      const response = await api.get(API_ENDPOINTS.BUDGETS.BASE, { params: filters });
      dispatch(budgetSuccess({ data: response.data.data || response.data }));
    } catch (err: any) {
      dispatch(budgetFailure(err.response?.data?.message || "Failed to fetch budgets"));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchBudgets();
  }, [fetchBudgets]);

  const handleCreateBudget = () => {
    setSelectedBudget(null);
    setModalOpen(true);
  };

  const handleEditBudget = (budget: any) => {
    setSelectedBudget(budget);
    setModalOpen(true);
  };

  const handleDeleteBudget = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this budget?")) return;
    dispatch(budgetStart());
    try {
      await api.delete(API_ENDPOINTS.BUDGETS.BY_ID(id));
      dispatch(deleteBudgetSuccess(id));
      fetchBudgets();
    } catch (err: any) {
      dispatch(budgetFailure(err.response?.data?.message || "Failed to delete budget"));
    }
  };

  const handleSubmitBudget = async (data: any) => {
    dispatch(budgetStart());
    try {
      if (data._id) {
        const response = await api.patch(API_ENDPOINTS.BUDGETS.BY_ID(data._id), data);
        dispatch(updateBudgetSuccess(response.data.data));
      } else {
        const response = await api.post(API_ENDPOINTS.BUDGETS.BASE, data);
        dispatch(createBudgetSuccess(response.data.data));
      }
      setModalOpen(false);
      fetchBudgets();
    } catch (err: any) {
      dispatch(budgetFailure(err.response?.data?.message || "Failed to save budget"));
    }
  };

  const totalBudget = budgetList.reduce((sum, b) => sum + b.budgetAmount, 0);
  const totalSpent = budgetList.reduce((sum, b) => sum + b.amountSpent, 0);

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Budgets</h4>
          <p className="text-muted small mb-0">Plan your finances and set spending limits</p>
        </div>
        <div className="d-flex gap-2 align-items-center">
          <select
            className="form-select form-select-sm border-light-subtle rounded-3 w-auto"
            value={filters.month}
            onChange={(e) => dispatch(setBudgetFilters({ month: Number(e.target.value) }))}
          >
            {months.map((month, index) => (
              <option key={month} value={index}>
                {month}
              </option>
            ))}
          </select>
          <select
            className="form-select form-select-sm border-light-subtle rounded-3 w-auto"
            value={filters.year}
            onChange={(e) => dispatch(setBudgetFilters({ year: Number(e.target.value) }))}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary-gradient px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={handleCreateBudget}
          >
            <i className="bi bi-plus-lg"></i>
            Create Budget
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Summary Chips */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-4">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3">
              <div className="text-muted small mb-1">Total Allocated</div>
              <div className="h4 fw-bold mb-0 text-primary-custom">₹{totalBudget.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3">
              <div className="text-muted small mb-1">Total Spent</div>
              <div className="h4 fw-bold mb-0 text-danger">₹{totalSpent.toLocaleString()}</div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-4">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3">
              <div className="text-muted small mb-1">Remaining Balance</div>
              <div className="h4 fw-bold mb-0 text-success">₹{(totalBudget - totalSpent).toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Cards Grid */}
      <div className="row g-4">
        {loading && budgetList.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : budgetList.length === 0 ? (
          <div className="col-12">
            <div className="p-5 text-center text-muted card border-0 rounded-4 shadow-sm">
              <i className="bi bi-wallet2 fs-1 d-block mb-3 opacity-25"></i>
              No budgets found for this period
            </div>
          </div>
        ) : (
          budgetList.map((budget) => (
            <div key={budget._id} className="col-12 col-md-6 col-lg-4">
              <BudgetCard
                budget={budget}
                onEdit={() => handleEditBudget(budget)}
                onDelete={() => handleDeleteBudget(budget._id)}
              />
            </div>
          ))
        )}
      </div>

      <BudgetModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitBudget}
        budget={selectedBudget}
      />
    </div>
  );
};

export default Budgets;
