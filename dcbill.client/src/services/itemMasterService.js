// services/itemMasterService.js
import api from "./axiosConfig";

export const itemMasterService = {
    async get() {
        const response = await api.get("/ItemMaster");
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/ItemMaster/${id}`);
        return response.data;
    },

    async create(data) {
        const response = await api.post("/ItemMaster", data);
        return response.data;
    },

    async update(id, data) {
        const response = await api.put(`/ItemMaster/${id}`, data);
        return response.data;
    },

    async delete(id) {
        const response = await api.delete(`/ItemMaster/${id}`);
        return response.data;
    },

    async search(keyword) {
        const response = await api.get(`/ItemMaster/search?keyword=${keyword}`);
        return response.data;
    }
};