import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import api from "../../services/axios"
import { validatePassword } from "../../utils/validation"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validationErrors, setValidationErrors] = useState<{ password?: string; confirmPassword?: string }>({})

  const location = useLocation()
  const navigate = useNavigate()
  const { email, resetUrl } = location.state || {}

  useEffect(() => {
    if (!resetUrl || !email) {
      // If accessed directly without flow, redirect to forgot password
      navigate("/forgot-password")
    }
  }, [resetUrl, email, navigate])

  const validateForm = () => {
    const errors: { password?: string; confirmPassword?: string } = {}
    let isValid = true

    const passwordError = validatePassword(password)
    if (passwordError) {
      errors.password = passwordError
      isValid = false
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match"
      isValid = false
    }

    setValidationErrors(errors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError("")

    try {
      // The resetUrl from backend is a full URL (http://localhost:3000/...). 
      // api instance has baseURL set. We should pass the relative path or handle the full URL.
      // If we pass a full URL to axios, it ignores baseURL. 
      // However, we need to ensure the body matches what backend expects: { email, password }
      
      await api.patch(resetUrl, { email, password })
      setSuccess(true)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (!email || !resetUrl) return null // Prevent flash before redirect

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

                <h5 className="text-center fw-bold mb-1">Reset Password</h5>
                <p className="text-center text-muted mb-4">
                  Create a new password for {email}
                </p>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                {success ? (
                  <div className="text-center">
                    <div className="alert alert-success" role="alert">
                      Password has been reset successfully!
                    </div>
                    <Link to="/login" className="btn btn-primary-gradient w-100 py-2 fw-semibold">
                      Back to Login
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">New Password</label>
                      <input
                        type="password"
                        className={`form-control ${validationErrors.password ? 'is-invalid' : ''}`}
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value)
                          setValidationErrors({ ...validationErrors, password: "" })
                        }}
                        placeholder="Enter new password"
                      />
                      {validationErrors.password && (
                        <div className="invalid-feedback">{validationErrors.password}</div>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                      <input
                        type="password"
                        className={`form-control ${validationErrors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value)
                          setValidationErrors({ ...validationErrors, confirmPassword: "" })
                        }}
                        placeholder="Confirm new password"
                      />
                      {validationErrors.confirmPassword && (
                        <div className="invalid-feedback">{validationErrors.confirmPassword}</div>
                      )}
                    </div>

                    <button
                      type="submit"
                      className="btn btn-primary-gradient w-100 py-2 fw-semibold mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      ) : null}
                      Reset Password
                    </button>

                    <div className="text-center">
                      <Link to="/login" className="link-primary-custom">
                        Cancel
                      </Link>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword
