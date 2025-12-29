import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { getStoredAuth } from './auth.utils';

interface User {
    _id: string;
    fullName: string;
    lastName: string;
    email: string;
    currency: string;
    timeZone: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null
}

const storedAuth = getStoredAuth()

const initialState: AuthState = {
  user: storedAuth.user,
  token: storedAuth.token,
  isAuthenticated: !!storedAuth.token,
  loading: false,
  error: null,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authStart(state) {
            state.loading = true
            state.error = null
        },
        authSuccess(state, action: PayloadAction<{ user: User, token: string }>) {
            state.user = action.payload.user
            state.token = action.payload.token
            state.isAuthenticated = true
            state.loading = false
            state.error = null
            localStorage.setItem("token", action.payload.token)
            localStorage.setItem("user", JSON.stringify(action.payload.user));
        },
        authFailure(state, action: PayloadAction<string>) {
            state.loading = false
            state.error = action.payload
        },
        logOut(state) {
            state.user = null
            state.token = null
            state.isAuthenticated = false
            localStorage.removeItem("token")
            localStorage.removeItem("user");
        },
        updateUserSuccess(state, action: PayloadAction<User>) {
            state.user = action.payload;
            state.loading = false;
            state.error = null;
            localStorage.setItem("user", JSON.stringify(action.payload));
        }
    }
})

export const { authStart, authSuccess, authFailure, logOut, updateUserSuccess } = authSlice.actions;
export default authSlice.reducer;