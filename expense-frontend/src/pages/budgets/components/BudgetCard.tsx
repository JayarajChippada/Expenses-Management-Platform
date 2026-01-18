interface BudgetCardProps {
  budget: {
    _id: string;
    categoryName: string;
    budgetAmount: number;
    amountSpent: number;
    period: { frequency: string };
  };
  onEdit: () => void;
  onDelete: () => void;
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

const BudgetCard = ({ budget, onEdit, onDelete }: BudgetCardProps) => {
  const percentage = Math.min(
    (budget.amountSpent / budget.budgetAmount) * 100,
    100
  );
  const isExceeded = budget.amountSpent > budget.budgetAmount;
  const isWarning = percentage >= 80 && !isExceeded;

  const getProgressColorClass = () => {
    if (isExceeded) return "bg-danger";
    if (isWarning) return "bg-warning";
    return "bg-primary-custom";
  };

  const getProgressTextColorClass = () => {
    if (isExceeded) return "text-danger";
    if (isWarning) return "text-warning";
    return "text-success";
  };

  const remaining = budget.budgetAmount - budget.amountSpent;

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden"
      style={{
        borderTop: `4px solid ${getCategoryColor(budget.categoryName)}`,
      }}
    >
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h6 className="fw-bold mb-1 text-dark">{budget.categoryName}</h6>
            <span className="badge bg-light text-muted fw-medium rounded-pill border border-light-subtle extra-small">
              {budget.period.frequency}
            </span>
          </div>
          <div className="d-flex gap-1">
            <button
              className="btn btn-sm btn-light text-primary border-0 rounded-circle p-2"
              onClick={onEdit}
              title="Edit"
            >
              <i className="bi bi-pencil-square"></i>
            </button>
            <button
              className="btn btn-sm btn-light text-danger border-0 rounded-circle p-2"
              onClick={onDelete}
              title="Delete"
            >
              <i className="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <span className="small text-muted">Usage</span>
            <span className={`small fw-bold ${getProgressTextColorClass()}`}>
              ₹{budget.amountSpent.toLocaleString()} / ₹
              {budget.budgetAmount.toLocaleString()}
            </span>
          </div>
          <div
            className="progress rounded-pill shadow-none bg-light"
            style={{ height: "8px" }}
          >
            <div
              className={`progress-bar rounded-pill ${getProgressColorClass()}`}
              role="progressbar"
              style={{ width: `${percentage}%` }}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>

        <div className="d-flex justify-content-between align-items-center">
          <span className="extra-small text-muted fw-bold">
            {Math.round(percentage)}% USED
          </span>
          <div className="d-flex align-items-center gap-1">
            {isExceeded ? (
              <span className="extra-small fw-bold text-danger text-uppercase">
                Over by ₹{Math.abs(remaining).toLocaleString()}
              </span>
            ) : (
              <span className="extra-small fw-bold text-success text-uppercase">
                ₹{remaining.toLocaleString()} left
              </span>
            )}
          </div>
        </div>

        {(isExceeded || isWarning) && (
          <div className="mt-3">
            <span
              className={`badge ${
                isExceeded
                  ? "bg-danger-subtle text-danger"
                  : "bg-warning-subtle text-warning-emphasis"
              } border-0 rounded-pill fw-bold extra-small py-1 px-3 w-100`}
            >
              <i
                className={`bi ${
                  isExceeded
                    ? "bi-exclamation-triangle-fill"
                    : "bi-info-circle-fill"
                } me-1`}
              ></i>
              {isExceeded ? "Budget Exceeded!" : "Nearly Exhausted"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BudgetCard;
