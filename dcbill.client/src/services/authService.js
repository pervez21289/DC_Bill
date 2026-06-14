// services/authService.js
import api from "./axiosConfig";
import { tokenService } from "./tokenService";

export const authService = {
    async login(emailOrUsername, password) {
        try {
            console.log('Attempting login for:', emailOrUsername); // Debug log

            // Make sure to await properly
            const response = await api.post("/Auth/login", {
                emailOrUsername,
                password
            });

            console.log('Login response received:', response); // Debug log

            // Check if response exists
            if (!response || !response.data) {
                console.error('No response data received');
                return {
                    success: false,
                    message: 'No response from server'
                };
            }

            // Check if login was successful
            if (response.data.success && response.data.data?.token) {
                // Store tokens
                tokenService.setToken(response.data.data.token);

                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }

                if (response.data.data.user) {
                    localStorage.setItem('user', JSON.stringify(response.data.data.user));
                }

                return response.data;
            } else {
                // Login failed but got response
                return {
                    success: false,
                    message: response.data?.message || 'Login failed'
                };
            }
        } catch (error) {
            console.error('Login API error details:', error);

            // Handle different error types
            if (error.code === 'ECONNABORTED') {
                return {
                    success: false,
                    message: 'Request timeout. Please try again.'
                };
            }

            if (error.response) {
                // Server responded with error status
                console.error('Error response:', error.response.data);
                const errorMessage = error.response.data?.message ||
                    error.response.data?.Message ||
                    'Invalid email/username or password';
                return {
                    success: false,
                    message: errorMessage,
                    status: error.response.status
                };
            } else if (error.request) {
                // Request was made but no response
                console.error('No response received:', error.request);
                return {
                    success: false,
                    message: 'Unable to connect to server. Please check your connection.'
                };
            } else {
                // Something else happened
                console.error('Error message:', error.message);
                return {
                    success: false,
                    message: error.message || 'An unexpected error occurred'
                };
            }
        }
    },

    // Other methods remain the same...

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

    // services/authService.js - Update the refreshToken method
    async refreshToken() {
        try {


            const refreshToken = localStorage.getItem('refreshToken');
            if (!refreshToken) {
                console.error('No refresh token found in localStorage');
                throw new Error('No refresh token');
            }

            const response = await api.post("/Auth/refresh-token", {
                refreshToken
            });

            

            if (response.data.success && response.data.data.token) {
                // Store new access token
                tokenService.setToken(response.data.data.token);

                // Store new refresh token if provided
                if (response.data.data.refreshToken) {
                    localStorage.setItem('refreshToken', response.data.data.refreshToken);
                }

                return response.data;
            } else {
                console.error('Refresh token failed:', response.data);
                throw new Error('Refresh token failed');
            }
        } catch (error) {
            console.error(' Refresh token error:', error);
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

export default authService;