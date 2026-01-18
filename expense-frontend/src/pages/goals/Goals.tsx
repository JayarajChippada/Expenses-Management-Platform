import { useState, useEffect, useCallback } from "react";
import GoalCard from "./components/GoalCard";
import GoalModal from "./components/GoalModal";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  goalStart,
  goalSuccess,
  goalFailure,
  createGoalSuccess,
  updateGoalSuccess,
  deleteGoalSuccess,
  setGoalFilters,
} from "../../store/slices/goal.slice";
import api from "../../services/axios";
import { API_ENDPOINTS } from "../../services/endpoints";

import type { Goal } from "../../types/models";

const Goals = () => {
  const dispatch = useAppDispatch();
  const {
    list: goalList,
    loading,
    filters,
    error,
  } = useAppSelector((state) => state.goals);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  // Add Funds States
  const [fundModalOpen, setFundModalOpen] = useState(false);
  const [fundAmount, setFundAmount] = useState("");

  const fetchGoals = useCallback(async () => {
    dispatch(goalStart());
    try {
      const response = await api.get(API_ENDPOINTS.GOALS.BASE, {
        params: filters,
      });
      dispatch(goalSuccess({ data: response.data.data || response.data }));
    } catch (err: any) {
      dispatch(goalFailure(""));
    }
  }, [dispatch, filters]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const activeGoals = goalList.filter((g) => g.status === "active");
  const completedGoals = goalList.filter((g) => g.status === "completed");

  const displayedGoals =
    filters.status === "completed" ? completedGoals : activeGoals;

  const handleAddGoal = () => {
    setSelectedGoal(null);
    setModalOpen(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setModalOpen(true);
  };

  const handleDeleteGoal = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this goal?")) return;
    dispatch(goalStart());
    try {
      await api.delete(API_ENDPOINTS.GOALS.BY_ID(id));
      dispatch(deleteGoalSuccess(id));
      fetchGoals();
    } catch (err: any) {
      dispatch(
        goalFailure(err.response?.data?.message || "Failed to delete goal")
      );
    }
  };

  const handleSubmitGoal = async (data: any) => {
    dispatch(goalStart());
    try {
      if (data._id) {
        const response = await api.patch(
          API_ENDPOINTS.GOALS.BY_ID(data._id),
          data
        );
        dispatch(updateGoalSuccess(response.data.data));
      } else {
        const response = await api.post(API_ENDPOINTS.GOALS.BASE, data);
        dispatch(createGoalSuccess(response.data.data));
      }
      setModalOpen(false);
      fetchGoals();
    } catch (err: any) {
      dispatch(
        goalFailure(err.response?.data?.message || "Failed to save goal")
      );
    }
  };

  const handleOpenAddFunds = (goal: any) => {
    setSelectedGoal(goal);
    setFundAmount("");
    setFundModalOpen(true);
  };

  const handleSubmitFunds = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal || !fundAmount) return;

    dispatch(goalStart());
    try {
      const response = await api.patch(
        API_ENDPOINTS.GOALS.ADD_FUNDS(selectedGoal._id),
        {
          fundAmount: Number(fundAmount),
        }
      );
      dispatch(updateGoalSuccess(response.data.data));
      setFundModalOpen(false);
      // Optional: fetchGoals() if we want to be super safe, but updateGoalSuccess handles the list update locally
    } catch (err: any) {
      dispatch(
        goalFailure(err.response?.data?.message || "Failed to add funds")
      );
    }
  };

  const totalTarget = goalList.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goalList.reduce((sum, g) => sum + g.currentAmount, 0);

  return (
    <div className="container-fluid p-0">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h4 className="fw-bold text-dark mb-1">Financial Goals</h4>
          <p className="text-muted small mb-0">
            Track and achieve your long-term savings targets
          </p>
        </div>
        <button
          className="btn btn-primary-gradient px-4 py-2 rounded-3 d-flex align-items-center gap-2 shadow-sm"
          onClick={handleAddGoal}
        >
          <i className="bi bi-plus-lg"></i>
          Add New Goal
        </button>
      </div>

      {error && (
        <div
          className="alert alert-danger rounded-4 border-0 shadow-sm mb-4"
          role="alert"
        >
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      )}

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3 text-center">
              <div className="text-muted small mb-1">Total Goals</div>
              <div className="h4 fw-bold mb-0 text-primary-custom">
                {goalList.length}
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3 text-center">
              <div className="text-muted small mb-1">Total Target</div>
              <div className="h4 fw-bold mb-0 text-dark">
                ₹{(totalTarget / 100000).toFixed(2)}L
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3 text-center">
              <div className="text-muted small mb-1">Total Saved</div>
              <div className="h4 fw-bold mb-0 text-success">
                ₹{(totalSaved / 100000).toFixed(2)}L
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-sm-6 col-md-3">
          <div className="card shadow-sm border-0 rounded-4 h-100 bg-light-subtle">
            <div className="card-body p-3 text-center">
              <div className="text-muted small mb-1">Completed</div>
              <div className="h4 fw-bold mb-0 text-secondary">
                {completedGoals.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs / Filters */}
      <ul className="nav nav-tabs mb-4 border-bottom border-light">
        <li className="nav-item">
          <button
            className={`nav-link border-0 border-bottom border-3 rounded-0 fw-bold px-4 py-2 ${
              filters.status !== "completed"
                ? "active text-primary-custom border-primary-custom bg-transparent"
                : "text-muted border-transparent bg-transparent"
            }`}
            onClick={() => dispatch(setGoalFilters({ status: "active" }))}
          >
            ACTIVE ({activeGoals.length})
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link border-0 border-bottom border-3 rounded-0 fw-bold px-4 py-2 ${
              filters.status === "completed"
                ? "active text-primary-custom border-primary-custom bg-transparent"
                : "text-muted border-transparent bg-transparent"
            }`}
            onClick={() => dispatch(setGoalFilters({ status: "completed" }))}
          >
            COMPLETED ({completedGoals.length})
          </button>
        </li>
      </ul>

      {/* Goal Cards Grid */}
      <div className="row g-4">
        {loading && goalList.length === 0 ? (
          <div className="col-12 text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : displayedGoals.length === 0 ? (
          <div className="col-12">
            <div className="p-5 text-center text-muted card border-0 rounded-4 shadow-sm">
              <i className="bi bi-award fs-1 d-block mb-3 opacity-25"></i>
              No {filters.status === "completed" ? "completed" : "ongoing"}{" "}
              goals found
            </div>
          </div>
        ) : (
          displayedGoals.map((goal) => (
            <div key={goal._id} className="col-12 col-md-6 col-lg-4">
              <GoalCard
                goal={goal}
                onEdit={() => handleEditGoal(goal)}
                onDelete={() => handleDeleteGoal(goal._id)}
                onAddFunds={() => handleOpenAddFunds(goal)}
              />
            </div>
          ))
        )}
      </div>

      {modalOpen && (
        <GoalModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmitGoal}
          goal={selectedGoal}
        />
      )}

      {/* Add Funds Modal */}
      {fundModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title fw-bold">Add Funds</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setFundModalOpen(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="text-muted small mb-3">
                  Add savings to <strong>{selectedGoal?.title}</strong>
                </p>
                <form onSubmit={handleSubmitFunds}>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">
                      Amount
                    </label>
                    <div className="input-group">
                      <span className="input-group-text border-end-0 bg-light rounded-start-3">
                        ₹
                      </span>
                      <input
                        type="number"
                        className="form-control border-start-0 bg-light rounded-end-3"
                        placeholder="Enter amount"
                        value={fundAmount}
                        onChange={(e) => setFundAmount(e.target.value)}
                        min="1"
                        required
                        autoFocus
                      />
                    </div>
                  </div>
                  <div className="d-grid">
                    <button
                      type="submit"
                      className="btn btn-primary-gradient rounded-3 py-2 fw-bold"
                    >
                      Add Funds
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
