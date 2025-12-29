import { useState, useEffect } from "react";
import type { Category } from "../../../features/categories/categorySlice";

interface CategoryModalProps {
  show: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Category, "_id"> & { _id?: string }) => void;
  category?: Category | null;
}

const CategoryModal = ({ show, onClose, onSubmit, category }: CategoryModalProps) => {
  const [formData, setFormData] = useState({
    categoryName: "",
    icon: "📁",
    color: "#6366f1",
    keywords: ""
  });

  useEffect(() => {
    if (category) {
      setFormData({
        categoryName: category.categoryName,
        icon: category.icon,
        color: category.color,
        keywords: category.keywords.join(", ")
      });
    } else {
      setFormData({
        categoryName: "",
        icon: "📁",
        color: "#6366f1",
        keywords: ""
      });
    }
  }, [category, show]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      keywords: formData.keywords.split(",").map(k => k.trim()).filter(k => k !== ""),
      _id: category?._id,
      type: ""
    });
  };

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show"></div>
      <div className="modal fade show d-block" tabIndex={-1}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">
                {category ? "Edit Category" : "Add New Category"}
              </h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Category Name</label>
                  <input
                    type="text"
                    className="form-control rounded-3"
                    value={formData.categoryName}
                    onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
                    required
                  />
                </div>
                <div className="row g-3">
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">Icon (Emoji)</label>
                    <input
                      type="text"
                      className="form-control rounded-3"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label small fw-bold">Color</label>
                    <input
                      type="color"
                      className="form-control form-control-color w-100 rounded-3"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Keywords (Comma separated)</label>
                  <textarea
                    className="form-control rounded-3"
                    placeholder="e.g. Amazon, Uber, Swiggy"
                    value={formData.keywords}
                    onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                    rows={3}
                  />
                  <div className="form-text small">Keywords help in auto-categorizing expenses from merchants.</div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-3 px-4" onClick={onClose}>Cancel</button>
                <button type="submit" className="btn btn-primary rounded-3 px-4">
                  {category ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;
