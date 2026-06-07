import api from "./axiosConfig";

export const invoiceService = {
    async create(invoiceData) {
        const response = await api.post("/Invoice", invoiceData);
        return response;
    },

    async getAll() {
        const response = await api.get("/Invoice");
        return response;
    },

    async getById(id) {
        const response = await api.get(`/Invoice/${id}`);
        return response;
    }
};