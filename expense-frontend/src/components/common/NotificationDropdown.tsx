import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchNotifications, markAllAsRead, markAsRead } from "../../services/notification.service";

const NotificationDropdown = () => {
  const dispatch = useAppDispatch();
  const { list, unreadCount } = useAppSelector((state) => state.notifications);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Initial fetch
    dispatch(fetchNotifications());

    // Poll every minute
    const interval = setInterval(() => {
        dispatch(fetchNotifications());
    }, 60000);

    return () => clearInterval(interval);
  }, [dispatch]);

  const handleMarkRead = (id: string) => {
    dispatch(markAsRead(id));
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    dispatch(markAllAsRead());
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  const getIcon = (title: string) => {
    if (title.includes("GOAL")) return "bi-trophy-fill text-warning";
    if (title.includes("BUDGET")) return "bi-wallet-fill text-danger";
    return "bi-bell-fill text-primary";
  };

  return (
    <div className="dropdown position-relative">
      <button
        className="btn btn-light rounded-circle position-relative border-0 shadow-sm"
        type="button"
        onClick={toggleDropdown}
        style={{ width: 40, height: 40 }}
      >
        <i className="bi bi-bell-fill" style={{ color: "var(--text-muted)" }}></i>
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
            {unreadCount > 9 ? "9+" : unreadCount}
            <span className="visually-hidden">unread messages</span>
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div
            className="position-fixed top-0 start-0 w-100 h-100"
            style={{ zIndex: 1050 }}
            onClick={closeDropdown}
          />
          <div
            className="dropdown-menu dropdown-menu-end show shadow-lg rounded-4 border-0 mt-2 p-0 overflow-hidden"
            style={{ 
                width: "320px", 
                maxWidth: "90vw", 
                position: "absolute", 
                right: 0, 
                zIndex: 1051,
                top: "100%" 
            }}
          >
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-light">
              <h6 className="mb-0 fw-bold">Notifications</h6>
              {unreadCount > 0 && (
                <button
                  className="btn btn-link btn-sm p-0 text-decoration-none text-primary-custom fw-bold"
                  style={{ fontSize: "0.75rem" }}
                  onClick={handleMarkAllRead}
                >
                  Mark all read
                </button>
              )}
            </div>

            <div className="list-group list-group-flush" style={{ maxHeight: "300px", overflowY: "auto" }}>
              {list.length === 0 ? (
                <div className="text-center p-4">
                  <i className="bi bi-bell-slash text-muted opacity-50 fs-4 mb-2 d-block"></i>
                  <small className="text-muted">No notifications</small>
                </div>
              ) : (
                list.slice(0, 5).map((n) => (
                  <div
                    key={n._id}
                    className={`list-group-item list-group-item-action p-3 border-bottom-0 border-top ${
                        !n.isRead ? "bg-primary-subtle bg-opacity-10" : ""
                    }`}
                    onClick={() => handleMarkRead(n._id)}
                    role="button"
                  >
                    <div className="d-flex gap-3 align-items-start">
                        <div className="flex-shrink-0 mt-1">
                            <i className={`bi ${getIcon(n.title)}`}></i>
                        </div>
                      <div className="flex-grow-1">
                        <p className={`mb-1 small lh-sm ${!n.isRead ? "fw-bold text-dark" : "text-secondary"}`}>
                          {n.message}
                        </p>
                        <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted extra-small text-uppercase fw-bold" style={{fontSize: '0.65rem'}}>
                                {n.title.replace(/_/g, " ")}
                            </small>
                            <small className="text-muted extra-small">
                                {new Date(n.createdAt).toLocaleDateString()}
                            </small>
                        </div>
                      </div>
                       {!n.isRead && <span className="p-1 rounded-circle bg-primary position-absolute end-0 me-3 mt-2" style={{width: 8, height: 8}}></span>}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-2 border-top bg-light text-center">
              <Link
                to="/notifications"
                className="text-decoration-none fw-bold small text-primary-custom"
                onClick={closeDropdown}
              >
                View All Notifications
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationDropdown;
