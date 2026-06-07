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
    async (_, { rejectWithValue }) => {
        try {
            const response = await invoiceService.getAll();
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
                state.invoices = action.payload;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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