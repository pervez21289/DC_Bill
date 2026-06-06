// services/authService.js
import api from "./axiosConfig";
import { tokenService } from "./tokenService";

export const authService = {
  async login(email, password) {
    const response = await api.post("/Auth/login", { email, password });
    if (response.data.accessToken) {
      tokenService.setToken(response.data.accessToken);
    }
    return response.data;
  },
  
  async register(userData) {
    const response = await api.post("/Auth/register", userData);
    if (response.data.accessToken) {
      tokenService.setToken(response.data.accessToken);
    }
    return response.data;
  },
  
  logout() {
    tokenService.removeToken();
    window.location.href = "/login";
  },
  
  async getCurrentUser() {
    const response = await api.get("/Auth/me");
    return response.data;
  }
};