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
  loading?: boolean;
  page: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Food & Dining": "#6366f1",
    Transportation: "#f59e0b",
    Shopping: "#22c55e",
    Entertainment: "#a855f7",
    "Bills & Utilities": "#ef4444",
    Healthcare: "#ec4899",
    Travel: "#06b6d4",
    Others: "#64748b",
  };
  return colors[category] || "#64748b";
};

const ExpenseTable = ({
  expenses,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onEdit,
  onDelete,
}: ExpenseTableProps) => {
  const totalPages = Math.ceil(total / limit);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card border-0 rounded-4 overflow-hidden shadow-sm">
      <div className="d-none d-md-block table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead className="bg-light border-bottom border-light">
            <tr>
              <th className="px-4 py-3 fw-bold text-muted small text-uppercase">
                Date
              </th>
              <th className="py-3 fw-bold text-muted small text-uppercase">
                Merchant
              </th>
              <th className="py-3 fw-bold text-muted small text-uppercase">
                Category
              </th>
              <th className="py-3 fw-bold text-muted small text-uppercase text-end">
                Amount
              </th>
              <th className="py-3 fw-bold text-muted small text-uppercase text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="border-top-0">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-5 text-muted">
                  <div className="mb-2">
                    <i className="bi bi-inbox fs-1 opacity-25"></i>
                  </div>
                  No expenses found
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense._id}>
                  <td className="px-4 py-3 text-muted small">
                    {new Date(expense.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-3 fw-bold text-dark">{expense.merchant}</td>
                  <td className="py-3">
                    <span
                      className="badge rounded-pill fw-medium"
                      style={{
                        backgroundColor: `${getCategoryColor(
                          expense.categoryName
                        )}15`,
                        color: getCategoryColor(expense.categoryName),
                        fontSize: "11px",
                      }}
                    >
                      {expense.categoryName}
                    </span>
                  </td>
                  <td className="py-3 text-end fw-bold text-danger">
                    -₹{expense.amount.toLocaleString()}
                  </td>
                  <td className="py-3 text-center">
                    <div className="d-flex justify-content-center gap-1">
                      <button
                        className="btn btn-sm btn-light-primary text-primary border-0 rounded-circle p-2"
                        onClick={() => onEdit(expense)}
                        title="Edit"
                        style={{
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className="bi bi-pencil-square"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-light-danger text-danger border-0 rounded-circle p-2"
                        onClick={() => onDelete(expense._id)}
                        title="Delete"
                        style={{
                          width: "32px",
                          height: "32px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
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

      {/* Mobile Card View */}
      <div className="d-md-none p-3">
        {expenses.length === 0 ? (
          <div className="text-center py-5 text-muted">
            <div className="mb-2">
              <i className="bi bi-inbox fs-1 opacity-25"></i>
            </div>
            No expenses found
          </div>
        ) : (
          expenses.map((expense) => (
            <div
              key={expense._id}
              className="card border-0 shadow-sm rounded-4 mb-3"
            >
              <div className="card-body p-3">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <div>
                    <div className="fw-bold text-dark mb-1">
                      {expense.merchant}
                    </div>
                    <div className="text-muted small">
                      {new Date(expense.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                  </div>
                  <div className="fw-bold text-danger fs-5">
                    -₹{expense.amount.toLocaleString()}
                  </div>
                </div>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span
                    className="badge rounded-pill fw-medium"
                    style={{
                      backgroundColor: `${getCategoryColor(
                        expense.categoryName
                      )}15`,
                      color: getCategoryColor(expense.categoryName),
                      fontSize: "11px",
                    }}
                  >
                    {expense.categoryName}
                  </span>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-light-primary text-primary border-0 rounded-circle p-2"
                      onClick={() => onEdit(expense)}
                    >
                      <i className="bi bi-pencil-square"></i>
                    </button>
                    <button
                      className="btn btn-sm btn-light-danger text-danger border-0 rounded-circle p-2"
                      onClick={() => onDelete(expense._id)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="card-footer bg-white border-top border-light px-4 py-3 d-flex justify-content-between align-items-center">
          <div className="small text-muted">
            Showing <b>{(page - 1) * limit + 1}</b> to{" "}
            <b>{Math.min(page * limit, total)}</b> of <b>{total}</b>
          </div>
          <nav aria-label="Page navigation">
            <ul className="pagination pagination-sm mb-0 gap-1">
              <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                <button
                  className="page-link rounded-2 border-0 bg-light"
                  onClick={() => onPageChange(page - 1)}
                  disabled={page === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
              </li>
              {[...Array(totalPages)].map((_, i) => (
                <li
                  key={i}
                  className={`page-item ${page === i + 1 ? "active" : ""}`}
                >
                  <button
                    className={`page-link rounded-2 border-0 mx-1 ${
                      page === i + 1
                        ? "bg-primary-custom text-white"
                        : "bg-light text-muted"
                    }`}
                    onClick={() => onPageChange(i + 1)}
                  >
                    {i + 1}
                  </button>
                </li>
              ))}
              <li
                className={`page-item ${page === totalPages ? "disabled" : ""}`}
              >
                <button
                  className="page-link rounded-2 border-0 bg-light"
                  onClick={() => onPageChange(page + 1)}
                  disabled={page === totalPages}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
