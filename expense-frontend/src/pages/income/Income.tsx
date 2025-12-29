import { useState, useEffect, useCallback } from "react";
import IncomeModal from "./components/IncomeModal";
import IncomeFilters from "./components/IncomeFilters";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { 
  incomeStart,
  incomeSuccess,
  incomeFailure,
  createIncomeSuccess,
  updateIncomeSuccess,
  deleteIncomeSuccess,
  setIncomeFilters,
  setIncomePage 
} from "../../features/income/incomeSlice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

const Income = () => {
  const dispatch = useAppDispatch();
  const { list, pagination, loading, filters, error } = useAppSelector((state) => state.income);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedIncome, setSelectedIncome] = useState<any>(null);

  const fetchAllIncome = useCallback(async () => {
    dispatch(incomeStart());
    try {
      let endpoint = API_ENDPOINTS.INCOME.BASE;
      let params: any = { ...filters };

      if (filters.search) {
        endpoint = API_ENDPOINTS.INCOME.SEARCH;
      } else if (filters.category) {
        endpoint = API_ENDPOINTS.INCOME.BY_CATEGORY(filters.category);
        delete params.category;
      } else if (filters.dateRange !== "ALL") {
        endpoint = API_ENDPOINTS.INCOME.BY_DATE;
        params.range = filters.dateRange;
      }

      const response = await api.get(endpoint, { params });
      dispatch(incomeSuccess(response.data));
    } catch (err: any) {
      dispatch(incomeFailure(err.response?.data?.message || "Failed to fetch income"));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchAllIncome();
  }, [fetchAllIncome]);

  const handleFilterChange = (newFilters: any) => {
    dispatch(setIncomeFilters(newFilters));
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setIncomePage(newPage));
  };

  const handleAddIncome = () => {
    setSelectedIncome(null);
    setModalOpen(true);
  };

  const handleEditIncome = (income: any) => {
    setSelectedIncome(income);
    setModalOpen(true);
  };

  const handleDeleteIncome = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this income entry?")) {
      dispatch(incomeStart());
      try {
        await api.delete(API_ENDPOINTS.INCOME.BY_ID(id));
        dispatch(deleteIncomeSuccess(id));
        fetchAllIncome();
      } catch (err: any) {
        dispatch(incomeFailure(err.response?.data?.message || "Failed to delete income"));
      }
    }
  };

  const handleSubmitIncome = async (data: any) => {
    dispatch(incomeStart());
    try {
      if (data._id) {
        const response = await api.patch(API_ENDPOINTS.INCOME.BY_ID(data._id), data);
        dispatch(updateIncomeSuccess(response.data.data));
      } else {
        const response = await api.post(API_ENDPOINTS.INCOME.BASE, data);
        dispatch(createIncomeSuccess(response.data.data));
      }
      setModalOpen(false);
      fetchAllIncome();
    } catch (err: any) {
      dispatch(incomeFailure(err.response?.data?.message || "Failed to save income"));
    }
  };

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      Salary: "#22c55e",
      Freelance: "#6366f1",
      Business: "#f59e0b",
      Investments: "#06b6d4",
      "Rental Income": "#a855f7",
      Dividends: "#ec4899",
      Bonus: "#10b981",
      Others: "#64748b",
    };
    return colors[category] || "#64748b";
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Income</h4>
          <p className="text-muted small mb-0">Track all your earnings and revenue sources</p>
        </div>
        <button
          className="btn btn-primary-gradient px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
          onClick={handleAddIncome}
          style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}
        >
          <i className="bi bi-plus-lg"></i>
          Add Income
        </button>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      <div className="card shadow-sm border-0 rounded-4 mb-4">
        <div className="card-body p-4">
          <IncomeFilters onFilterChange={handleFilterChange} />
          
          <div className="mt-4">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="bg-light border-bottom border-light">
                  <tr>
                    <th className="px-4 py-3 fw-bold text-muted small text-uppercase">Date</th>
                    <th className="py-3 fw-bold text-muted small text-uppercase">Source</th>
                    <th className="py-3 fw-bold text-muted small text-uppercase">Category</th>
                    <th className="py-3 fw-bold text-muted small text-uppercase text-end">Amount</th>
                    <th className="py-3 fw-bold text-muted small text-uppercase text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="border-top-0">
                  {loading && list.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5">
                        <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      </td>
                    </tr>
                  ) : list.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-muted">
                        No income entries found
                      </td>
                    </tr>
                  ) : (
                    list.map((income) => (
                      <tr key={income._id}>
                        <td className="px-4 text-muted small">
                          {new Date(income.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td className="fw-bold text-dark">{income.source}</td>
                        <td>
                          <span
                            className="badge rounded-pill fw-medium"
                            style={{
                              backgroundColor: `${getCategoryColor(income.categoryName)}15`,
                              color: getCategoryColor(income.categoryName),
                              fontSize: '11px'
                            }}
                          >
                            {income.categoryName}
                          </span>
                        </td>
                        <td className="text-end fw-bold text-success">
                          +₹{income.amount.toLocaleString()}
                        </td>
                        <td className="text-center">
                          <div className="d-flex justify-content-center gap-1">
                            <button
                              className="btn btn-sm btn-light-success text-success border-0 rounded-circle p-2"
                              onClick={() => handleEditIncome(income)}
                              title="Edit"
                              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-light-danger text-danger border-0 rounded-circle p-2"
                              onClick={() => handleDeleteIncome(income._id)}
                              title="Delete"
                              style={{ width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 d-flex justify-content-between align-items-center border-top">
                <div className="small text-muted">
                  Showing <b>{(pagination.page - 1) * pagination.limit + 1}</b> to <b>{Math.min(pagination.page * pagination.limit, pagination.total)}</b> of <b>{pagination.total}</b>
                </div>
                <nav aria-label="Page navigation">
                  <ul className="pagination pagination-sm mb-0 gap-1">
                    <li className={`page-item ${pagination.page === 1 ? 'disabled' : ''}`}>
                      <button className="page-link rounded-2 border-0 bg-light" onClick={() => handlePageChange(pagination.page - 1)}>
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {[...Array(pagination.totalPages)].map((_, i) => (
                      <li key={i} className={`page-item ${pagination.page === i + 1 ? 'active' : ''}`}>
                        <button className={`page-link rounded-2 border-0 mx-1 ${pagination.page === i + 1 ? 'bg-primary text-white' : 'bg-light text-muted'}`} onClick={() => handlePageChange(i + 1)}>
                          {i + 1}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${pagination.page === pagination.totalPages ? 'disabled' : ''}`}>
                      <button className="page-link rounded-2 border-0 bg-light" onClick={() => handlePageChange(pagination.page + 1)}>
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      <IncomeModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitIncome}
        income={selectedIncome}
      />
    </div>
  );
};

export default Income;
