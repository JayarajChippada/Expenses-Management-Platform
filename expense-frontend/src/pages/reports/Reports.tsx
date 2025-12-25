import { useState } from "react";
import { Box, Typography, Tabs, Tab, TextField, MenuItem, Button } from "@mui/material";
import { Download, PictureAsPdf } from "@mui/icons-material";
import ReportOverview from "./components/ReportOverview";
import ReportTrends from "./components/ReportTrends";
import ReportCategories from "./components/ReportCategories";
import ReportMerchants from "./components/ReportMerchants";

const dateRanges = [
  { label: "This Month", value: "month" },
  { label: "Last 3 Months", value: "3months" },
  { label: "Last 6 Months", value: "6months" },
  { label: "This Year", value: "year" },
  { label: "All Time", value: "all" },
];

const Reports = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [dateRange, setDateRange] = useState("month");

  const handleExportPDF = () => {
    alert("PDF export functionality - will be implemented with backend integration");
  };

  const handleExportExcel = () => {
    alert("Excel export functionality - will be implemented with backend integration");
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Reports & Analytics
        </Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            select
            size="small"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {dateRanges.map((range) => (
              <MenuItem key={range.value} value={range.value}>
                {range.label}
              </MenuItem>
            ))}
          </TextField>
          <Button
            variant="outlined"
            size="small"
            startIcon={<PictureAsPdf />}
            onClick={handleExportPDF}
            sx={{ textTransform: "none" }}
          >
            Export PDF
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<Download />}
            onClick={handleExportExcel}
            sx={{ textTransform: "none" }}
          >
            Export Excel
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onChange={(_, v) => setActiveTab(v)}
        sx={{
          mb: 3,
          borderBottom: "1px solid rgba(0,0,0,0.08)",
          "& .MuiTab-root": { textTransform: "none", fontWeight: 500 },
        }}
      >
        <Tab label="Overview" />
        <Tab label="Trends" />
        <Tab label="Categories" />
        <Tab label="Merchants" />
      </Tabs>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && <ReportOverview />}
        {activeTab === 1 && <ReportTrends />}
        {activeTab === 2 && <ReportCategories />}
        {activeTab === 3 && <ReportMerchants />}
      </Box>
    </Box>
  );
};

export default Reports;
