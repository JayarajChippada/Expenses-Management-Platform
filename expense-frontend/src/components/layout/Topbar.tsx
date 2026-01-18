import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleSidebar, setTheme } from "../../store/slices/ui.slice";
import { logOut } from "../../store/slices/auth.slice";

import NotificationDropdown from "../common/NotificationDropdown";

interface TopbarProps {
  isMobile: boolean;
}

const Topbar = ({ isMobile }: TopbarProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);

  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogout = () => {
    setShowDropdown(false);
    dispatch(logOut());
    navigate("/login");
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/settings");
  };

  const toggleTheme = () => {
    dispatch(setTheme(theme === "light" ? "dark" : "light"));
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <nav
      className="topbar navbar navbar-light fixed-top px-4"
      style={{
        marginLeft: isMobile ? 0 : "260px",
        transition: "margin-left 0.3s ease-in-out",
      }}
    >
      <div className="container-fluid p-0 d-flex justify-content-between">
        <div className="d-flex align-items-center flex-grow-1">
          {isMobile && (
            <button
              className="btn btn-link text-dark p-0 me-3 shadow-none border-0"
              onClick={() => dispatch(toggleSidebar())}
            >
              <i className="bi bi-list fs-3"></i>
            </button>
          )}

          {/* Search Bar */}
          {!isMobile && (
            <div className="search-input-group d-flex align-items-center">
              <i className="bi bi-search text-muted small me-2"></i>
              <input type="text" placeholder="Search transactions..." />
            </div>
          )}
        </div>

        <div className="d-flex align-items-center gap-2 gap-md-3">
          {/* Theme Toggle */}
          <button
            className="btn btn-link text-secondary p-1 d-flex align-items-center border-0 text-decoration-none shadow-none"
            onClick={toggleTheme}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            <i
              className={`bi ${
                theme === "light" ? "bi-moon-stars" : "bi-sun"
              } fs-5`}
            ></i>
          </button>

          {/* Notifications */}
          <NotificationDropdown />

          {/* User Info & Dropdown */}
          <div className="dropdown position-relative">
            <button
              className="btn p-1 d-flex align-items-center gap-2 border-0 shadow-none"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div
                className="rounded-circle avatar-gradient d-flex align-items-center justify-content-center text-white fw-bold shadow-sm"
                style={{ width: "38px", height: "38px", fontSize: "13px" }}
              >
                {getInitials(user?.fullName)}
              </div>
              {!isMobile && (
                <div className="text-start me-1">
                  <div className="fw-bold text-dark small leading-1">
                    {user?.fullName || "User"}
                  </div>
                  <div className="d-flex justify-content-end">
                    <i className="bi bi-chevron-down extra-small text-muted"></i>
                  </div>
                </div>
              )}
            </button>

            {showDropdown && (
              <>
                <div
                  className="position-fixed top-0 start-0 w-100 h-100"
                  style={{ zIndex: 1050 }}
                  onClick={() => setShowDropdown(false)}
                ></div>
                <div
                  className="dropdown-menu show border-0 shadow-lg p-2 mt-2"
                  style={{
                    position: "absolute",
                    top: "100%",
                    right: 0,
                    minWidth: "220px",
                    marginTop: "10px",
                    borderRadius: "12px",
                    zIndex: 1051,
                  }}
                >
                  <div className="px-3 py-2 border-bottom mb-2">
                    <div className="fw-bold text-dark">
                      {user?.fullName || "User"}
                    </div>
                    <div className="text-muted extra-small">{user?.email}</div>
                  </div>
                  <button
                    className="dropdown-item py-2 rounded-2 d-flex align-items-center gap-2"
                    onClick={handleProfile}
                  >
                    <i className="bi bi-person me-2"></i>
                    Profile
                  </button>
                  <hr className="dropdown-divider opacity-50" />
                  <button
                    className="dropdown-item py-2 rounded-2 text-danger d-flex align-items-center gap-2"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Topbar;
