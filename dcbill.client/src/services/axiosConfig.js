// services/axiosConfig.js
import axios from "axios";

// Base URL from .env file
const BASE_URL = import.meta.env.VITE_BASE_URL || "https://localhost:5001/api";
console.log("API Base URL:", import.meta.env);

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;