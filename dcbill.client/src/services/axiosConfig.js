// services/axiosConfig.js
import axios from "axios";
import { tokenService } from "./tokenService";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://localhost:5001/api";
console.log("API Base URL:", BASE_URL);

const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor - Add token to every request
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

// Response interceptor - Handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 (Unauthorized) and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Try to refresh the token
                const refreshToken = localStorage.getItem('refreshToken');
                if (!refreshToken) {
                    throw new Error('No refresh token');
                }

                const response = await axios.post(`${BASE_URL}/Auth/refresh-token`, {
                    refreshToken
                });

                if (response.data.success && response.data.data.token) {
                    // Store new tokens
                    tokenService.setToken(response.data.data.token);
                    if (response.data.data.refreshToken) {
                        localStorage.setItem('refreshToken', response.data.data.refreshToken);
                    }

                    // Retry original request with new token
                    originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
                    return api(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - redirect to login
                tokenService.removeToken();
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;