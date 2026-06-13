// services/axiosConfig.js
import axios from 'axios';
import { tokenService } from './tokenService';

// Create axios instance - FIXED for Vite
const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api', // Vite uses import.meta.env
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

// Response interceptor
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await api.post('/Auth/refresh-token', { refreshToken });
                    if (response.data.success) {
                        tokenService.setToken(response.data.data.token);
                        originalRequest.headers.Authorization = `Bearer ${response.data.data.token}`;
                        return api(originalRequest);
                    }
                }
            } catch (refreshError) {
                // Redirect to login
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;