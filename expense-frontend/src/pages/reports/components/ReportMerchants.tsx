import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const merchantData = [
  { name: "Amazon", amount: 25000, transactions: 12, category: "Shopping" },
  { name: "Swiggy", amount: 18000, transactions: 45, category: "Food & Dining" },
  { name: "Uber", amount: 12000, transactions: 28, category: "Transportation" },
  { name: "Netflix", amount: 7800, transactions: 12, category: "Entertainment" },
  { name: "Flipkart", amount: 15000, transactions: 8, category: "Shopping" },
  { name: "Zomato", amount: 14000, transactions: 38, category: "Food & Dining" },
  { name: "Electricity", amount: 8500, transactions: 4, category: "Bills" },
  { name: "Petrol Pump", amount: 16000, transactions: 15, category: "Transportation" },
  { name: "Apollo Pharmacy", amount: 5500, transactions: 6, category: "Healthcare" },
  { name: "BookMyShow", amount: 4500, transactions: 5, category: "Entertainment" },
];

const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    Shopping: "#22c55e",
    "Food & Dining": "#667eea",
    Transportation: "#f59e0b",
    Entertainment: "#8b5cf6",
    Bills: "#ef4444",
    Healthcare: "#ec4899",
  };
  return colors[category] || "#64748b";
};

const ReportMerchants = () => {
  const topMerchants = [...merchantData].sort((a, b) => b.amount - a.amount).slice(0, 5);
  const totalSpent = merchantData.reduce((sum, m) => sum + m.amount, 0);

  return (
    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
        Top Merchants / Vendors
      </Typography>

      <Box className="row g-3">
        <Box className="col-lg-8">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Top 5 Merchants by Spending</Typography>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={topMerchants}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v/1000}k`} />
                  <Tooltip formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Amount']} />
                  <Bar dataKey="amount" fill="#667eea" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Box>

        <Box className="col-lg-4">
          <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", height: "100%" }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="subtitle2" sx={{ mb: 2 }}>Summary</Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Merchants</Typography>
                  <Typography variant="h5" fontWeight={700}>{merchantData.length}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Spent</Typography>
                  <Typography variant="h5" fontWeight={700} color="#ef4444">₹{totalSpent.toLocaleString()}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Total Transactions</Typography>
                  <Typography variant="h5" fontWeight={700} color="#667eea">
                    {merchantData.reduce((sum, m) => sum + m.transactions, 0)}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Merchant Details Table */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mt: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>All Merchants</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {merchantData.map((merchant, index) => (
              <Box
                key={merchant.name}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1.5,
                  borderBottom: index < merchantData.length - 1 ? "1px solid #f0f0f0" : "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" fontWeight={500}>{merchant.name}</Typography>
                  <Chip
                    label={merchant.category}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: 10,
                      bgcolor: `${getCategoryColor(merchant.category)}15`,
                      color: getCategoryColor(merchant.category),
                    }}
                  />
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Typography variant="caption" color="text.secondary">
                    {merchant.transactions} txns
                  </Typography>
                  <Typography variant="body2" fontWeight={600}>
                    ₹{merchant.amount.toLocaleString()}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ReportMerchants;
