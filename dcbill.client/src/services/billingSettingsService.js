// services/billingSettingsService.js
import api from "./axiosConfig";

export const billingSettingsService = {
  async get() {
    const response = await api.get("/BillingSettings");
    return response.data;
  },
  
  async save(data) {
    const response = await api.post("/BillingSettings", data);
    return response.data;
  },
  
  async update(id, data) {
    const response = await api.put(`/BillingSettings/${id}`, data);
    return response.data;
  },
  
  async delete(id) {
    const response = await api.delete(`/BillingSettings/${id}`);
    return response.data;
  }
};