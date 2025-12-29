import { useState, useEffect, useCallback } from "react";
import { useAppSelector, useAppDispatch } from "../../../app/hooks";
import { 
  categoryStart, 
  categoryFailure, 
  categoryNamesSuccess 
} from "../../../features/categories/categorySlice";
import AddCategoryModal from "./AddCategoryModal";
import api from "../../../services/axios";
import { API_ENDPOINTS } from "../../../services/endpoints";

interface ExpenseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  expense?: any;
}

const paymentMethods = ["Cash", "Credit Card", "Debit Card", "UPI", "Net Banking"];

const ExpenseModal = ({ open, onClose, onSubmit, expense }: ExpenseModalProps) => {
  const dispatch = useAppDispatch();
  const { names: categories } = useAppSelector((state) => state.categories);
  const [showAddCategory, setShowAddCategory] = useState(false);
  
  const fetchNames = useCallback(async () => {
    dispatch(categoryStart());
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.NAMES("expense"));
      dispatch(categoryNamesSuccess(response.data.data));
    } catch (error: any) {
      dispatch(categoryFailure(error.response?.data?.message || "Failed to fetch category names"));
    }
  }, [dispatch]);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    merchant: "",
    categoryName: "",
    amount: "",
    paymentMethod: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      fetchNames();
    }
  }, [open, fetchNames]);

  useEffect(() => {
    if (expense) { 
      console.log(expense)
      setFormData({
        date: expense.date?.split("T")[0] || new Date().toISOString().split("T")[0],
        merchant: expense.merchant || "",
        categoryName: expense.categoryName || "",
        amount: expense.amount?.toString() || "",
        paymentMethod: expense.paymentMethod || "",
        notes: expense.notes || "",
      });
    } else {
      setFormData({
        date: new Date().toISOString().split("T")[0],
        merchant: "",
        categoryName: "",
        amount: "",
        paymentMethod: "",
        notes: "",
      });
    }
    setErrors({});
  }, [expense, open]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.date) newErrors.date = "Date is required";
    if (!formData.merchant.trim()) newErrors.merchant = "Merchant is required";
    if (!formData.categoryName) newErrors.categoryName = "Category is required";
    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Valid amount is required";
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
    
    const submitData = {
      categoryName: formData.categoryName,
      amount: parseFloat(formData.amount),
      merchant: formData.merchant,
      paymentMethod: formData.paymentMethod,
      date: formData.date,
      notes: formData.notes
    };

    onSubmit({
      ...submitData,
      _id: expense?._id,
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
                {expense ? "Edit Expense" : "New Expense"}
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
                    <label className="form-label small fw-bold text-muted mb-1">Date</label>
                    <input
                      type="date"
                      className={`form-control rounded-3 ${errors.date ? 'is-invalid' : ''}`}
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                    />
                    {errors.date && <div className="invalid-feedback">{errors.date}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Merchant / Vendor</label>
                    <input
                      type="text"
                      className={`form-control rounded-3 ${errors.merchant ? 'is-invalid' : ''}`}
                      name="merchant"
                      value={formData.merchant}
                      onChange={handleChange}
                      placeholder="Where did you spend?"
                    />
                    {errors.merchant && <div className="invalid-feedback">{errors.merchant}</div>}
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Category</label>
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

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Amount (₹)</label>
                    <input
                      type="number"
                      className={`form-control rounded-3 ${errors.amount ? 'is-invalid' : ''}`}
                      name="amount"
                      value={formData.amount}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                    {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold text-muted mb-1">Payment Method</label>
                    <select
                      className="form-select rounded-3"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleChange}
                    >
                      <option value="">Select Method</option>
                      {paymentMethods.map((method) => (
                        <option key={method} value={method}>
                          {method}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-12">
                    <label className="form-label small fw-bold text-muted mb-1">Notes (Optional)</label>
                    <textarea
                      className="form-control rounded-3"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      rows={2}
                      placeholder="Add more details..."
                    ></textarea>
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
                  className="btn btn-primary-gradient px-4 rounded-3 fw-bold"
                >
                  {expense ? "Update Changes" : "Save Expense"}
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

export default ExpenseModal;
