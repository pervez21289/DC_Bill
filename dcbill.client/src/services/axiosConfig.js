// services/axiosConfig.js
import axios from 'axios';
import { tokenService } from './tokenService';

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

// Dedicated axios instance ONLY for refresh token (bypasses interceptor)
const refreshApi = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
    timeout: 30000,
    headers: { 'Content-Type': 'application/json' }
});

// Create main axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api',
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
        debugger;
        // If not 401 or already retried, reject immediately
        if (!error.response || error.response.status !== 401 || originalRequest._retry) {
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
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                throw new Error('No refresh token available');
            }
            debugger;
            // ✅ Use dedicated refreshApi — NOT the main api instance
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
            } else {
                throw new Error('Refresh token response invalid');
            }
        } catch (refreshError) {
            processQueue(refreshError, null);

            // ✅ Single logout point — only here, not in authService.refreshToken()
            tokenService.removeToken();
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
            //window.location.href = '/login';

            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
        }
    }
);

export default api;