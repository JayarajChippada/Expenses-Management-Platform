import { useState } from "react";
import { useAppDispatch } from "../../../store/hooks";
import {
  categoryStart,
  categoryFailure,
  createCategorySuccess,
} from "../../../store/slices/category.slice";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";

interface AddCategoryModalProps {
  show: boolean;
  onClose: (newCategoryName?: string) => void;
  type?: "expense" | "income" | "goal" | "budget";
}

const AddCategoryModal = ({
  show,
  onClose,
  type = "expense",
}: AddCategoryModalProps) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    categoryName: "",
    icon: "📁",
    type: type,
    color: "#6366f1",
    keywords: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(categoryStart());
    try {
      const payload = {
        ...formData,
        type,
        keywords: formData.keywords
          .split(",")
          .map((k) => k.trim())
          .filter((k) => k !== ""),
      };

      const response = await api.post(API_ENDPOINTS.CATEGORIES.BASE, payload);
      dispatch(createCategorySuccess(response.data.data));
      onClose(response.data.data.categoryName);
    } catch (error: any) {
      console.error("Failed to add category", error);
      dispatch(
        categoryFailure(
          error.response?.data?.message || "Failed to create category"
        )
      );
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1070 }}></div>
      <div
        className="modal fade show d-block"
        tabIndex={-1}
        style={{ zIndex: 1080 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Add New Category</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => onClose()}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Category Name
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.categoryName}
                    onChange={(e) =>
                      setFormData({ ...formData, categoryName: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Select Icon
                  </label>
                  <div
                    className="d-flex flex-wrap gap-2 p-3 bg-light rounded-3 border"
                    style={{ maxHeight: "150px", overflowY: "auto" }}
                  >
                    {[
                      "📁",
                      "💰",
                      "🍕",
                      "🚗",
                      "🏠",
                      "🎮",
                      "👕",
                      "🏥",
                      "✈️",
                      "💻",
                      "🎬",
                      "📚",
                      "🏋️",
                      "🎁",
                      "📱",
                      "💡",
                      "🛠️",
                      "🛒",
                      "🚿",
                      "🚆",
                      "🚲",
                      "🐾",
                      "☕",
                      "🍺",
                      "🍷",
                      "🍹",
                      "🍰",
                      "🍎",
                      "🥦",
                      "🥩",
                    ].map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        className={`btn btn-sm ${
                          formData.icon === emoji
                            ? "btn-primary shadow-sm"
                            : "btn-outline-light text-dark"
                        }`}
                        style={{
                          fontSize: "1.2rem",
                          width: "45px",
                          height: "45px",
                        }}
                        onClick={() =>
                          setFormData({ ...formData, icon: emoji })
                        }
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="row g-3">
                  <div className="col-12 mb-3">
                    <label className="form-label small fw-bold">
                      Color Theme
                    </label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100 rounded-3 border-0"
                      style={{ height: "40px" }}
                      value={formData.color}
                      onChange={(e) =>
                        setFormData({ ...formData, color: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">
                    Keywords (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    placeholder="e.g. Amazon, Uber, Swiggy (comma separated)"
                    value={formData.keywords}
                    onChange={(e) =>
                      setFormData({ ...formData, keywords: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  type="button"
                  className="btn btn-light rounded-3 px-4"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary rounded-3 px-4"
                  disabled={loading}
                >
                  {loading ? "Adding..." : "Add Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddCategoryModal;
