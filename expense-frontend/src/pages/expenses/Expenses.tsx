import { useState, useEffect, useCallback } from "react";
import ExpenseFilters from "./components/ExpenseFilters";
import ExpenseTable from "./components/ExpenseTable";
import ExpenseModal from "./components/ExpenseModal";
import ImportExpensesModal from "./components/ImportExpensesModal";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { 
  expenseStart,
  expenseSuccess,
  expenseFailure,
  createExpenseSuccess,
  updateExpenseSuccess,
  deleteExpenseSuccess,
  setExpenseFilters, 
  setExpensePage 
} from "../../features/expenses/expenseSlice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

const Expenses = () => {
  const dispatch = useAppDispatch();
  const { list, pagination, loading, filters, error } = useAppSelector((state) => state.expenses);
  const [modalOpen, setModalOpen] = useState(false);
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState<any>(null);

  const fetchAllExpenses = useCallback(async () => {
    dispatch(expenseStart());
    try {
      let endpoint = API_ENDPOINTS.EXPENSES.BASE;
      let params: any = { ...filters };

      if (filters.search) {
        endpoint = API_ENDPOINTS.EXPENSES.SEARCH;
      } else if (filters.category) {
        endpoint = API_ENDPOINTS.EXPENSES.BY_CATEGORY(filters.category);
        delete params.category;
      } else if (filters.dateRange !== "ALL") {
        endpoint = API_ENDPOINTS.EXPENSES.BY_DATE;
        params.range = filters.dateRange;
      }

      const response = await api.get(endpoint, { params });
      dispatch(expenseSuccess(response.data));
    } catch (err: any) {
      dispatch(expenseFailure(err.response?.data?.message || "Failed to fetch expenses"));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchAllExpenses();
  }, [fetchAllExpenses]);

  const handleFilterChange = (newFilters: any) => {
    dispatch(setExpenseFilters(newFilters));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setExpensePage(newPage));
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
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dispatch(expenseStart());
      try {
        await api.delete(API_ENDPOINTS.EXPENSES.BY_ID(id));
        dispatch(deleteExpenseSuccess(id));
        // Optionally re-fetch to update pagination info
        fetchAllExpenses();
      } catch (err: any) {
        dispatch(expenseFailure(err.response?.data?.message || "Failed to delete expense"));
      }
    }
  };

  const handleSubmitExpense = async (data: any) => {
    dispatch(expenseStart());
    try {
      if (data._id) {
        const response = await api.patch(API_ENDPOINTS.EXPENSES.BY_ID(data._id), data);
        dispatch(updateExpenseSuccess(response.data.data));
      } else {
        const response = await api.post(API_ENDPOINTS.EXPENSES.BASE, data);
        dispatch(createExpenseSuccess(response.data.data));
      }
      setModalOpen(false);
      fetchAllExpenses(); // Re-fetch to ensure list is in sync with server state
    } catch (err: any) {
      dispatch(expenseFailure(err.response?.data?.message || "Failed to save expense"));
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Expenses</h4>
          <p className="text-muted small mb-0">Manage and track your daily spending</p>
        </div>
        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-primary px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={() => setImportModalOpen(true)}
          >
            <i className="bi bi-file-earmark-excel"></i>
            Import
          </button>
          <button
            className="btn btn-primary-gradient px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
            onClick={handleAddExpense}
          >
            <i className="bi bi-plus-lg"></i>
            Add Expense
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-4">
          <ExpenseFilters onFilterChange={handleFilterChange} />
          
          <div className="mt-4">
            <ExpenseTable
              expenses={list}
              loading={loading && list.length === 0}
              page={filters.page || 1}
              limit={filters.limit || 10}
              total={pagination.total}
              onPageChange={handlePageChange}
              onEdit={handleEditExpense}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      </div>

      <ExpenseModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitExpense}
        expense={selectedExpense}
      />

      <ImportExpensesModal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        onSuccess={fetchAllExpenses}
      />
    </div>
  );
};

export default Expenses;
