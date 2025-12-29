import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { 
  categoryStart, 
  categoryFailure, 
  categoryNamesSuccess 
} from "../../../features/categories/categorySlice";
import AddCategoryModal from "../../expenses/components/AddCategoryModal";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";

interface BudgetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  budget?: any;
}

const frequencies = ["Monthly", "Weekly", "Yearly"];

const BudgetModal = ({ open, onClose, onSubmit, budget }: BudgetModalProps) => {
  const dispatch = useAppDispatch();
  const { names: categories } = useAppSelector((state) => state.categories);
  const [showAddCategory, setShowAddCategory] = useState(false);

  const [formData, setFormData] = useState({
    categoryName: "",
    budgetAmount: "",
    frequency: "Monthly",
    startDate: new Date().toISOString().split("T")[0],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchCategoryNames = useCallback(async () => {
    dispatch(categoryStart());
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.NAMES("expense"));
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

  useEffect(() => {
    if (budget) {
      setFormData({
        categoryName: budget.categoryName || "",
        budgetAmount: budget.budgetAmount?.toString() || "",
        frequency: budget.period?.frequency || "Monthly",
        startDate: budget.period?.start?.split("T")[0] || new Date().toISOString().split("T")[0],
      });
    } else {
      setFormData({
        categoryName: "",
        budgetAmount: "",
        frequency: "Monthly",
        startDate: new Date().toISOString().split("T")[0],
      });
    }
    setErrors({});
  }, [budget, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.budgetAmount || parseFloat(formData.budgetAmount) <= 0) {
      newErrors.budgetAmount = "Valid budget amount is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      categoryName: formData.categoryName,
      budgetAmount: parseFloat(formData.budgetAmount),
      period: {
        frequency: formData.frequency,
        start: formData.startDate,
      },
      _id: budget?._id,
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
                {budget ? "Edit Budget Settings" : "Create New Budget"}
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
                    <label className="form-label small fw-bold text-muted mb-1">Select Category</label>
                    <select
                      className={`form-select rounded-3 ${errors.categoryName ? 'is-invalid' : ''}`}
                      name="categoryName"
                      value={formData.categoryName}
                      onChange={handleChange}
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                      <option value="Others" className="fw-bold text-primary">+ Add New Category</option>
                    </select>
                    {errors.categoryName && <div className="invalid-feedback">{errors.categoryName}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Budget Amount (₹)</label>
                    <input
                      type="number"
                      className={`form-control rounded-3 ${errors.budgetAmount ? 'is-invalid' : ''}`}
                      name="budgetAmount"
                      value={formData.budgetAmount}
                      onChange={handleChange}
                      placeholder="Enter limit amount"
                    />
                    {errors.budgetAmount && <div className="invalid-feedback">{errors.budgetAmount}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Frequency</label>
                    <select
                      className="form-select rounded-3"
                      name="frequency"
                      value={formData.frequency}
                      onChange={handleChange}
                    >
                      {frequencies.map((freq) => (
                        <option key={freq} value={freq}>
                          {freq}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Start Date</label>
                    <input
                      type="date"
                      className="form-control rounded-3"
                      name="startDate"
                      value={formData.startDate}
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
                  {budget ? "Save Changes" : "Create Budget"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <AddCategoryModal 
        show={showAddCategory} 
        onClose={handleCategoryAdded} 
        type="expense"
      />
    </>
  );
};

export default BudgetModal;
