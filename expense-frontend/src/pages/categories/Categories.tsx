import { useState, useEffect, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { 
  categoryStart,
  categorySuccess,
  categoryFailure,
  createCategorySuccess,
  updateCategorySuccess,
  deleteCategorySuccess,
} from "../../features/categories/categorySlice";
import type { Category } from "../../features/categories/categorySlice";
import CategoryModal from "./components/CategoryModal";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

const Categories = () => {
  const dispatch = useAppDispatch();
  const { list: categories, loading, error } = useAppSelector((state) => state.categories);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const fetchAllCategories = useCallback(async () => {
    dispatch(categoryStart());
    try {
      const response = await api.get(API_ENDPOINTS.CATEGORIES.BASE);
      dispatch(categorySuccess(response.data.data));
    } catch (err: any) {
      dispatch(categoryFailure(err.response?.data?.message || "Failed to fetch categories"));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const handleAdd = () => {
    setSelectedCategory(null);
    setModalOpen(true);
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this category? It might affect expenses using it.")) {
      dispatch(categoryStart());
      try {
        await api.delete(API_ENDPOINTS.CATEGORIES.BY_ID(id));
        dispatch(deleteCategorySuccess(id));
      } catch (err: any) {
        dispatch(categoryFailure(err.response?.data?.message || "Failed to delete category"));
      }
    }
  };

  const handleSubmit = async (data: any) => {
    dispatch(categoryStart());
    try {
      if (data._id) {
        const response = await api.put(API_ENDPOINTS.CATEGORIES.BY_ID(data._id), data);
        dispatch(updateCategorySuccess(response.data.data));
      } else {
        const response = await api.post(API_ENDPOINTS.CATEGORIES.BASE, data);
        dispatch(createCategorySuccess(response.data.data));
      }
      setModalOpen(false);
    } catch (err: any) {
      dispatch(categoryFailure(err.response?.data?.message || "Failed to save category"));
    }
  };

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-dark mb-1">Categories</h4>
          <p className="text-muted small mb-0">Manage your expense categories and keywords</p>
        </div>
        <button
          className="btn btn-primary-gradient px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
          onClick={handleAdd}
        >
          <i className="bi bi-plus-lg"></i>
          Add Category
        </button>
      </div>

      {error && (
        <div className="alert alert-danger rounded-4 border-0 shadow-sm mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {loading && categories.length === 0 ? (
        <div className="d-flex justify-content-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {categories.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="text-muted">
                <i className="bi bi-folder-x fs-1 opacity-25 d-block mb-3"></i>
                No categories found. Start by adding one!
              </div>
            </div>
          ) : (
            categories.map((category) => (
              <div key={category._id} className="col-12 col-sm-6 col-md-4 col-xl-3">
                <div className="card border-0 shadow-sm rounded-4 h-100 transition-hover">
                  <div className="card-body p-4">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                      <div 
                        className="rounded-circle d-flex align-items-center justify-content-center fs-3"
                        style={{ 
                          width: '56px', 
                          height: '56px', 
                          backgroundColor: `${category.color}15`,
                          color: category.color 
                        }}
                      >
                        {category.icon || "📁"}
                      </div>
                      <div className="dropdown">
                        <button 
                          className="btn btn-link text-muted p-0" 
                          type="button" 
                          data-bs-toggle="dropdown"
                        >
                          <i className="bi bi-three-dots-vertical"></i>
                        </button>
                        <ul className="dropdown-menu dropdown-menu-end border-0 shadow-lg rounded-3">
                          <li>
                            <button className="dropdown-item px-3 py-2" onClick={() => handleEdit(category)}>
                              <i className="bi bi-pencil me-2"></i> Edit
                            </button>
                          </li>
                          <li>
                            <button className="dropdown-item px-3 py-2 text-danger" onClick={() => handleDelete(category._id)}>
                              <i className="bi bi-trash me-2"></i> Delete
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <h5 className="fw-bold text-dark mb-2">{category.categoryName}</h5>
                    <div className="d-flex flex-wrap gap-1 mt-3">
                      {category.keywords.length > 0 ? (
                        category.keywords.slice(0, 5).map((kw, i) => (
                          <span key={i} className="badge bg-light text-muted fw-normal rounded-pill px-2">
                            {kw}
                          </span>
                        ))
                      ) : (
                        <span className="text-muted small italic text-opacity-50">No keywords</span>
                      )}
                      {category.keywords.length > 5 && (
                        <span className="badge bg-light text-muted fw-normal rounded-pill px-2">
                          +{category.keywords.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      <CategoryModal
        show={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
        category={selectedCategory}
      />
    </div>
  );
};

export default Categories;
