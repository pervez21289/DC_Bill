// store/activityLogSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { activityLogService } from 'services/activityLogService';

// Initial state
const initialState = {
    logs: [],
    totalRecords: 0,
    currentPage: 0,
    pageSize: 10,
    totalPages: 0,
    filterOptions: {
        actions: [],
        entities: [],
        users: [],
    },
    filters: {
        action: '',
        entity: '',
        userId: '',
        fromDate: null,
        toDate: null,
    },
    sortModel: [{ field: 'createdAt', sort: 'desc' }],
    loading: false,
    error: null,
    success: null,
};

// Async thunks
export const fetchActivityLogs = createAsyncThunk(
    'activityLog/fetchLogs',
    async (_, { getState, rejectWithValue }) => {
        try {
            const state = getState().activityLog;

            const request = {
                action: state.filters.action || null,
                entity: state.filters.entity || null,
                userId: state.filters.userId ? parseInt(state.filters.userId) : null,
                fromDate: state.filters.fromDate,
                toDate: state.filters.toDate,
                pageNumber: state.currentPage + 1,
                pageSize: state.pageSize,
                sortColumn: state.sortModel.length > 0 ? mapSortField(state.sortModel[0].field) : 'CreatedAt',
                sortDirection: state.sortModel.length > 0 ? state.sortModel[0].sort.toUpperCase() : 'DESC',
            };

            const response = await activityLogService.getLogs(request);

            if (response.success) {
                return {
                    data: response.data || [],
                    totalRecords: response.totalRecords || 0,
                    pageNumber: response.pageNumber || 1,
                    pageSize: response.pageSize || 10,
                    totalPages: response.totalPages || 0,
                };
            } else {
                return rejectWithValue(response.message || 'Failed to fetch logs');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch logs');
        }
    }
);

export const fetchFilterOptions = createAsyncThunk(
    'activityLog/fetchFilters',
    async (_, { rejectWithValue }) => {
        try {
            const response = await activityLogService.getFilters();
            if (response.success) {
                return response.data;
            } else {
                return rejectWithValue(response.message || 'Failed to fetch filters');
            }
        } catch (error) {
            return rejectWithValue(error.message || 'Failed to fetch filters');
        }
    }
);

// Helper function to map frontend field to backend field
const mapSortField = (field) => {
    const map = {
        id: 'Id',
        userName: 'UserName',
        action: 'Action',
        entity: 'Entity',
        createdAt: 'CreatedAt',
        responseStatus: 'ResponseStatus',
        executionTimeMs: 'ExecutionTimeMs',
        method: 'Method',
    };
    return map[field] || 'CreatedAt';
};

// Slice
const activityLogSlice = createSlice({
    name: 'activityLog',
    initialState,
    reducers: {
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
            state.currentPage = 0; // Reset to first page when filters change
        },
        clearFilters: (state) => {
            state.filters = {
                action: '',
                entity: '',
                userId: '',
                fromDate: null,
                toDate: null,
            };
            state.currentPage = 0;
        },
        setPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
            state.currentPage = 0;
        },
        setSortModel: (state, action) => {
            state.sortModel = action.payload;
            state.currentPage = 0;
        },
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            // Fetch logs
            .addCase(fetchActivityLogs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchActivityLogs.fulfilled, (state, action) => {
                state.loading = false;
                state.logs = action.payload.data;
                state.totalRecords = action.payload.totalRecords;
                state.currentPage = action.payload.pageNumber - 1;
                state.pageSize = action.payload.pageSize;
                state.totalPages = action.payload.totalPages;
                state.success = 'Logs loaded successfully';
            })
            .addCase(fetchActivityLogs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch logs';
            })
            // Fetch filters
            .addCase(fetchFilterOptions.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchFilterOptions.fulfilled, (state, action) => {
                state.loading = false;
                state.filterOptions = action.payload;
            })
            .addCase(fetchFilterOptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || 'Failed to fetch filters';
            });
    },
});

// Export actions
export const {
    setFilters,
    clearFilters,
    setPage,
    setPageSize,
    setSortModel,
    clearError,
    clearSuccess,
    reset,
} = activityLogSlice.actions;

// Selectors
export const selectActivityLogs = (state) => state.activityLog.logs;
export const selectTotalRecords = (state) => state.activityLog.totalRecords;
export const selectCurrentPage = (state) => state.activityLog.currentPage;
export const selectPageSize = (state) => state.activityLog.pageSize;
export const selectTotalPages = (state) => state.activityLog.totalPages;
export const selectFilters = (state) => state.activityLog.filters;
export const selectFilterOptions = (state) => state.activityLog.filterOptions;
export const selectSortModel = (state) => state.activityLog.sortModel;
export const selectLoading = (state) => state.activityLog.loading;
export const selectError = (state) => state.activityLog.error;
export const selectSuccess = (state) => state.activityLog.success;
export const selectFilterCount = (state) => {
    const filters = state.activityLog.filters;
    let count = 0;
    if (filters.action) count++;
    if (filters.entity) count++;
    if (filters.userId) count++;
    if (filters.fromDate) count++;
    if (filters.toDate) count++;
    return count;
};

export default activityLogSlice.reducer;