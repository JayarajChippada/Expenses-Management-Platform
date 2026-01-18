import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";
import { validateEmail } from "../../utils/validation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // success state removed as we navigate away
  const [validationError, setValidationError] = useState("");

  const navigate = useNavigate();

  const validateEmailField = () => {
    const error = validateEmail(email);
    if (error) {
      setValidationError(error);
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmailField()) return;

    setLoading(true);
    setError("");
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, {
        email,
      });
      // The backend returns { success: true, message: resetUrl }
      const resetUrl = response.data.message;
      navigate("/reset-password", { state: { email, resetUrl } });
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to send reset link. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-bg d-flex align-items-center justify-content-center py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5 col-xl-4">
            <div className="card shadow-lg border-0 rounded-4">
              <div className="card-body p-4 p-md-5">
                {/* Logo */}
                <div className="text-center mb-4">
                  <img
                    src="/assets/logo.png"
                    alt="Logo"
                    style={{ width: "80px", height: "80px" }}
                    className="mb-2"
                  />
                  <h4 className="mt-2 fw-bold text-primary-custom">
                    Expense Manager
                  </h4>
                </div>

                <h5 className="text-center fw-bold mb-1">Forgot Password?</h5>
                <p className="text-center text-muted mb-4">
                  Enter your email address and we'll send you instructions to
                  reset your password
                </p>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email Address
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        validationError ? "is-invalid" : ""
                      }`}
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setValidationError("");
                      }}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    {validationError && (
                      <div className="invalid-feedback">{validationError}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-gradient w-100 py-2 fw-semibold mb-3"
                    disabled={loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                    ) : null}
                    Send Reset Link
                  </button>

                  <div className="text-center">
                    <Link to="/login" className="link-primary-custom">
                      <i className="bi bi-arrow-left me-1"></i>
                      Back to Login
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
