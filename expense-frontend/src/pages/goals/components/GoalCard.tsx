interface GoalCardProps {
  goal: {
    _id: string;
    title: string;
    categoryName: string;
    description?: string;
    targetAmount: number;
    currentAmount: number;
    status: "active" | "completed";
    priority: "high" | "medium" | "low";
    targetDate?: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onAddFunds: () => void;
}

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    "Emergency Fund": "#ef4444",
    Vacation: "#06b6d4",
    Car: "#f59e0b",
    Home: "#22c55e",
    Education: "#6366f1",
    Retirement: "#a855f7",
    Wedding: "#ec4899",
    Gadgets: "#64748b",
    Others: "#6b7280",
  };
  return colors[category] || "#6b7280";
};

const getPriorityColor = (priority: string): string => {
  const colors: Record<string, string> = {
    high: "#ef4444",
    medium: "#f59e0b",
    low: "#22c55e",
  };
  return colors[priority] || "#6b7280";
};

const GoalCard = ({ goal, onEdit, onDelete, onAddFunds }: GoalCardProps) => {
  const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
  const isCompleted = goal.status === "completed" || goal.currentAmount >= goal.targetAmount;
  const remaining = goal.targetAmount - goal.currentAmount;

  return (
    <div
      className="card h-100 shadow-sm border-0 rounded-4 position-relative overflow-hidden"
    >
      {isCompleted && (
        <div
          className="position-absolute top-0 end-0 m-3 badge rounded-circle bg-success shadow-sm d-flex align-items-center justify-content-center p-2"
          style={{ width: '32px', height: '32px', zIndex: 1 }}
        >
          <i className="bi bi-check-lg text-white"></i>
        </div>
      )}
      
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span
                className="badge rounded-pill fw-bold text-uppercase"
                style={{
                  fontSize: '9px',
                  backgroundColor: `${getPriorityColor(goal.priority)}15`,
                  color: getPriorityColor(goal.priority),
                  padding: '4px 8px'
                }}
              >
                {goal.priority} Priority
              </span>
            </div>
            <h6 className="fw-bold mb-1 h5 text-dark">{goal.title}</h6>
            <span
              className="badge rounded-pill fw-medium border border-light-subtle extra-small text-muted bg-light"
            >
              <i className="bi bi-tag-fill me-1" style={{ color: getCategoryColor(goal.categoryName) }}></i>
              {goal.categoryName}
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

        {goal.description && (
          <p className="text-muted small mb-3 text-truncate-2" style={{ height: '2.4em' }}>
            {goal.description}
          </p>
        )}

        <div className="mb-4">
          <div className="d-flex justify-content-between mb-2">
            <span className="extra-small text-muted fw-bold">PROGRESS</span>
            <span className="extra-small fw-bold text-dark">{Math.round(percentage)}%</span>
          </div>
          <div className="progress rounded-pill bg-light" style={{ height: '8px' }}>
            <div
              className={`progress-bar rounded-pill ${isCompleted ? 'bg-success' : 'bg-primary-custom'}`}
              role="progressbar"
              style={{
                width: `${percentage}%`,
                background: isCompleted ? '' : 'var(--primary-gradient)'
              }}
              aria-valuenow={percentage}
              aria-valuemin={0}
              aria-valuemax={100}
            ></div>
          </div>
        </div>

        <div className="row g-2 mb-3">
          <div className="col-4">
            <div className="text-muted extra-small text-uppercase fw-bold opacity-75">Saved</div>
            <div className="fw-bold text-success small">
              ₹{(goal.currentAmount/1000).toFixed(0)}k
            </div>
          </div>
          <div className="col-4 text-center">
            <div className="text-muted extra-small text-uppercase fw-bold opacity-75">Target</div>
            <div className="fw-bold text-dark small">
              ₹{(goal.targetAmount/1000).toFixed(0)}k
            </div>
          </div>
          <div className="col-4 text-end">
            <div className="text-muted extra-small text-uppercase fw-bold opacity-75">Needed</div>
            <div className={`fw-bold small ${remaining <= 0 ? 'text-success' : 'text-danger'}`}>
              ₹{remaining <= 0 ? '0' : (remaining/1000).toFixed(0) + 'k'}
            </div>
          </div>
        </div>

        {goal.targetDate && (
          <div className="pt-3 border-top border-light d-flex align-items-center justify-content-between gap-2">
            <div className="text-muted extra-small fw-medium d-flex align-items-center gap-2">
              <i className="bi bi-calendar-event"></i>
              <span>
                {new Date(goal.targetDate).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
              </span>
            </div>
            
            {!isCompleted && (
              <button 
                className="btn btn-sm btn-primary-gradient py-1 px-3 rounded-pill extra-small fw-bold shadow-sm"
                onClick={onAddFunds}
              >
                <i className="bi bi-piggy-bank me-1"></i>
                Add Funds
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalCard;
