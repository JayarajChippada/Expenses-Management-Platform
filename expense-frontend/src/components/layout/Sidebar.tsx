import { NavLink, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { closeSidebar } from "../../features/ui/uiSlice";
import { logOut } from "../../features/auth/authSlice";

interface SidebarProps {
  isMobile: boolean;
}

const navItems = [
  { label: "Dashboard", path: "/dashboard", icon: "bi-speedometer2" },
  { label: "Expenses", path: "/expenses", icon: "bi-receipt" },
  { label: "Income", path: "/income", icon: "bi-wallet2" },
  { label: "Budgets", path: "/budgets", icon: "bi-graph-up-arrow" },
  { label: "Goals", path: "/goals", icon: "bi-flag" },
  { label: "Reports", path: "/reports", icon: "bi-bar-chart-line" },
  { label: "Settings", path: "/settings", icon: "bi-gear" },
];

const Sidebar = ({ isMobile }: SidebarProps) => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logOut());
    navigate("/login");
  };

  const handleNavClick = () => {
    if (isMobile) {
      dispatch(closeSidebar());
    }
  };

  const getInitials = (name: string | undefined) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  };

  const SidebarContent = () => (
    <div className="d-flex flex-column h-100">
      <div className="p-4 mb-2">
        <div className="d-flex align-items-center gap-3">
          <div className="rounded-3 bg-primary-custom d-flex align-items-center justify-content-center p-2 shadow-sm" style={{ width: '40px', height: '40px' }}>
            <i className="bi bi-person-workspace text-primary-custom fs-4"></i>
          </div>
          <span className="fw-bold h5 mb-0 text-dark">ExpenseTracker</span>
        </div>
      </div>

      <nav className="nav flex-column px-3 gap-1 flex-grow-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `nav-link d-flex align-items-center gap-3 py-2 px-3 fw-medium transition-all ${isActive ? 'active' : 'text-muted'}`
            }
          >
            <i className={`bi ${item.icon} fs-5`}></i>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile Section at Bottom */}
      <div className="mt-auto border-top p-3 mx-2 mb-2">
        <div
          className="d-flex align-items-center gap-3 p-2 rounded-3 hover-bg-light transition-all"
          style={{ cursor: "pointer", userSelect: "none" }}
        >
          <div
            className="rounded-circle avatar-gradient d-flex align-items-center justify-content-center text-white fw-bold shadow-sm flex-shrink-0"
            style={{
              width: 40,
              height: 40,
              fontSize: 14,
              lineHeight: "1"
            }}
          >
            {getInitials(user?.fullName)}
          </div>
          
          <div className="flex-grow-1 overflow-hidden">
            <div className="fw-bold text-dark text-truncate small">
              {user?.fullName || "Jayaraj Chippada"}
            </div>
            <div className="text-muted extra-small text-truncate">
              {user?.email || "jayaraj@example.com"}
            </div>
          </div>
          
          <button
            className="btn btn-sm text-danger p-0 border-0"
            onClick={handleLogout}
            title="Logout"
          >
            <i className="bi bi-box-arrow-right fs-5"></i>
          </button>
        </div>
      </div>

    </div>
  );

  if (isMobile) {
    return (
      <>
        {sidebarOpen && (
          <div className="offcanvas-backdrop fade show" onClick={() => dispatch(closeSidebar())}></div>
        )}
        <div
          className={`offcanvas offcanvas-start ${sidebarOpen ? 'show' : ''}`}
          style={{ visibility: sidebarOpen ? 'visible' : 'hidden', width: '280px', borderRight: 'none' }}
        >
          <div className="offcanvas-header justify-content-end p-2">
            <button type="button" className="btn-close" onClick={() => dispatch(closeSidebar())}></button>
          </div>
          <div className="offcanvas-body p-0">
            <SidebarContent />
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="sidebar d-flex flex-column position-fixed h-100 border-end border-light">
      <SidebarContent />
    </div>
  );
};

export default Sidebar;
