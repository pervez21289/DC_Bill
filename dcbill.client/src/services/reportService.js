// services/reportService.js
import api from './axiosConfig';

export const reportService = {
    // Get dashboard statistics
    async getDashboardStats(filterType = 'today', startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            params.append('filterType', filterType);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/Report/dashboard-stats?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Dashboard stats error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch dashboard stats'
            };
        }
    },

    // Get revenue trend
    async getRevenueTrend(trendType = 'daily', startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            params.append('trendType', trendType);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/Report/revenue-trend?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Revenue trend error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch revenue trend'
            };
        }
    },

    // Get top products
    async getTopProducts(topCount = 5, startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            params.append('topCount', topCount);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/Report/top-products?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Top products error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch top products'
            };
        }
    },

    // Get recent invoices
    async getRecentInvoices(count = 10) {
        try {
            const response = await api.get(`/Report/recent-invoices?count=${count}`);
            return response.data;
        } catch (error) {
            console.error('Recent invoices error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch recent invoices'
            };
        }
    },

    // Get invoice by ID with items
    async getInvoiceById(invoiceId) {
        try {
            const response = await api.get(`/Report/invoice/${invoiceId}`);
            return response.data;
        } catch (error) {
            console.error('Get invoice error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch invoice'
            };
        }
    },

    // Get invoice items only
    async getInvoiceItems(invoiceId) {
        try {
            const response = await api.get(`/Report/invoice/${invoiceId}/items`);
            return response.data;
        } catch (error) {
            console.error('Get invoice items error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch invoice items'
            };
        }
    },

    // Get monthly sales summary
    async getMonthlySalesSummary() {
        try {
            const response = await api.get('/Report/monthly-sales-summary');
            return response.data;
        } catch (error) {
            console.error('Monthly sales summary error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch monthly sales summary'
            };
        }
    },

    // Get total revenue by date range
    async getTotalRevenue(startDate, endDate) {
        try {
            const params = new URLSearchParams();
            params.append('startDate', startDate);
            params.append('endDate', endDate);

            const response = await api.get(`/Report/total-revenue?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Total revenue error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch total revenue'
            };
        }
    },

    // Get complete dashboard data
    async getCompleteDashboardData(filterType = 'today', startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            params.append('filterType', filterType);
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/Report/complete-dashboard?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Complete dashboard error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch dashboard data'
            };
        }
    },

    // Get dashboard summary
    async getDashboardSummary(startDate = null, endDate = null) {
        try {
            const params = new URLSearchParams();
            if (startDate) params.append('startDate', startDate);
            if (endDate) params.append('endDate', endDate);

            const response = await api.get(`/Report/summary?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Dashboard summary error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch dashboard summary'
            };
        }
    },

    // Get sales analytics with comparison
    async getSalesAnalytics(period = 'month', referenceDate = null) {
        try {
            const params = new URLSearchParams();
            params.append('period', period);
            if (referenceDate) params.append('referenceDate', referenceDate);

            const response = await api.get(`/Report/sales-analytics?${params.toString()}`);
            return response.data;
        } catch (error) {
            console.error('Sales analytics error:', error);
            return {
                success: false,
                message: error.response?.data?.message || 'Failed to fetch sales analytics'
            };
        }
    }
};