// services/authService.js
import api from "./axiosConfig";
import { tokenService } from "./tokenService";

export const authService = {
    async login(emailOrUsername, password) {
        try {
            const response = await api.post("/Auth/login", { emailOrUsername, password });

            if (!response || !response.data) {
                return { success: false, message: 'No response from server' };
            }

            if (response.data.success && response.data.data?.token) {
                tokenService.setToken(response.data.data.token);

                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }
                if (response.data.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }

                return response.data;
            } else {
                return {
                    success: false,
                    message: response.data?.message || 'Login failed'
                };
            }
        } catch (error) {
            if (error.code === 'ECONNABORTED') {
                return { success: false, message: 'Request timeout. Please try again.' };
            }
            if (error.response) {
                return {
                    success: false,
                    message: error.response.data?.message ||
                        error.response.data?.Message ||
                        'Invalid email/username or password',
                    status: error.response.status
                };
            } else if (error.request) {
                return { success: false, message: 'Unable to connect to server. Please check your connection.' };
            } else {
                return { success: false, message: error.message || 'An unexpected error occurred' };
            }
        }
    },

    async register(userData) {
        try {
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

    // ✅ Logout is now only a local cleanup — redirect is handled by axiosConfig
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
                currentPassword, newPassword, confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // ✅ refreshToken() removed from authService — logic moved into axiosConfig only

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
                token, email, newPassword, confirmPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export default authService;