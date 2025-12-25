import { Card, CardContent, Typography, Box } from "@mui/material";
import { type SummaryMetric } from "../dashboard.types";

interface Props {
  metric: SummaryMetric;
}

const SummaryCard = ({ metric }: Props) => {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
        transition: "transform 0.2s, box-shadow 0.2s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        },
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {metric.title}
            </Typography>
            <Typography variant="h4" fontWeight={700} sx={{ color: metric.color || "text.primary" }}>
              {metric.value}
            </Typography>
            {metric.trend !== undefined && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                  mt: 1,
                }}
              >
                <Typography
                  variant="body2"
                  fontWeight={600}
                  sx={{ color: metric.positive ? "#22c55e" : "#ef4444" }}
                >
                  {metric.positive ? "+" : "-"}{metric.trend}%
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  vs last month
                </Typography>
              </Box>
            )}
          </Box>
          {metric.icon && (
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: `${metric.color}15`,
                color: metric.color,
              }}
            >
              {metric.icon}
            </Box>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default SummaryCard;
