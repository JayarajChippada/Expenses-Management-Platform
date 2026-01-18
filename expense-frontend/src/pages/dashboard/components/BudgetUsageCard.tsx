import { useAppSelector } from "../../../store/hooks";

const BudgetUsageCard = () => {
  const { budgetUsage, categories } = useAppSelector(
    (state) => state.dashboard
  );

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <h6 className="fw-bold mb-4">Budget Usage</h6>
        <div className="d-flex flex-column gap-4">
          {budgetUsage.length > 0 ? (
            budgetUsage.map((budget) => {
              const percentage = Math.min(budget.usedPercentage || 0, 100);
              const isOver = budget.spent > budget.limit;
              const categoryInfo = categories?.find(
                (c) => c.categoryName === budget.category
              );
              const color = categoryInfo?.color || "#6366f1";

              return (
                <div key={budget.category}>
                  <div className="d-flex justify-content-between mb-2">
                    <div className="d-flex align-items-center gap-2">
                      <span className="small fs-6">{categoryInfo?.icon}</span>
                      <span className="small fw-bold text-dark">
                        {budget.category}
                      </span>
                    </div>
                    <span
                      className={`small fw-bold ${
                        isOver ? "text-danger" : "text-muted"
                      }`}
                    >
                      ₹{budget.spent.toLocaleString()} / ₹
                      {budget.limit.toLocaleString()}
                    </span>
                  </div>
                  <div
                    className="progress rounded-pill"
                    style={{ height: "8px", backgroundColor: "#f1f5f9" }}
                  >
                    <div
                      className="progress-bar rounded-pill"
                      role="progressbar"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: isOver ? "#ef4444" : color,
                      }}
                      aria-valuenow={percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    ></div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-4">
              <p className="text-muted small">No active budgets found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BudgetUsageCard;
