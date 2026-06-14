import api from "./axiosConfig";

export const invoiceService = {
    async create(invoiceData) {
        const response = await api.post("/Invoice", invoiceData);
        return response.data;
    },
    async update(id, data) {
        const response = await api.put(`/Invoice/${id}`, data);
        return response.data; // Return response.data
    },
    async getAll(filters) {
        const params = new URLSearchParams();
        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== '') {
                    params.append(key, filters[key]);
                }
            });
        }
        const response = await api.get(`/Invoice?${params.toString()}`);
        return response.data; // Just return the full response
    },

    async getById(id) {
        const response = await api.get(`/Invoice/${id}`);
        return response.data;
    }
};