import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchNotifications,
  markAllAsRead,
  markAsRead,
  deleteNotification,
} from "../../services/notification.service";


const Notifications = () => {
  const dispatch = useAppDispatch();
  const { list, loading } = useAppSelector((state) => state.notifications);
  const [filter, setFilter] = useState<"all" | "read" | "unread">("all");

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const filteredList = list.filter((n) => {
    if (filter === "read") return n.isRead;
    if (filter === "unread") return !n.isRead;
    return true;
  });

  const handleMarkAllRead = () => {
    dispatch(markAllAsRead());
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Delete this notification?")) {
      dispatch(deleteNotification(id));
    }
  };

  const handleClick = (id: string, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  const getIcon = (title: string) => {
    if (title.includes("GOAL")) return "bi-trophy-fill text-warning";
    if (title.includes("BUDGET")) return "bi-wallet-fill text-danger";
    return "bi-bell-fill text-primary";
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold mb-1">Notifications</h4>
          <p className="text-muted small mb-0">Manage your alerts and updates</p>
        </div>
        {list.some((n) => !n.isRead) && (
          <button
            className="btn btn-light btn-sm fw-medium text-primary-custom"
            onClick={handleMarkAllRead}
          >
            <i className="bi bi-check-all me-1"></i> Mark all as read
          </button>
        )}
      </div>

      <div className="card shadow-sm border-0 rounded-4 overflow-hidden">
        <div className="card-header bg-white border-bottom p-0">
          <ul className="nav nav-tabs nav-justified border-0">
            {[
              { id: "all", label: "All" },
              { id: "unread", label: "Unread" },
              { id: "read", label: "Read" },
            ].map((tab) => (
              <li className="nav-item" key={tab.id}>
                <button
                  className={`nav-link py-3 border-0 rounded-0 ${
                    filter === tab.id
                      ? "active fw-bold border-bottom border-primary border-3"
                      : "text-muted"
                  }`}
                  onClick={() => setFilter(tab.id as any)}
                >
                    {tab.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center p-5">
              <div className="mb-3">
                <i className="bi bi-bell-slash fs-1 text-muted opacity-25"></i>
              </div>
              <h6 className="text-muted">No notifications found</h6>
            </div>
          ) : (
            <div className="list-group list-group-flush">
              {filteredList.map((notification) => (
                <div
                  key={notification._id}
                  className={`list-group-item list-group-item-action p-4 border-bottom ${
                    !notification.isRead ? "bg-light-subtle" : ""
                  }`}
                  role="button"
                  onClick={() => handleClick(notification._id, notification.isRead)}
                >
                  <div className="d-flex gap-3">
                    <div className="flex-shrink-0 mt-1">
                      <div className="rounded-circle bg-light d-flex align-items-center justify-content-center" style={{width: 40, height: 40}}>
                        <i className={`bi ${getIcon(notification.title)} fs-5`}></i>
                      </div>
                    </div>
                    <div className="flex-grow-1">
                      <div className="d-flex justify-content-between align-items-start mb-1">
                        <h6 className={`mb-0 ${!notification.isRead ? "fw-bold" : ""}`}>
                          {notification.message}
                        </h6>
                        <small className="text-muted ms-2 text-nowrap">
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                      <p className="mb-1 small text-muted text-uppercase fw-bold" style={{fontSize: '0.75rem'}}>
                        {notification.title.replace(/_/g, " ")}
                      </p>
                    </div>
                    <div className="flex-shrink-0 ms-2">
                        <button 
                            className="btn btn-outline-danger btn-sm rounded-circle p-0 d-flex align-items-center justify-content-center" 
                            style={{width: 32, height: 32}}
                            onClick={(e) => handleDelete(notification._id, e)}
                        >
                            <i className="bi bi-trash"></i>
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
