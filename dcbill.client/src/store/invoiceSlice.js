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
            return response;
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
    totalCount: 0,
    currentPage: 1,
    pageSize: 10,
    pdfLoading: false,        // Separate loading for PDF operations
    pdfData: null,            // Store PDF data temporarily
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
        clearPdfData: (state) => {
            state.pdfData = null;
            state.pdfLoading = false;
        },
        setPdfLoading: (state, action) => {
            state.pdfLoading = action.payload;
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

                const response = action.payload;

                if (response && response.success && response.data) {
                    state.invoices = response.data.data || [];
                    state.totalCount = response.data.totalCount || 0;
                    state.currentPage = response.data.currentPage || 1;
                    state.pageSize = response.data.pageSize || 10;
                } else if (response && Array.isArray(response)) {
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

            // Fetch Invoice By Id (for PDF)
            .addCase(fetchInvoiceById.pending, (state) => {
                state.pdfLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.pdfLoading = false;
                // Extract the invoice data from response
                const response = action.payload;
                if (response && response.success && response.data) {
                    state.currentInvoice = response.data;
                } else if (response && response.data) {
                    state.currentInvoice = response.data;
                } else {
                    state.currentInvoice = response;
                }
            })
            .addCase(fetchInvoiceById.rejected, (state, action) => {
                state.pdfLoading = false;
                state.error = action.payload;
                state.currentInvoice = null;
            });
    }
});

export const { clearError, clearCurrentInvoice, clearPdfData, setPdfLoading } = invoiceSlice.actions;
export default invoiceSlice.reducer;