import { useState } from "react";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import {
  authStart,
  authFailure,
  updateUserSuccess,
} from "../../../store/slices/auth.slice";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";
import { validatePassword, validateName } from "../../../utils/validation";

const ProfileSettings = () => {
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    currency: user?.currency || "INR",
    timeZone: user?.timeZone || "Asia/Kolkata",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [profileFeedback, setProfileFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    setProfileFeedback(null);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setPasswordFeedback(null);
  };

  const handleSaveProfile = async () => {
    dispatch(authStart());
    setProfileFeedback(null);

    try {
      const nameError = validateName(profileData.fullName);
      if (nameError) {
        setProfileFeedback({ type: "error", message: nameError });
        return;
      }

      const response = await api.patch(API_ENDPOINTS.USERS.UPDATE(user!._id), {
        fullName: profileData.fullName,
        currency: profileData.currency,
        timeZone: profileData.timeZone,
      });

      dispatch(updateUserSuccess(response.data.data));
      setProfileFeedback({
        type: "success",
        message: "Profile updated successfully!",
      });
      setTimeout(() => setProfileFeedback(null), 3000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to update profile";
      dispatch(authFailure(errorMessage));
      setProfileFeedback({ type: "error", message: errorMessage });
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordFeedback(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordFeedback({ type: "error", message: "Passwords do not match" });
      return;
    }

    const passwordError = validatePassword(passwordData.newPassword);
    if (passwordError) {
      setPasswordFeedback({ type: "error", message: passwordError });
      return;
    }

    dispatch(authStart());

    try {
      await api.patch(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
        oldPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      // authFailure resets loading but doesn't set global error if we handle it locally
      // Actually we should probably have a dedicated settings start/end or just use loading
      dispatch(updateUserSuccess(user!)); // Just to stop loading state
      setPasswordFeedback({
        type: "success",
        message: "Password changed successfully!",
      });
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setTimeout(() => setPasswordFeedback(null), 3000);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Failed to change password";
      dispatch(authFailure(errorMessage));
      setPasswordFeedback({ type: "error", message: errorMessage });
    }
  };

  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="d-flex justify-content-center">
      <div className="col-md-6">
        {/* Profile Info */}
        <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
          <div className="card-body p-4">
            {profileFeedback && (
              <div
                className={`alert alert-${
                  profileFeedback.type === "success" ? "success" : "danger"
                } border-0 rounded-3 d-flex align-items-center mb-4 shadow-sm`}
                role="alert"
              >
                <i
                  className={`bi bi-${
                    profileFeedback.type === "success"
                      ? "check-circle-fill"
                      : "exclamation-triangle-fill"
                  } me-2 fs-5`}
                ></i>
                <div>{profileFeedback.message}</div>
              </div>
            )}

            <div className="d-flex flex-column gap-4">
              <div className="text-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow-sm border border-4 border-white"
                  style={{
                    width: "120px",
                    height: "120px",
                    fontSize: "44px",
                    background: "var(--primary-gradient)",
                    color: "white",
                    fontWeight: "900",
                  }}
                >
                  {getInitials(profileData.fullName)}
                </div>
                <button className="btn btn-sm btn-outline-primary rounded-pill px-4 fw-bold">
                  <i className="bi bi-camera-fill me-1"></i> Update Avatar
                </button>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex flex-column gap-3">
                  <div className="w-100">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      className="form-control rounded-3 py-2"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleProfileChange}
                    />
                  </div>
                  <div className="w-100">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Email Address (Primary)
                    </label>
                    <input
                      type="email"
                      className="form-control bg-light border-light-subtle rounded-3 py-2"
                      name="email"
                      value={profileData.email}
                      disabled
                    />
                    <div className="extra-small mt-1 text-muted fw-medium">
                      <i className="bi bi-lock-fill me-1"></i>Email cannot be
                      modified
                    </div>
                  </div>
                  <div className="w-100">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Currency
                    </label>
                    <select
                      className="form-select rounded-3 py-2"
                      name="currency"
                      value={profileData.currency}
                      onChange={handleProfileChange}
                    >
                      <option value="INR">INR (₹)</option>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                    </select>
                  </div>
                  <div className="w-100">
                    <label className="form-label small fw-bold text-muted mb-1">
                      Timezone
                    </label>
                    <select
                      className="form-select rounded-3 py-2"
                      name="timeZone"
                      value={profileData.timeZone}
                      onChange={handleProfileChange}
                    >
                      <option value="Asia/Kolkata">Asia/Kolkata</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">America/New_York</option>
                      <option value="Europe/London">Europe/London</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 d-flex justify-content-end">
              <button
                className="btn btn-primary-gradient px-4 py-2 rounded-3 fw-bold shadow-sm d-flex align-items-center gap-2"
                onClick={handleSaveProfile}
                disabled={loading}
              >
                {loading && (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                )}
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-4">
          <div className="card-body p-4">
            {passwordFeedback && (
              <div
                className={`alert alert-${
                  passwordFeedback.type === "success" ? "success" : "danger"
                } border-0 rounded-3 d-flex align-items-center mb-4 shadow-sm`}
                role="alert"
              >
                <i
                  className={`bi bi-${
                    passwordFeedback.type === "success"
                      ? "check-circle-fill"
                      : "exclamation-triangle-fill"
                  } me-2 fs-5`}
                ></i>
                <div>{passwordFeedback.message}</div>
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ maxWidth: "600px" }}>
              <div className="mb-3">
                <label className="form-label small fw-bold text-muted mb-1">
                  Current Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-light-subtle rounded-start-3">
                    <i className="bi bi-key text-muted"></i>
                  </span>
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    className="form-control border-light-subtle border-start-0 rounded-end-3 py-2"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                  <button
                    className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3 border-0 shadow-none"
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    style={{ zIndex: 10 }}
                  >
                    <i
                      className={`bi ${
                        showPasswords.current
                          ? "bi-eye-slash-fill"
                          : "bi-eye-fill"
                      }`}
                    ></i>
                  </button>
                </div>
              </div>

              <div className="d-flex flex-column gap-3 mb-4">
                <div className="w-100">
                  <label className="form-label small fw-bold text-muted mb-1">
                    New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light-subtle rounded-start-3">
                      <i className="bi bi-shield-lock text-muted"></i>
                    </span>
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      className="form-control border-light-subtle border-start-0 rounded-end-3 py-2"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3 border-0 shadow-none"
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          new: !showPasswords.new,
                        })
                      }
                      style={{ zIndex: 10 }}
                    >
                      <i
                        className={`bi ${
                          showPasswords.new
                            ? "bi-eye-slash-fill"
                            : "bi-eye-fill"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>
                <div className="w-100">
                  <label className="form-label small fw-bold text-muted mb-1">
                    Confirm New Password
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-light border-light-subtle rounded-start-3">
                      <i className="bi bi-shield-check text-muted"></i>
                    </span>
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      className="form-control border-light-subtle border-start-0 rounded-end-3 py-2"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      required
                    />
                    <button
                      className="btn btn-link position-absolute end-0 top-50 translate-middle-y text-muted pe-3 border-0 shadow-none"
                      type="button"
                      onClick={() =>
                        setShowPasswords({
                          ...showPasswords,
                          confirm: !showPasswords.confirm,
                        })
                      }
                      style={{ zIndex: 10 }}
                    >
                      <i
                        className={`bi ${
                          showPasswords.confirm
                            ? "bi-eye-slash-fill"
                            : "bi-eye-fill"
                        }`}
                      ></i>
                    </button>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="submit"
                  className="btn btn-outline-primary border-2 px-4 py-2 rounded-3 fw-bold d-flex align-items-center gap-2"
                  disabled={loading}
                >
                  {loading && (
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                  )}
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
