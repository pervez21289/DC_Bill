// src/store/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from 'services/authService';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

// ── Verify Email ─────────────────────────────────────────────────────────────
export const verifyEmail = createAsyncThunk(
    'auth/verifyEmail',
    async ({ email, token }, { rejectWithValue }) => {
        try {
            return await authService.verifyEmail(email, token);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// ── Resend Verification ──────────────────────────────────────────────────────
export const resendVerification = createAsyncThunk(
    'auth/resendVerification',
    async (email, { rejectWithValue }) => {
        try {
            return await authService.resendVerification(email);
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const initialState = {
    token: localStorage.getItem(TOKEN_KEY) || null,
    user: JSON.parse(localStorage.getItem(USER_KEY)) || null,
    isAuthenticated: !!localStorage.getItem(TOKEN_KEY),
    loading: false,
    error: null,
    verifying: false,   // email verification in progress
    resending: false    // resend verification email in progress
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart(state) {
            state.loading = true;
            state.error = null;
        },
        loginSuccess(state, action) {
            const { token, user } = action.payload;
            state.token = token;
            state.user = user;
            state.isAuthenticated = true;
            state.loading = false;
            state.error = null;
            localStorage.setItem(TOKEN_KEY, token);
            localStorage.setItem(USER_KEY, JSON.stringify(user));
        },
        loginFailure(state, action) {
            state.loading = false;
            state.error = action.payload;
        },
        logout(state) {
            state.token = null;
            state.user = null;
            state.isAuthenticated = false;
            state.loading = false;
            state.error = null;
            state.verifying = false;
            state.resending = false;
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem(USER_KEY);
        },
        clearError(state) {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // ── Verify Email ─────────────────────────────────────────────────
            .addCase(verifyEmail.pending, (state) => {
                state.verifying = true;
                state.error = null;
            })
            .addCase(verifyEmail.fulfilled, (state) => {
                state.verifying = false;
            })
            .addCase(verifyEmail.rejected, (state, action) => {
                state.verifying = false;
                state.error = action.payload;
            })

            // ── Resend Verification ──────────────────────────────────────────
            .addCase(resendVerification.pending, (state) => {
                state.resending = true;
                state.error = null;
            })
            .addCase(resendVerification.fulfilled, (state) => {
                state.resending = false;
            })
            .addCase(resendVerification.rejected, (state, action) => {
                state.resending = false;
                state.error = action.payload;
            });
    }
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;

// Selectors
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthUser = (state) => state.auth.user;
export const selectAuthToken = (state) => state.auth.token;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthVerifying = (state) => state.auth.verifying;
export const selectAuthResending = (state) => state.auth.resending;

export default authSlice.reducer;