import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppSelector } from "../../../app/hooks";

const ReportOverview = () => {
  const { overview } = useAppSelector((state) => state.reports);
  console.log(overview)
  if (!overview) {
    return (
      <div className="p-5 text-center text-muted">
        <i className="bi bi-bar-chart fs-1 d-block mb-3 opacity-25"></i>
        No overview data available for this period
      </div>
    );
  }

  const {
    totalIncomes: totalIncome = 0,
    totalExpenses = 0,
    balance: netSavings = 0,
    savingsRate = 0,
    expenseCount = 0,
    incomeCount = 0,
    monthlyData = [],
    categoryDistribution = [],
  } = overview;
  
  const transactionCount = expenseCount + incomeCount;
  const incomeChange = 0; // Placeholder until backend sends comparison data
  const expenseChange = 0; // Placeholder

  const formatCurrency = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    return `₹${val.toLocaleString()}`;
  };

  return (
    <div>
      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small fw-bold mb-1 opacity-75">TOTAL INCOME</div>
                  <div className="h4 fw-bold mb-0 text-success">{formatCurrency(totalIncome)}</div>
                  <div className={`extra-small mt-1 fw-bold ${incomeChange >= 0 ? 'text-success' : 'text-danger'}`}>
                    <i className={`bi bi-arrow-${incomeChange >= 0 ? 'up' : 'down'}-short`}></i>
                    {Math.abs(incomeChange)}% {incomeChange >= 0 ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="rounded-circle bg-success-subtle p-3 d-flex align-items-center justify-content-center" style={{ width: '52px', height: '52px' }}>
                  <i className="bi bi-graph-up text-success fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small fw-bold mb-1 opacity-75">TOTAL EXPENSES</div>
                  <div className="h4 fw-bold mb-0 text-danger">{formatCurrency(totalExpenses)}</div>
                  <div className={`extra-small mt-1 fw-bold ${expenseChange <= 0 ? 'text-success' : 'text-danger'}`}>
                    <i className={`bi bi-arrow-${expenseChange >= 0 ? 'up' : 'down'}-short`}></i>
                    {Math.abs(expenseChange)}% {expenseChange >= 0 ? 'increase' : 'decrease'}
                  </div>
                </div>
                <div className="rounded-circle bg-danger-subtle p-3 d-flex align-items-center justify-content-center" style={{ width: '52px', height: '52px' }}>
                  <i className="bi bi-graph-down text-danger fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small fw-bold mb-1 opacity-75">NET SAVINGS</div>
                  <div className="h4 fw-bold mb-0 text-primary-custom">{formatCurrency(netSavings)}</div>
                  <div className="extra-small text-primary-custom mt-1 fw-bold">
                    {savingsRate}% Savings Rate
                  </div>
                </div>
                <div className="rounded-circle bg-primary-subtle p-3 d-flex align-items-center justify-content-center" style={{ width: '52px', height: '52px' }}>
                  <i className="bi bi-wallet2 text-primary-custom fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <div className="d-flex justify-content-between">
                <div>
                  <div className="text-muted small fw-bold mb-1 opacity-75">TRANSACTIONS</div>
                  <div className="h4 fw-bold mb-0 text-dark">{transactionCount}</div>
                  <div className="extra-small text-muted mt-1 fw-bold">
                    This period
                  </div>
                </div>
                <div className="rounded-circle bg-light p-3 d-flex align-items-center justify-content-center" style={{ width: '52px', height: '52px' }}>
                  <i className="bi bi-receipt text-secondary fs-4"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">Cash Flow Overview</h6>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyData}>
                    <defs>
                      <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#22c55e" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                      </linearGradient>
                      <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2}/>
                        <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip
                      contentStyle={{ 
                        borderRadius: '16px', 
                        border: '1px solid var(--border-color)', 
                        boxShadow: 'var(--shadow-md)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)'
                      }}
                      itemStyle={{ color: 'var(--text-main)' }}
                      labelStyle={{ color: 'var(--text-muted)' }}
                      formatter={(v: any) => [`₹${v?.toLocaleString()}`, '']}
                    />
                    <Area type="monotone" dataKey="income" stroke="#22c55e" strokeWidth={3} fill="url(#colorIncome)" />
                    <Area type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={3} fill="url(#colorExpenses)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
        <div className="col-lg-4">
          <div className="card h-100 shadow-sm border-0 rounded-4">
            <div className="card-body p-4">
              <h6 className="fw-bold mb-4">Expense Mix</h6>
              <div style={{ height: '220px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      dataKey="value"
                      paddingAngle={5}
                      stroke="none"
                    >
                      {categoryDistribution.map((entry: any, index: number) => (
                        <Cell key={index} fill={entry.color || '#6366f1'} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v: any) => [`${v}%`, '']}
                      contentStyle={{ 
                        borderRadius: '12px', 
                        border: '1px solid var(--border-color)', 
                        boxShadow: 'var(--shadow-md)',
                        backgroundColor: 'var(--bg-card)',
                        color: 'var(--text-main)'
                      }}
                      itemStyle={{ color: 'var(--text-main)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="d-flex flex-wrap gap-2 mt-3 justify-content-center">
                {categoryDistribution.map((item: any) => (
                  <div key={item.name} className="d-flex align-items-center gap-1 bg-light px-2 py-1 rounded-pill">
                    <div className="rounded-circle" style={{ width: 6, height: 6, backgroundColor: item.color || '#6366f1' }} />
                    <span className="extra-small text-muted fw-bold">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportOverview;
