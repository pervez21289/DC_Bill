// services/partyService.js
import api from "./axiosConfig";

export const partyService = {
    async get() {
        const response = await api.get("/Party");
        return response.data; // Return response.data
    },

    async getById(id) {
        const response = await api.get(`/Party/${id}`);
        return response.data; // Return response.data
    },

    async getByGSTIN(gstin) {
        const response = await api.get(`/Party/gstin/${gstin}`);
        return response.data; // Return response.data
    },

    async create(data) {
        const response = await api.post("/Party", data);
        return response.data; // Return response.data
    },

    async update(id, data) {
        const response = await api.put(`/Party/${id}`, data);
        return response.data; // Return response.data
    },

    async delete(id) {
        const response = await api.delete(`/Party/${id}`);
        return response.data; // Return response.data
    },

    async search(keyword) {
        const response = await api.get(`/Party/search/${keyword}`);
        return response.data; // Return response.data
    }
};