// services/axiosConfig.js
import axios from 'axios';
import { tokenService } from './tokenService';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Endpoints where a 401 means "bad credentials / invalid token",
// NOT "session expired". These must never trigger refresh or redirect.
// Adjust the paths to match your real endpoints.
const AUTH_ENDPOINTS = [
    '/auth/login',
    '/auth/refresh-token',
    '/auth/forgot-password',
    '/auth/reset-password'
];

const isAuthEndpoint = (url = '') => {
    const lower = url.toLowerCase();
    return AUTH_ENDPOINTS.some((path) => lower.includes(path));
};

// Single logout point: clear storage and go to /login (only if not already there)
const forceLogout = () => {
    tokenService.removeToken();
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_user');

    if (window.location.pathname !== '/login') {
        window.location.href = '/login';
    }
};

// Dedicated axios instance ONLY for refresh token (bypasses interceptor)
const refreshApi = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
});

// Main axios instance
const api = axios.create({
    baseURL: BASE_URL,
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = tokenService.getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Reject immediately if:
        // - network error / no response
        // - not a 401
        // - already retried
        // - the request was to an auth endpoint (e.g. wrong password on login)
        if (
            !error.response ||
            error.response.status !== 401 ||
            !originalRequest ||
            originalRequest._retry ||
            isAuthEndpoint(originalRequest.url)
        ) {
            return Promise.reject(error);
        }

        // No refresh token: the session is simply gone
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            forceLogout();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            // Use dedicated refreshApi, NOT the main api instance
            const response = await refreshApi.post('/Auth/refresh-token', { refreshToken });

            if (response.data?.success && response.data?.data?.token) {
                const newToken = response.data.data.token;

                tokenService.setToken(newToken);

                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }

                processQueue(null, newToken);

                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            }

            throw new Error('Refresh token response invalid');
        } catch (refreshError) {
            processQueue(refreshError, null);
            forceLogout();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;