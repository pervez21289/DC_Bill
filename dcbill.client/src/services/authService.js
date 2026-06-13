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
};

export default authService;