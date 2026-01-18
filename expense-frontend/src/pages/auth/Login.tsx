import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  authStart,
  authSuccess,
  authFailure,
} from "../../store/slices/auth.slice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";
import { validateEmail } from "../../utils/validation";

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

type FormErrors = {
  email: string;
  password: string;
};

const Login = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [mandatory, setMandatory] = useState<boolean>(true);

  const validateFields = (fieldName: string, fieldValue: string) => {
    let errors: FormErrors = { ...formErrors };
    switch (fieldName) {
      case "email": {
        errors.email = validateEmail(fieldValue) || "";
        break;
      }
      case "password": {
        if (!fieldValue) {
          errors.password = "Password is required";
        } else {
          errors.password = "";
        }
        break;
      }
    }
    setFormErrors(errors);
    const allFieldsFilled = Object.values(formData).every((val) => val !== "");
    setMandatory(!allFieldsFilled);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === "rememberMe" ? checked : value,
    });
    validateFields(name, value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = Object.values(formErrors).every((val) => val === "");
    if (!isFormValid) return;

    dispatch(authStart());
    try {
      const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: formData.email,
        password: formData.password,
      });
      dispatch(authSuccess(response.data));
      setSuccessMessage("Login successful!");
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
      navigate("/dashboard");
    } catch (err: any) {
      dispatch(
        authFailure(
          err.response?.data?.message || "Login failed. Please try again."
        )
      );
      setErrorMessage(
        err.response?.data?.message || "Login failed. Please try again."
      );
      setFormData({
        email: "",
        password: "",
        rememberMe: false,
      });
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
                  <i
                    className="bi bi-wallet2 text-primary-custom"
                    style={{ fontSize: "48px" }}
                  ></i>
                  <h4 className="mt-2 fw-bold text-primary-custom">
                    ExpenseManager
                  </h4>
                </div>

                <h5 className="text-center fw-bold mb-1">Welcome Back</h5>
                <p className="text-center text-muted mb-4">
                  Sign in to continue to your dashboard
                </p>

                {errorMessage && (
                  <div className="alert alert-danger py-2" role="alert">
                    {errorMessage}
                  </div>
                )}
                {successMessage && (
                  <div className="alert alert-success py-2" role="alert">
                    {successMessage}
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
                        formErrors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      autoComplete="email"
                    />
                    {formErrors.email && (
                      <div className="invalid-feedback">{formErrors.email}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${
                          formErrors.password ? "is-invalid" : ""
                        }`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i
                          className={`bi ${
                            showPassword ? "bi-eye-slash" : "bi-eye"
                          }`}
                        ></i>
                      </button>
                      {formErrors.password && (
                        <div className="invalid-feedback">
                          {formErrors.password}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id="rememberMe"
                        name="rememberMe"
                        checked={formData.rememberMe}
                        onChange={handleChange}
                      />
                      <label
                        className="form-check-label small"
                        htmlFor="rememberMe"
                      >
                        Remember me
                      </label>
                    </div>
                    <Link
                      to="/forgot-password"
                      className="link-primary-custom small"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-gradient w-100 py-2 fw-semibold"
                    disabled={mandatory || loading}
                  >
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                    ) : null}
                    Sign In
                  </button>
                </form>

                <p className="text-center mt-4 mb-0">
                  Don't have an account?{" "}
                  <Link
                    to="/register"
                    className="link-primary-custom fw-semibold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
