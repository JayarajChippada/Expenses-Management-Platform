import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { 
  categoryStart, 
  categoryFailure, 
  categoryNamesSuccess 
} from "../../../features/categories/categorySlice";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";
import AddCategoryModal from "../../expenses/components/AddCategoryModal";

interface GoalModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  goal?: any;
}

const priorities = ["High", "Medium", "Low"];
const GOAL_CATEGORIES = ["PURCHASE", "SAVINGS", "DEBT", "CUSTOM"];

const GoalModal = ({ open, onClose, onSubmit, goal }: GoalModalProps) => {

  const dispatch = useAppDispatch();
  const { names: backendCategories } = useAppSelector((state) => state.categories);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const fetchCategoryNames = useCallback(async () => {
    dispatch(categoryStart());
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.NAMES("goal"));
      dispatch(categoryNamesSuccess(response.data.data));
    } catch (error: any) {
      dispatch(categoryFailure(error.response?.data?.message || "Failed to fetch categories"));
    }
  }, [dispatch]);

  useEffect(() => {
    if (open) {
      fetchCategoryNames();
    }
  }, [open, fetchCategoryNames]);

  const [formData, setFormData] = useState({
    title: "",
    categoryName: "CUSTOM",
    description: "",
    targetAmount: "",
    currentAmount: "",
    priority: "Medium",
    targetDate: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || "",
        categoryName: goal.categoryName || "CUSTOM",
        description: goal.description || "",
        targetAmount: goal.targetAmount?.toString() || "",
        currentAmount: goal.currentAmount?.toString() || "0",
        priority: goal.priority?.charAt(0).toUpperCase() + goal.priority?.slice(1) || "Medium",
        targetDate: goal.targetDate?.split("T")[0] || "",
      });
    } else {
      setFormData({
        title: "",
        categoryName: "CUSTOM",
        description: "",
        targetAmount: "",
        currentAmount: "0",
        priority: "Medium",
        targetDate: "",
      });
    }
    setErrors({});
  }, [goal, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Goal title is required";
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.targetAmount || parseFloat(formData.targetAmount) <= 0) {
      newErrors.targetAmount = "Valid target amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "categoryName" && value === "Others") {
      setShowAddCategory(true);
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleCategoryAdded = (newCategoryName?: string) => {
    setShowAddCategory(false);
    if (newCategoryName) {
      setFormData(prev => ({ ...prev, categoryName: newCategoryName }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    onSubmit({
      ...formData,
      targetAmount: parseFloat(formData.targetAmount),
      currentAmount: parseFloat(formData.currentAmount) || 0,
      priority: formData.priority.toLowerCase(),
      status: "active",
      _id: goal?._id,
    });
    onClose();
  };

  if (!open) return null;

  return (
    <>
      <div className="modal fade show d-block shadow-sm" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-bottom-0 px-4 pt-4">
              <h5 className="modal-title fw-bold">
                {goal ? "Update Financial Goal" : "Set New Goal"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body px-4 py-3">
                <div className="row g-3">
                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Goal Name</label>
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.title ? 'is-invalid' : ''}`}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Dream Home, New Laptop"
                    />
                    {errors.title && <div className="invalid-feedback">{errors.title}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Goal Category</label>
                      <select
                        className={`form-select rounded-3 ${errors.categoryName ? 'is-invalid' : ''}`}
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                      >
                        <option value="">Select Category</option>
                        {GOAL_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        {backendCategories.filter(cat => !GOAL_CATEGORIES.includes(cat)).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                        <option value="Others" className="fw-bold text-primary">+ Add New Category</option>
                      </select>
                    {errors.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Description</label>
                    <textarea
                      className="form-control rounded-3"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Why are you saving for this?"
                    ></textarea>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Target Amount (₹)</label>
                    <input
                      type="number"
                      className={`form-control rounded-3 ${errors.targetAmount ? 'is-invalid' : ''}`}
                      name="targetAmount"
                      value={formData.targetAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                    {errors.targetAmount && <div className="invalid-feedback">{errors.targetAmount}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Initially Saved (₹)</label>
                    <input
                      type="number"
                      className="form-control rounded-3"
                      name="currentAmount"
                      value={formData.currentAmount}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Priority</label>
                    <select
                      className="form-select rounded-3"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                    >
                      {priorities.map((p) => (
                        <option key={p} value={p}>
                          {p}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Target Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3"
                      name="targetDate"
                      value={formData.targetDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-top-0 px-4 pb-4 pt-3">
                <button
                  type="button"
                  className="btn btn-light px-4 rounded-3 text-muted fw-bold"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary-gradient px-4 rounded-3 fw-bold shadow-sm"
                >
                  {goal ? "Update Goal" : "Save Goal"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AddCategoryModal 
        show={showAddCategory} 
        onClose={handleCategoryAdded} 
        type="goal"
      />
    </>
  );
};

export default GoalModal;
