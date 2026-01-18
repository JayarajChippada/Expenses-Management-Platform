import axios from "./axios";
import { API_ENDPOINTS } from "./endpoints";
import type { AppDispatch } from "../store/store";
import {
  notificationStart,
  notificationSuccess,
  notificationFailure,
  markAsReadSuccess,
  markAllReadSuccess,
  deleteNotificationSuccess,
} from "../store/slices/notification.slice";

export const fetchNotifications = () => async (dispatch: AppDispatch) => {
  try {
    dispatch(notificationStart());
    const response = await axios.get(API_ENDPOINTS.NOTIFICATIONS.BASE);
    if (response.data.success) {
      dispatch(notificationSuccess(response.data.data));
    }
  } catch (error: any) {
    dispatch(
      notificationFailure(
        error.response?.data?.message || "Failed to fetch notifications"
      )
    );
  }
};

export const markAsRead = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.put(API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id));
    if (response.data.success) {
      dispatch(markAsReadSuccess(id));
    }
  } catch (error: any) {
    console.error("Failed to mark as read", error);
  }
};

export const markAllAsRead = () => async (dispatch: AppDispatch) => {
  try {
    const response = await axios.put(API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ);
    if (response.data.success) {
      dispatch(markAllReadSuccess());
    }
  } catch (error: any) {
    console.error("Failed to mark all as read", error);
  }
};

export const deleteNotification =
  (id: string) => async (dispatch: AppDispatch) => {
    try {
      const response = await axios.delete(
        API_ENDPOINTS.NOTIFICATIONS.BY_ID(id)
      );
      if (response.data.success) {
        dispatch(deleteNotificationSuccess(id));
      }
    } catch (error: any) {
      console.error("Failed to delete notification", error);
    }
  };
