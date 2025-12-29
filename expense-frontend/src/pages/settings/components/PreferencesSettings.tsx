import { useState, useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { authStart, authFailure, updateUserSuccess } from "../../../features/auth/authSlice";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";

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
  const dispatch = useAppDispatch();
  const { user, loading } = useAppSelector((state) => state.auth);

  const [preferences, setPreferences] = useState({
    currency: user?.currency || "INR",
    timeZone: user?.timeZone || "Asia/Kolkata",
    dateFormat: "DD/MM/YYYY",
    emailNotifications: true,
    pushNotifications: true,
    budgetAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    goalReminders: true,
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error', message: string } | null>(null);

  // Update preferences if user data changes (e.g. after profile update or sync)
  useEffect(() => {
    if (user) {
      setPreferences(prev => ({
        ...prev,
        currency: user.currency || prev.currency,
        timeZone: user.timeZone || prev.timeZone,
      }));
    }
  }, [user]);

  const handleChange = (name: string, value: any) => {
    setPreferences({ ...preferences, [name]: value });
    setFeedback(null);
  };

  const handleSave = async () => {
    dispatch(authStart());
    setFeedback(null);

    try {
      const response = await api.patch(API_ENDPOINTS.USERS.UPDATE(user!._id), preferences);
      dispatch(updateUserSuccess(response.data.data));
      setFeedback({ type: 'success', message: 'Preferences saved successfully!' });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to save preferences";
      dispatch(authFailure(errorMessage));
      setFeedback({ type: 'error', message: errorMessage });
    }
  };

  return (
    <div>
      {feedback && (
        <div className={`alert alert-${feedback.type === 'success' ? 'success' : 'danger'} border-0 rounded-3 d-flex align-items-center mb-4 shadow-sm`} role="alert">
          <i className={`bi bi-${feedback.type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-2 fs-5`}></i>
          <div>{feedback.message}</div>
        </div>
      )}

      {/* Regional Settings */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-4 text-dark">Regional & Localization</h6>

          <div className="row g-3" style={{ maxWidth: '800px' }}>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted mb-1">Currency</label>
              <select
                className="form-select rounded-3 py-2"
                value={preferences.currency}
                onChange={(e) => handleChange("currency", e.target.value)}
              >
                {currencies.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted mb-1">Timezone</label>
              <select
                className="form-select rounded-3 py-2"
                value={preferences.timeZone}
                onChange={(e) => handleChange("timeZone", e.target.value)}
              >
                {timezones.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted mb-1">Preferred Date Format</label>
              <select
                className="form-select rounded-3 py-2"
                value={preferences.dateFormat}
                onChange={(e) => handleChange("dateFormat", e.target.value)}
              >
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="card shadow-sm border-0 rounded-4 mb-4 overflow-hidden">
        <div className="card-body p-4">
          <h6 className="fw-bold mb-4 text-dark">Messaging & Notifications</h6>

          <div className="row g-4">
            <div className="col-md-6 border-end border-light">
              <div className="d-flex flex-column gap-3">
                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-2">
                  <div>
                    <label className="form-check-label fw-bold small d-block text-dark" htmlFor="emailNotifications">Email Communication</label>
                    <span className="text-muted extra-small fw-medium">Weekly digests and critical alerts</span>
                  </div>
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="checkbox"
                    role="switch"
                    id="emailNotifications"
                    checked={preferences.emailNotifications}
                    onChange={(e) => handleChange("emailNotifications", e.target.checked)}
                  />
                </div>
                
                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-2">
                  <div>
                    <label className="form-check-label fw-bold small d-block text-dark" htmlFor="pushNotifications">App Notifications</label>
                    <span className="text-muted extra-small fw-medium">Real-time web notifications</span>
                  </div>
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="checkbox"
                    role="switch"
                    id="pushNotifications"
                    checked={preferences.pushNotifications}
                    onChange={(e) => handleChange("pushNotifications", e.target.checked)}
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="d-flex flex-column gap-3">
                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-2">
                  <div>
                    <label className="form-check-label fw-bold small d-block text-dark" htmlFor="budgetAlerts">Smart Budget Alerts</label>
                    <span className="text-muted extra-small fw-medium">Notify when near or over budget</span>
                  </div>
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="checkbox"
                    role="switch"
                    id="budgetAlerts"
                    checked={preferences.budgetAlerts}
                    onChange={(e) => handleChange("budgetAlerts", e.target.checked)}
                  />
                </div>

                <div className="form-check form-switch d-flex justify-content-between align-items-center ps-0 mb-2">
                  <div>
                    <label className="form-check-label fw-bold small d-block text-dark" htmlFor="goalReminders">Goal Progress Reminders</label>
                    <span className="text-muted extra-small fw-medium">Periodic nudges about your goals</span>
                  </div>
                  <input
                    className="form-check-input ms-0 mt-0"
                    type="checkbox"
                    role="switch"
                    id="goalReminders"
                    checked={preferences.goalReminders}
                    onChange={(e) => handleChange("goalReminders", e.target.checked)}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary-gradient px-5 py-2 rounded-3 fw-bold shadow-sm mb-4 d-flex align-items-center gap-2"
        onClick={handleSave}
        disabled={loading}
      >
        {loading && <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>}
        Apply All Preferences
      </button>
    </div>
  );
};

export default PreferencesSettings;
