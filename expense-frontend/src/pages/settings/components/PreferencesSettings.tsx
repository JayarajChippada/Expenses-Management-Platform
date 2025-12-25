import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  MenuItem,
  Switch,
  FormControlLabel,
  Button,
  Alert,
  Divider,
} from "@mui/material";

const currencies = [
  { code: "INR", name: "Indian Rupee (₹)" },
  { code: "USD", name: "US Dollar ($)" },
  { code: "EUR", name: "Euro (€)" },
  { code: "GBP", name: "British Pound (£)" },
  { code: "JPY", name: "Japanese Yen (¥)" },
];

const timezones = [
  { value: "Asia/Kolkata", label: "India Standard Time (IST)" },
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "Europe/London", label: "Greenwich Mean Time (GMT)" },
  { value: "Europe/Paris", label: "Central European Time (CET)" },
];

const PreferencesSettings = () => {
  const [preferences, setPreferences] = useState({
    currency: "INR",
    timezone: "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    goalReminders: true,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (name: string, value: any) => {
    setPreferences({ ...preferences, [name]: value });
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Box>
      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Preferences saved successfully!
        </Alert>
      )}

      {/* Regional Settings */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Regional Settings
          </Typography>

          <Box className="row g-3" sx={{ maxWidth: 600 }}>
            <Box className="col-md-6">
              <TextField
                fullWidth
                select
                label="Currency"
                value={preferences.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                {currencies.map((c) => (
                  <MenuItem key={c.code} value={c.code}>
                    {c.name}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box className="col-md-6">
              <TextField
                fullWidth
                select
                label="Timezone"
                value={preferences.timezone}
                onChange={(e) => handleChange("timezone", e.target.value)}
              >
                {timezones.map((tz) => (
                  <MenuItem key={tz.value} value={tz.value}>
                    {tz.label}
                  </MenuItem>
                ))}
              </TextField>
            </Box>
            <Box className="col-md-6">
              <TextField
                fullWidth
                select
                label="Date Format"
                value={preferences.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
              >
                <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
              </TextField>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Notification Preferences
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.emailNotifications}
                  onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Email Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">Receive updates via email</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.pushNotifications}
                  onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Push Notifications</Typography>
                  <Typography variant="caption" color="text.secondary">Receive browser push notifications</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.budgetAlerts}
                  onChange={(e) => handleChange("budgetAlerts", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Budget Alerts</Typography>
                  <Typography variant="caption" color="text.secondary">Get notified when approaching budget limits</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.goalReminders}
                  onChange={(e) => handleChange("goalReminders", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Goal Reminders</Typography>
                  <Typography variant="caption" color="text.secondary">Remind me about my financial goals</Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      {/* Report Settings */}
      <Card elevation={0} sx={{ boxShadow: "0 2px 12px rgba(0,0,0,0.08)", mb: 3 }}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight={600} sx={{ mb: 3 }}>
            Report Settings
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.weeklyReports}
                  onChange={(e) => handleChange("weeklyReports", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Weekly Summary</Typography>
                  <Typography variant="caption" color="text.secondary">Receive weekly expense summary every Sunday</Typography>
                </Box>
              }
            />
            <Divider />
            <FormControlLabel
              control={
                <Switch
                  checked={preferences.monthlyReports}
                  onChange={(e) => handleChange("monthlyReports", e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Box>
                  <Typography variant="body2" fontWeight={500}>Monthly Reports</Typography>
                  <Typography variant="caption" color="text.secondary">Receive detailed monthly reports on the 1st</Typography>
                </Box>
              }
            />
          </Box>
        </CardContent>
      </Card>

      <Button
        variant="contained"
        onClick={handleSave}
        sx={{
          textTransform: "none",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        }}
      >
        Save Preferences
      </Button>
    </Box>
  );
};

export default PreferencesSettings;
