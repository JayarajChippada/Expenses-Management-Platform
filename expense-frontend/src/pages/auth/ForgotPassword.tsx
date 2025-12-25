import { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import { AccountBalanceWallet, ArrowBack } from "@mui/icons-material";
import { Link } from "react-router-dom";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [validationError, setValidationError] = useState("");

  const validateEmail = () => {
    if (!email) {
      setValidationError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError("Please enter a valid email");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    setLoading(true);
    setError("");
    try {
      await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        p: 3,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 440,
          borderRadius: 3,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <AccountBalanceWallet
              sx={{ fontSize: 56, color: "#667eea", mb: 2 }}
            />
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              Forgot Password?
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Enter your email address and we'll send you instructions to reset your password
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success ? (
            <Box sx={{ textAlign: "center" }}>
              <Alert severity="success" sx={{ mb: 3 }}>
                Password reset link has been sent to your email address
              </Alert>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                startIcon={<ArrowBack />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  borderColor: "#667eea",
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#5a6fd6",
                    bgcolor: "rgba(102, 126, 234, 0.05)",
                  },
                }}
              >
                Back to Login
              </Button>
            </Box>
          ) : (
            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setValidationError("");
                }}
                error={!!validationError}
                helperText={validationError}
                sx={{ mb: 3 }}
                autoComplete="email"
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={loading}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: 16,
                  fontWeight: 600,
                  mb: 2,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd6 0%, #6a4190 100%)",
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : "Send Reset Link"}
              </Button>

              <Button
                component={Link}
                to="/login"
                fullWidth
                startIcon={<ArrowBack />}
                sx={{
                  textTransform: "none",
                  color: "#667eea",
                }}
              >
                Back to Login
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;
