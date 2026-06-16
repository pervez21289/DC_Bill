// services/activityLogService.js
import api from "./axiosConfig";
import { tokenService } from "./tokenService";

const ACTIVITY_LOG_BASE = "/ActivityLog";

export const activityLogService = {
    // Get activity logs with filters and pagination
    async getLogs(request) {
        try {
            const response = await api.post(`${ACTIVITY_LOG_BASE}/get-logs`, request);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                success: false,
                message: "Failed to fetch activity logs"
            };
        }
    },

    // Get filter options (actions, entities, users)
    async getFilters() {
        try {
            const response = await api.get(`${ACTIVITY_LOG_BASE}/filters`);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                success: false,
                message: "Failed to fetch filter options"
            };
        }
    },

    // Get activity log by ID (for details view)
    async getLogById(id) {
        try {
            const response = await api.get(`${ACTIVITY_LOG_BASE}/${id}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                success: false,
                message: "Failed to fetch activity log details"
            };
        }
    },

    // Export logs (optional - if you want to implement CSV export)
    async exportLogs(request) {
        try {
            const response = await api.post(`${ACTIVITY_LOG_BASE}/export`, request, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                success: false,
                message: "Failed to export logs"
            };
        }
    }
};