import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  referenceId?: string;
}

interface NotificationState {
  list: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}

const initialState: NotificationState = {
  list: [],
  unreadCount: 0,
  loading: false,
  error: null,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    notificationStart(state) {
      state.loading = true;
      state.error = null;
    },
    notificationSuccess(state, action: PayloadAction<Notification[]>) {
      state.list = action.payload;
      state.unreadCount = action.payload.filter(n => !n.isRead).length;
      state.loading = false;
      state.error = null;
    },
    notificationFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    markAsReadSuccess(state, action: PayloadAction<string>) {
      const notification = state.list.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllReadSuccess(state) {
      state.list.forEach(n => {
        n.isRead = true;
      });
      state.unreadCount = 0;
    },
    deleteNotificationSuccess(state, action: PayloadAction<string>) {
      const notification = state.list.find(n => n._id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
      state.list = state.list.filter(n => n._id !== action.payload);
    },
    addNotification(state, action: PayloadAction<Notification>) {
      state.list.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    }
  },
});

export const {
  notificationStart,
  notificationSuccess,
  notificationFailure,
  markAsReadSuccess,
  markAllReadSuccess,
  deleteNotificationSuccess,
  addNotification
} = notificationSlice.actions;

export default notificationSlice.reducer;
