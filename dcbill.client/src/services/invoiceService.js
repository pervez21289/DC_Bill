import api from "./axiosConfig";

export const invoiceService = {
    async create(invoiceData) {
        const response = await api.post("/Invoice", invoiceData);
        return response.data;
    },

    async getAll() {
        const response = await api.get("/Invoice");
        return response.data;
    },

    async getById(id) {
        const response = await api.get(`/Invoice/${id}`);
        return response.data;
    }
};