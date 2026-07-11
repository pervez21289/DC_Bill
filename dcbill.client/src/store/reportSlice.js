// store/reportSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { reportService } from 'services/reportService';

// Async Thunks
export const fetchDashboardStats = createAsyncThunk(
    'report/fetchDashboardStats',
    async ({ filterType = 'today', startDate = null, endDate = null } = {}) => {
        const response = await reportService.getDashboardStats(filterType, startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchRevenueTrend = createAsyncThunk(
    'report/fetchRevenueTrend',
    async ({ trendType = 'daily', startDate = null, endDate = null } = {}) => {
        const response = await reportService.getRevenueTrend(trendType, startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchTopProducts = createAsyncThunk(
    'report/fetchTopProducts',
    async ({ topCount = 5, startDate = null, endDate = null } = {}) => {
        const response = await reportService.getTopProducts(topCount, startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchRecentInvoices = createAsyncThunk(
    'report/fetchRecentInvoices',
    async ({ count = 10 } = {}) => {
        const response = await reportService.getRecentInvoices(count);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchInvoiceById = createAsyncThunk(
    'report/fetchInvoiceById',
    async (invoiceId) => {
        const response = await reportService.getInvoiceById(invoiceId);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchMonthlySalesSummary = createAsyncThunk(
    'report/fetchMonthlySalesSummary',
    async () => {
        const response = await reportService.getMonthlySalesSummary();
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchTotalRevenue = createAsyncThunk(
    'report/fetchTotalRevenue',
    async ({ startDate, endDate }) => {
        const response = await reportService.getTotalRevenue(startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchCompleteDashboardData = createAsyncThunk(
    'report/fetchCompleteDashboardData',
    async ({ filterType = 'today', startDate = null, endDate = null } = {}) => {
        const response = await reportService.getCompleteDashboardData(filterType, startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchDashboardSummary = createAsyncThunk(
    'report/fetchDashboardSummary',
    async ({ startDate = null, endDate = null } = {}) => {
        const response = await reportService.getDashboardSummary(startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchSalesAnalytics = createAsyncThunk(
    'report/fetchSalesAnalytics',
    async ({ period = 'month', referenceDate = null } = {}) => {
        const response = await reportService.getSalesAnalytics(period, referenceDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

export const fetchGSTReport = createAsyncThunk(
    'report/fetchGSTReport',
    async ({ startDate, endDate }) => {
        const response = await reportService.getGSTReport(startDate, endDate);
        if (response.success) {
            return response.data;
        } else {
            throw new Error(response.message);
        }
    }
);

// Initial State
const initialState = {
    dashboardStats: {
        totalRevenue: 0,
        totalInvoices: 0,
        avgInvoiceValue: 0,
        totalGSTCollected: 0,
        uniqueCustomers: 0,
        paidInvoices: 0,
        pendingInvoices: 0
    },
    revenueTrend: [],
    topProducts: [],
    recentInvoices: [],
    currentInvoice: null,
    currentInvoiceItems: [],
    monthlySalesSummary: '',
    totalRevenue: 0,
    dateRange: { startDate: null, endDate: null },
    salesAnalytics: null,
    gstReport: null,
    loading: false,
    error: null
};

// Slice
const reportSlice = createSlice({
    name: 'report',
    initialState,
    reducers: {
        clearReportError: (state) => {
            state.error = null;
        },
        clearReports: (state) => {
            state.revenueTrend = [];
            state.topProducts = [];
            state.recentInvoices = [];
            state.currentInvoice = null;
            state.currentInvoiceItems = [];
        },
        clearCurrentInvoice: (state) => {
            state.currentInvoice = null;
            state.currentInvoiceItems = [];
        },
        setDateRange: (state, action) => {
            state.dateRange = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardStats = action.payload.stats || initialState.dashboardStats;
                state.dateRange = action.payload.dateRange || { startDate: null, endDate: null };
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch dashboard stats';
            })

            // Revenue Trend
            .addCase(fetchRevenueTrend.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRevenueTrend.fulfilled, (state, action) => {
                state.loading = false;
                state.revenueTrend = action.payload;
            })
            .addCase(fetchRevenueTrend.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch revenue trend';
            })

            // Top Products
            .addCase(fetchTopProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTopProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.topProducts = action.payload;
            })
            .addCase(fetchTopProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch top products';
            })

            // Recent Invoices
            .addCase(fetchRecentInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentInvoices.fulfilled, (state, action) => {
                state.loading = false;
                state.recentInvoices = action.payload;
            })
            .addCase(fetchRecentInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch recent invoices';
            })

            // Invoice by ID
            .addCase(fetchInvoiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentInvoice = action.payload.invoice;
                state.currentInvoiceItems = action.payload.items || [];
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch invoice';
            })

            // Monthly Sales Summary
            .addCase(fetchMonthlySalesSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMonthlySalesSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.monthlySalesSummary = action.payload;
            })
            .addCase(fetchMonthlySalesSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch monthly sales summary';
            })

            // Total Revenue
            .addCase(fetchTotalRevenue.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTotalRevenue.fulfilled, (state, action) => {
                state.loading = false;
                state.totalRevenue = action.payload.totalRevenue || 0;
            })
            .addCase(fetchTotalRevenue.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch total revenue';
            })

            // Complete Dashboard Data
            .addCase(fetchCompleteDashboardData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCompleteDashboardData.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardStats = action.payload.stats || initialState.dashboardStats;
                state.dateRange = action.payload.dateRange || { startDate: null, endDate: null };
                state.revenueTrend = action.payload.trends || [];
            })
            .addCase(fetchCompleteDashboardData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch dashboard data';
            })

            // Dashboard Summary
            .addCase(fetchDashboardSummary.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDashboardSummary.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardStats = action.payload.statistics || initialState.dashboardStats;
                state.topProducts = action.payload.topProducts || [];
                state.recentInvoices = action.payload.recentInvoices || [];
                state.dateRange = action.payload.period || { startDate: null, endDate: null };
            })
            .addCase(fetchDashboardSummary.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch dashboard summary';
            })

            // Sales Analytics
            .addCase(fetchSalesAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSalesAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                state.salesAnalytics = action.payload;
            })
            .addCase(fetchSalesAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch sales analytics';
            })

            // GST Report
            .addCase(fetchGSTReport.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchGSTReport.fulfilled, (state, action) => {
                state.loading = false;
                state.gstReport = action.payload;
            })
            .addCase(fetchGSTReport.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch GST report';
            });
    }
});

// Selectors
export const selectDashboardStats = (state) => state.report.dashboardStats;
export const selectRevenueTrend = (state) => state.report.revenueTrend;
export const selectTopProducts = (state) => state.report.topProducts;
export const selectRecentInvoices = (state) => state.report.recentInvoices;
export const selectCurrentInvoice = (state) => state.report.currentInvoice;
export const selectCurrentInvoiceItems = (state) => state.report.currentInvoiceItems;
export const selectMonthlySalesSummary = (state) => state.report.monthlySalesSummary;
export const selectTotalRevenue = (state) => state.report.totalRevenue;
export const selectDateRange = (state) => state.report.dateRange;
export const selectSalesAnalytics = (state) => state.report.salesAnalytics;
export const selectGSTReport = (state) => state.report.gstReport;
export const selectReportLoading = (state) => state.report.loading;
export const selectReportError = (state) => state.report.error;

export const { clearReportError, clearReports, clearCurrentInvoice, setDateRange } = reportSlice.actions;
export default reportSlice.reducer;