// services/authService.js
import api from "./axiosConfig";
import { tokenService } from "./tokenService";

export const authService = {
    async login(emailOrUsername, password) {
        try {
            const response = await api.post("/Auth/login", {
                emailOrUsername,
                password
            });

            if (response.data.success && response.data.data.token) {
                // Store access token
                tokenService.setToken(response.data.data.token);

                // Store refresh token if exists
                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }

                // Store user data
                localStorage.setItem('user', JSON.stringify(response.data.data.user));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: error.message };
        }
    },

    async register(userData) {
        try {
            // Transform data to match backend expectations
            const payload = {
                username: userData.username || `${userData.firstname.toLowerCase()}${userData.lastname.toLowerCase()}${Math.floor(Math.random() * 1000)}`,
                email: userData.email,
                password: userData.password,
                fullName: `${userData.firstname} ${userData.lastname}`,
                company: userData.company || null
            };

            const response = await api.post("/Auth/register", payload);
            return response.data;
        } catch (error) {
            throw error.response?.data || { success: false, message: error.message };
        }
    },

    logout() {
        tokenService.removeToken();
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = "/login";
    },

    async getCurrentUser() {
        try {
            const response = await api.get("/Auth/me");
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async changePassword(currentPassword, newPassword, confirmPassword) {
        try {
            const response = await api.post("/Auth/change-password", {
                currentPassword,
                newPassword,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async refreshToken() {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) throw new Error('No refresh token');

            const response = await api.post("/Auth/refresh-token", {
                refreshToken
            });

            if (response.data.success && response.data.data.token) {
                tokenService.setToken(response.data.data.token);
                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }
            }
            return response.data;
        } catch (error) {
            this.logout();
            throw error;
        }
    },

    async forgotPassword(email) {
        try {
            const response = await api.post("/Auth/forgot-password", { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    async resetPassword(token, email, newPassword, confirmPassword) {
        try {
            const response = await api.post("/Auth/reset-password", {
                token,
                email,
                newPassword,
                confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};