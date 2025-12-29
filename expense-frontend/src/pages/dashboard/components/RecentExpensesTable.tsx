import { useState } from "react";
import { useAppSelector } from "../../../app/hooks";
import { useNavigate } from "react-router-dom";

// Sample data - will be connected to Redux
// const transactions: Transaction[] = [
//   { id: "1", date: "Dec 25", merchant: "Swiggy", category: "Food", amount: 450, type: "expense" },
//   { id: "2", date: "Dec 24", merchant: "Amazon", category: "Shopping", amount: 2500, type: "expense" },
//   { id: "3", date: "Dec 24", merchant: "Salary", category: "Income", amount: 50000, type: "income" },
//   { id: "4", date: "Dec 23", merchant: "Uber", category: "Transport", amount: 350, type: "expense" },
//   { id: "5", date: "Dec 23", merchant: "Netflix", category: "Entertainment", amount: 649, type: "expense" },
//   { id: "6", date: "Dec 22", merchant: "Freelance", category: "Income", amount: 15000, type: "income" },
// ];

const RecentExpensesTable = () => {
  const { recentTransactions, categories } = useAppSelector((state) => state.dashboard);
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();
  const itemsPerPage = 5;

  const totalPages = Math.ceil(recentTransactions.length / itemsPerPage);
  const displayedTransactions = recentTransactions.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      setCurrentPage(prev => prev - 1);
    }
  };

  return (
    <div className="card h-100 shadow-sm border-0 rounded-4">
      <div className="card-body p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h6 className="fw-bold mb-0">Recent Transactions</h6>
          <button 
            className="btn btn-sm text-primary p-0 fw-bold small"
            onClick={() => navigate('/expenses')}
          >
            View All
          </button>
        </div>

        <div className="d-flex flex-column gap-1 overflow-hidden" style={{ minHeight: '300px' }}>
          {displayedTransactions.length > 0 ? (
            displayedTransactions.map((tx, index) => {
              const categoryInfo = categories?.find(c => c.categoryName === tx.categoryName);
              const color = categoryInfo?.color || (tx.type === 'income' ? '#22c55e' : '#ef4444');
              
              return (
                <div
                  key={`${tx.merchant}-${tx.date}-${index}`}
                  className={`d-flex align-items-center justify-content-between py-3 ${
                    index < displayedTransactions.length - 1 ? "border-bottom border-light" : ""
                  }`}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center fs-5 shadow-sm"
                      style={{
                        width: '42px',
                        height: '42px',
                        backgroundColor: `${color}15`,
                        color: color
                      }}
                    >
                      {categoryInfo?.icon || (tx.type === "income" ? "💰" : "💸")}
                    </div>
                    <div>
                      <div className="fw-bold text-dark small">{tx.merchant}</div>
                      <div className="text-muted extra-small d-flex align-items-center gap-1">
                        <span>{new Date(tx.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span className="fw-medium">{tx.categoryName}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-end">
                    <div
                      className={`fw-bold small ${tx.type === "income" ? "text-success" : "text-dark"}`}
                    >
                      {tx.type === "income" ? "+" : "-"}₹{tx.amount.toLocaleString()}
                    </div>
                    <div className="extra-small text-muted">{tx.paymentMethod}</div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-receipt text-muted opacity-25" style={{ fontSize: '3rem' }}></i>
              <p className="text-muted small mt-2">No recent transactions.</p>
            </div>
          )}
        </div>
        
        {recentTransactions.length > itemsPerPage && (
          <div className="d-flex justify-content-between align-items-center mt-3 pt-3 border-top border-light">
             <button 
               className="btn btn-sm btn-light rounded-pill px-3"
               onClick={handlePrev}
               disabled={currentPage === 0}
             >
               <i className="bi bi-chevron-left me-1"></i> Prev
             </button>
             <span className="text-muted extra-small fw-bold">
               Page {currentPage + 1} of {totalPages}
             </span>
             <button 
               className="btn btn-sm btn-light rounded-pill px-3"
               onClick={handleNext}
               disabled={currentPage === totalPages - 1}
             >
               Next <i className="bi bi-chevron-right ms-1"></i>
             </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecentExpensesTable;
