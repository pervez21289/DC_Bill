import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    invoiceNo: '',
    invoiceDate: '',
    customer: null,
    items: []
};

const invoiceSlice = createSlice({
    name: 'invoice',

    initialState,

    reducers: {
        setInvoiceNo: (state, action) => {
            state.invoiceNo = action.payload;
        },

        setInvoiceDate: (state, action) => {
            state.invoiceDate = action.payload;
        },

        setCustomer: (state, action) => {
            state.customer = action.payload;
        },

        setItems: (state, action) => {
            state.items = action.payload;
        },

        addItem: (state, action) => {
            state.items.push(action.payload);
        },

        removeItem: (state, action) => {
            state.items = state.items.filter(
                (_, index) => index !== action.payload
            );
        },

        clearInvoice: (state) => {
            state.items = [];
            state.customer = null;
        }
    }
});

export const {
    setInvoiceNo,
    setInvoiceDate,
    setCustomer,
    setItems,
    addItem,
    removeItem,
    clearInvoice
} = invoiceSlice.actions;

export default invoiceSlice.reducer;