// services/tokenService.js
const TOKEN_KEY = 'accessToken';

export const tokenService = {
    getToken() {
        return localStorage.getItem(TOKEN_KEY);
    },

    setToken(token) {
        localStorage.setItem(TOKEN_KEY, token);
    },

    removeToken() {
        localStorage.removeItem(TOKEN_KEY);
    },

    isTokenValid() {
        const token = this.getToken();
        if (!token) return false;

        try {
            // Decode token and check expiration
            const payload = JSON.parse(atob(token.split('.')[1]));
            const isValid = payload.exp > Date.now() / 1000;

            // If token is expired, remove it
            if (!isValid) {
                this.removeToken();
            }

            return isValid;
        } catch (error) {
            return false;
        }
    },

    getTokenPayload() {
        const token = this.getToken();
        if (!token) return null;

        try {
            return JSON.parse(atob(token.split('.')[1]));
        } catch (error) {
            return null;
        }
    }
};