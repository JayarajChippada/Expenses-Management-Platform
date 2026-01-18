import { useMemo } from "react"

import { useAppSelector } from "../../../store/hooks"

const ReportTrends = () => {
  const { trends } = useAppSelector((state) => state.reports)

  const formattedData = useMemo(() => {
    if (!trends) return []

    const map = new Map<
      string,
      { date: string; income: number; expenses: number }
    >()

    // Add expenses

    trends.expenses?.forEach((e: any) => {
      map.set(e._id, {
        date: e._id,

        expenses: Number(e.amount) || 0,

        income: 0,
      })
    })

    // Add incomes

    trends.incomes?.forEach((i: any) => {
      const existing = map.get(i._id)

      if (existing) {
        existing.income = Number(i.amount) || 0
      } else {
        map.set(i._id, {
          date: i._id,

          income: Number(i.amount) || 0,

          expenses: 0,
        })
      }
    })

    return Array.from(map.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )
  }, [trends])

  if (formattedData.length === 0) {
    return (
      <div className="p-5 text-center text-muted">
        <i className="bi bi-graph-up fs-1 d-block mb-3 opacity-25"></i>
        No trend data available for this period
      </div>
    )
  }

  const avgIncome =
    formattedData.reduce((sum, i) => sum + i.income, 0) / formattedData.length

  const avgExpenses =
    formattedData.reduce((sum, i) => sum + i.expenses, 0) /
    formattedData.length

  const avgSavings = avgIncome - avgExpenses

  return (
    <div className="d-flex flex-column">
      <div className="row g-3 mb-4">
        <div className="">
          <div
            className="card shadow-sm rounded-4"
            style={{ borderLeft: "4px solid #22c55e" }}
          >
            <div className="card-body">
              <div className="small fw-bold text-success">AVG INCOME</div>

              <div className="h4 fw-bold">
                ₹{Math.round(avgIncome).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="">
          <div
            className="card shadow-sm rounded-4"
            style={{ borderLeft: "4px solid #ef4444" }}
          >
            <div className="card-body">
              <div className="small fw-bold text-danger">AVG EXPENSES</div>

              <div className="h4 fw-bold">
                ₹{Math.round(avgExpenses).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="">
          <div
            className="card shadow-sm rounded-4"
            style={{ borderLeft: "4px solid #3b82f6" }}
          >
            <div className="card-body">
              <div className="small fw-bold text-primary-custom">
                AVG SAVINGS
              </div>

              <div className="h4 fw-bold">
                ₹{Math.round(avgSavings).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportTrends
