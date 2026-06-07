import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { invoiceService } from "./../services/invoiceService";

export const saveInvoice = createAsyncThunk(
    "invoice/save",
    async (invoiceData, { rejectWithValue }) => {
        try {
            const response = await invoiceService.create(invoiceData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchInvoices = createAsyncThunk(
    "invoice/fetchAll",
    async (filters, { rejectWithValue }) => {
        try {
            const response = await invoiceService.getAll(filters);
            return response; // response = { success: true, data: { data: [...], totalCount: 7 } }
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);


export const fetchInvoiceById = createAsyncThunk(
    "invoice/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await invoiceService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    invoices: [],
    currentInvoice: null,
    loading: false,
    error: null,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearCurrentInvoice: (state) => {
            state.currentInvoice = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Save Invoice
            .addCase(saveInvoice.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(saveInvoice.fulfilled, (state, action) => {
                state.loading = false;
                state.currentInvoice = action.payload;
            })
            .addCase(saveInvoice.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch All Invoices
            .addCase(fetchInvoices.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                state.loading = false;

                // Handle the nested response structure
                const response = action.payload;

                if (response && response.success && response.data) {
                    // Response structure: { success: true, data: { data: [...], totalCount: 7 } }
                    state.invoices = response.data.data || [];
                    state.totalCount = response.data.totalCount || 0;
                    state.currentPage = response.data.currentPage || 1;
                    state.pageSize = response.data.pageSize || 10;
                } else if (response && Array.isArray(response)) {
                    // Fallback for direct array response
                    state.invoices = response;
                    state.totalCount = response.length;
                } else {
                    state.invoices = [];
                    state.totalCount = 0;
                }
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.invoices = [];
                state.totalCount = 0;
            })
            // Fetch Invoice By Id
            .addCase(fetchInvoiceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentInvoice = action.payload;
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearCurrentInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer;