// services/axiosConfig.js
import axios from 'axios';
import { tokenService } from './tokenService';
import { authService } from './authService';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    }
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
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - THIS IS WHERE refreshToken() IS CALLED
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If not 401 error or already retried, reject
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
            return Promise.reject(error);
        }

        // Prevent infinite loop on refresh token endpoint
        if (originalRequest.url?.includes('/Auth/refresh-token')) {
            // Refresh token failed, redirect to login
            authService.logout();
            return Promise.reject(error);
        }

        originalRequest._retry = true;

        // If already refreshing, queue this request
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then(token => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                })
                .catch(err => Promise.reject(err));
        }

        isRefreshing = true;

        try {
            // ✅ HERE IS WHERE refreshToken() IS CALLED!
            const response = await authService.refreshToken();

            if (response && response.success) {
                const newToken = response.data.token;

                // Process queued requests
                processQueue(null, newToken);

                // Retry original request with new token
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } else {
                throw new Error('Refresh token failed');
            }
        } catch (refreshError) {
            // Process queue with error
            processQueue(refreshError, null);

            // Clear tokens and redirect to login
            authService.logout();

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;