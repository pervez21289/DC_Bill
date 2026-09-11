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

// ── Update Payment Status ────────────────────────────────────────────────────
export const updateInvoicePaymentStatus = createAsyncThunk(
    "invoice/updatePaymentStatus",
    async ({ invoiceId, paymentStatus }, { rejectWithValue }) => {
        try {
           
            const response = await invoiceService.update(invoiceId, { paymentStatus: paymentStatus });
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// ── NEW: Send Payment Reminder ──────────────────────────────────────────────
export const sendPaymentReminder = createAsyncThunk(
    "invoice/sendReminder",
    async ({ invoiceId, customMessage }, { rejectWithValue }) => {
        try {
            const response = await invoiceService.sendReminder(invoiceId, customMessage);
            return response; // expects { isSuccess: true, message: '...' }
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
    pdfLoading: false,
    pdfData: null,
    statusUpdating: false,   // tracks payment status update in progress
    reminderSending: false,   // track reminder sending state
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
            // ── Save Invoice ─────────────────────────────────────────────────
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

            // ── Fetch All Invoices ───────────────────────────────────────────
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

            // ── Fetch Invoice By Id ──────────────────────────────────────────
            .addCase(fetchInvoiceById.pending, (state) => {
                state.pdfLoading = true;
                state.error = null;
            })
            .addCase(fetchInvoiceById.fulfilled, (state, action) => {
                state.pdfLoading = false;
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
            })

            // ── Update Payment Status ────────────────────────────────────────
            .addCase(updateInvoicePaymentStatus.pending, (state) => {
                state.statusUpdating = true;
                state.error = null;
            })
            .addCase(updateInvoicePaymentStatus.fulfilled, (state, action) => {
                state.statusUpdating = false;
                const { invoiceId, paymentStatus } = action.meta.arg;

                // // Update in the invoices list (for list pages)
                // const idx = state.invoices.findIndex(inv => inv.id === invoiceId);
                // if (idx !== -1) {
                //     state.invoices[idx].paymentStatus = paymentStatus;
                // }

                // // Update currentInvoice if it's the same one (for detail/view page)
                // if (state.currentInvoice && state.currentInvoice.id === invoiceId) {
                //     state.currentInvoice.paymentStatus = paymentStatus;
                // }

                state.currentInvoice.paymentStatus = paymentStatus;
            })
            .addCase(updateInvoicePaymentStatus.rejected, (state, action) => {
                state.statusUpdating = false;
                state.error = action.payload;
            })   
            .addCase(sendPaymentReminder.pending, (state) => {
                state.reminderSending = true;
                state.error = null;
            })
            .addCase(sendPaymentReminder.fulfilled, (state) => {
                state.reminderSending = false;
                // Optionally set a flag like 'lastReminderSent' if needed
            })
            .addCase(sendPaymentReminder.rejected, (state, action) => {
                state.reminderSending = false;
                state.error = action.payload;
            });
    }
});

export const { clearError, clearCurrentInvoice, clearPdfData, setPdfLoading } = invoiceSlice.actions;
export default invoiceSlice.reducer;