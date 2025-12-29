import { useState, useEffect, useCallback } from "react";
import ReportOverview from "./components/ReportOverview";
import ReportTrends from "./components/ReportTrends";
import ReportCategories from "./components/ReportCategories";
import ReportMerchants from "./components/ReportMerchants";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { 
  reportsStart, 
  reportsOverviewSuccess, 
  reportsTrendsSuccess, 
  reportsCategoriesSuccess, 
  reportsMerchantsSuccess, 
  setReportsFilters, 
  reportsFailure 
} from "../../features/reports/reportsSlice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";

const dateRanges = [
  { label: "This Month", value: "1M" },
  { label: "Last 3 Months", value: "3M" },
  { label: "Last 6 Months", value: "6M" },
  { label: "This Year", value: "1Y" },
  { label: "All Time", value: "ALL" },
];

const Reports = () => {
  const dispatch = useAppDispatch();
  const { filters, loading, error } = useAppSelector((state) => state.reports);
  const [activeTab, setActiveTab] = useState(0);

  const fetchReportData = useCallback(async (tabIndex: number) => {
    dispatch(reportsStart());
    try {
      let response;
      switch (tabIndex) {
        case 0:
          response = await api.get(API_ENDPOINTS.REPORTS.OVERVIEW, { params: filters });
          dispatch(reportsOverviewSuccess(response.data.data));
          break;
        case 1:
          response = await api.get(API_ENDPOINTS.REPORTS.TRENDS, { params: filters });
          dispatch(reportsTrendsSuccess(response.data.data));
          break;
        case 2:
          response = await api.get(API_ENDPOINTS.REPORTS.CATEGORIES, { params: filters });
          dispatch(reportsCategoriesSuccess(response.data.data));
          break;
        case 3:
          response = await api.get(API_ENDPOINTS.REPORTS.MERCHANTS, { params: filters });
          dispatch(reportsMerchantsSuccess(response.data.data));
          break;
      }
    } catch (err: any) {
      dispatch(reportsFailure(err.response?.data?.message || "Failed to fetch report data"));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchReportData(activeTab);
  }, [fetchReportData, activeTab]);

  const fetchExportData = async () => {
    dispatch(reportsStart());
    try {
      const [overviewRes, trendsRes, categoriesRes, merchantsRes] = await Promise.all([
         api.get(API_ENDPOINTS.REPORTS.OVERVIEW, { params: filters }),
         api.get(API_ENDPOINTS.REPORTS.TRENDS, { params: filters }),
         api.get(API_ENDPOINTS.REPORTS.CATEGORIES, { params: filters }),
         api.get(API_ENDPOINTS.REPORTS.MERCHANTS, { params: filters })
      ]);
      // We don't dispatch success here to avoid messing up current tab view
      dispatch(reportsFailure(null)); // Clear loading state manually if needed or just end start
      // Actually reportsStart sets loading=true. We should probably just turn it off.
      // But we don't have a generic "reportsSuccess" action. 
      // Let's re-fetch the current tab data to reset state correctly or just leave it?
      // Better: Don't use dispatch(reportsStart) for export to avoid UI flicker/state issues if independent.
      // But we want to show loading?
      // Let's just return data.
      return {
        overview: overviewRes.data.data,
        trends: trendsRes.data.data,
        categories: categoriesRes.data.data,
        merchants: merchantsRes.data.data
      };
    } catch (err: any) {
      dispatch(reportsFailure(err.response?.data?.message || "Failed to fetch data for export"));
      return null;
    }
  };

  const handleExportPDF = async () => {
    const data = await fetchExportData();
    if (!data) return;

    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString();

    // Title
    doc.setFontSize(20);
    doc.text("Financial Report", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${dateStr} | Range: ${filters.dateRange}`, 14, 30);

    // Overview
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Overview", 14, 45);
    
    const overviewData = [
      ["Total Incomes", `Rs. ${data.overview.totalIncomes.toLocaleString()}`],
      ["Total Expenses", `Rs. ${data.overview.totalExpenses.toLocaleString()}`],
      ["Balance", `Rs. ${data.overview.balance.toLocaleString()}`],
      ["Savings Rate", `${data.overview.totalIncomes > 0 ? Math.round((data.overview.balance / data.overview.totalIncomes) * 100) : 0}%`]
    ];

    autoTable(doc, {
      startY: 50,
      head: [['Metric', 'Value']],
      body: overviewData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Categories
    let finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Expenses by Category", 14, finalY);

    const categoryData = data.categories.map((c: any) => [
      c._id, 
      `Rs. ${c.amount.toLocaleString()}`, 
      c.count
    ]);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Category', 'Amount', 'Transactions']],
      body: categoryData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }
    });

    // Merchants
    finalY = (doc as any).lastAutoTable.finalY + 15;
    
    // Check page break
    if (finalY > 250) {
      doc.addPage();
      finalY = 20;
    }
    
    doc.text("Top Merchants", 14, finalY);

    const merchantData = data.merchants.slice(0, 10).map((m: any) => [
      m._id, 
      `Rs. ${m.amount.toLocaleString()}`, 
      m.count
    ]);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Merchant', 'Amount', 'Transactions']],
      body: merchantData,
      theme: 'striped',
      headStyles: { fillColor: [99, 102, 241] }
    });

    doc.save(`Financial_Report_${filters.dateRange}.pdf`);
    
    // Restore loading state
    fetchReportData(activeTab);
  };

  const handleExportExcel = async () => {
    const data = await fetchExportData();
    if (!data) return;

    const wb = XLSX.utils.book_new();

    // Overview Sheet
    const overviewWS = XLSX.utils.json_to_sheet([
      { Metric: "Total Incomes", Value: data.overview.totalIncomes },
      { Metric: "Total Expenses", Value: data.overview.totalExpenses },
      { Metric: "Balance", Value: data.overview.balance },
      { Metric: "Expense Count", Value: data.overview.expenseCount },
      { Metric: "Income Count", Value: data.overview.incomeCount },
    ]);
    XLSX.utils.book_append_sheet(wb, overviewWS, "Overview");

    // Categories Sheet
    const categoriesWS = XLSX.utils.json_to_sheet(data.categories.map((c: any) => ({
      Category: c._id,
      Amount: c.amount,
      Count: c.count
    })));
    XLSX.utils.book_append_sheet(wb, categoriesWS, "Categories");

    // Merchants Sheet
    const merchantsWS = XLSX.utils.json_to_sheet(data.merchants.map((m: any) => ({
      Merchant: m._id,
      Amount: m.amount,
      Count: m.count
    })));
    XLSX.utils.book_append_sheet(wb, merchantsWS, "Merchants");

    // Trends Sheet
    const trendsData = data.trends.expenses.map((e: any) => ({
      Date: e._id,
      Type: 'Expense',
      Amount: e.amount
    })).concat(data.trends.incomes.map((i: any) => ({
      Date: i._id,
      Type: 'Income',
      Amount: i.amount
    }))).sort((a: any, b: any) => new Date(a.Date).getTime() - new Date(b.Date).getTime());

    const trendsWS = XLSX.utils.json_to_sheet(trendsData);
    XLSX.utils.book_append_sheet(wb, trendsWS, "Daily Trends");

    XLSX.writeFile(wb, `Financial_Report_${filters.dateRange}.xlsx`);
    
    // Restore loading state
    fetchReportData(activeTab);
  };

  const tabs = [
    { label: "Overview", icon: "bi-pie-chart-fill" },
    { label: "Trends", icon: "bi-graph-up-arrow" },
    { label: "Categories", icon: "bi-tags-fill" },
    { label: "Merchants", icon: "bi-shop-window" },
  ];

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Reports & Analytics</h4>
          <p className="text-muted small mb-0">Gain deep insights into your financial habits</p>
        </div>
        <div className="d-flex gap-2 align-items-center flex-wrap">
          <select
            className="form-select form-select-sm border-light-subtle rounded-3 w-auto"
            value={filters.dateRange}
            onChange={(e) => dispatch(setReportsFilters({ dateRange: e.target.value }))}
          >
            {dateRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
          <button
            className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 rounded-3 px-3 fw-medium"
            onClick={handleExportPDF}
          >
            <i className="bi bi-file-earmark-pdf"></i>
            <span className="d-none d-sm-inline">PDF Report</span>
          </button>
          <button
            className="btn btn-outline-success btn-sm d-flex align-items-center gap-2 rounded-3 px-3 fw-medium"
            onClick={handleExportExcel}
          >
            <i className="bi bi-file-earmark-excel"></i>
            <span className="d-none d-sm-inline">Excel Export</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white p-1 rounded-4 shadow-sm d-inline-flex mb-4 border border-light overflow-auto maxWidth-100">
        {tabs.map((tab, index) => (
          <button
            key={index}
            className={`btn border-0 fw-bold px-4 py-2 d-flex align-items-center gap-2 transition-all rounded-3 text-nowrap ${activeTab === index ? 'bg-primary-light text-primary-custom' : 'text-muted'}`}
            onClick={() => setActiveTab(index)}
          >
            <i className={`bi ${tab.icon}`}></i>
            <span className="small">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-2 position-relative">
        {loading && (
          <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75 z-index-10" style={{ minHeight: '400px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <div style={{ visibility: loading ? 'hidden' : 'visible' }}>
          {activeTab === 0 && <ReportOverview />}
          {activeTab === 1 && <ReportTrends />}
          {activeTab === 2 && <ReportCategories />}
          {activeTab === 3 && <ReportMerchants />}
        </div>
      </div>
    </div>
  );
};

export default Reports;
