import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";
import { validateEmail, validatePassword, validateName } from "../../utils/validation";

type FormData = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

type FormErrors = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string
}

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [successMessage, setSuccessMessage] = useState<string>("")
  const [loading, setLoading] = useState<boolean> (false)
  const [mandatory, setMandatory] = useState<boolean> (true)



  const validateFields = (fieldName: string, fieldValue: string) => {
    let errors: FormErrors = {...formErrors}
    switch(fieldName) {
      case "fullName": {
        errors.fullName = validateName(fieldValue) || "";
        break;
      }
      case "email": {
        errors.email = validateEmail(fieldValue) || "";
        break;
      }
      case "password": {
        errors.password = validatePassword(fieldValue) || "";
        break;
      }
      case "confirmPassword": {
        if (!fieldValue) {
          errors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== fieldValue) {
          errors.confirmPassword = "Passwords do not match";
        }
        else {
          errors.confirmPassword = ""
        }
        break;
      }
    }
    setFormErrors(errors)
    const allFieldsFilled = Object.values(formData).every((val) => val !== "")
    setMandatory(!allFieldsFilled)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({...formData, [name]: value})
    validateFields(name, value)
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = Object.values(formErrors).every((val) => val === "")
    if (!isFormValid) return;
    try {
      setLoading(true)
      await api.post(API_ENDPOINTS.AUTH.REGISTER, {
        fullName: formData.fullName,
        email: formData.email, 
        password: formData.password,
      });
      setLoading(false)
      setSuccessMessage("Registration successful! Redirecting to Login Page in 3 secs...")
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
      setTimeout(() => {
        navigate("/login");
      }, 3000)
    } catch (err: any) {
      setLoading(false)
      setErrorMessage("Registration failed. Please try again.")
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: ""
      })
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
                  <i className="bi bi-wallet2 text-primary-custom" style={{ fontSize: '48px' }}></i>
                  <h4 className="mt-2 fw-bold text-primary-custom">ExpenseManager</h4>
                </div>

                <h5 className="text-center fw-bold mb-1">Create Account</h5>
                <p className="text-center text-muted mb-4">Sign up to start managing your expenses</p>

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
                    <label htmlFor="fullName" className="form-label">Full Name</label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.fullName ? 'is-invalid' : ''}`}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      autoComplete="name"
                    />
                    {formErrors.fullName && (
                      <div className="invalid-feedback">{formErrors.fullName}</div>
                    )}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email Address</label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.email ? 'is-invalid' : ''}`}
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
                    <label htmlFor="password" className="form-label">Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className={`form-control ${formErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {formErrors.password && (
                        <div className="invalid-feedback">{formErrors.password}</div>
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className={`form-control ${formErrors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm your password"
                        autoComplete="new-password"
                      />
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {formErrors.confirmPassword && (
                        <div className="invalid-feedback">{formErrors.confirmPassword}</div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary-gradient w-100 py-2 fw-semibold"
                    disabled={mandatory || loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    ) : null}
                    Create Account
                  </button>
                </form>

                <p className="text-center mt-4 mb-0">
                  Already have an account?{" "}
                  <Link to="/login" className="link-primary-custom fw-semibold">
                    Sign In
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

export default Register;
