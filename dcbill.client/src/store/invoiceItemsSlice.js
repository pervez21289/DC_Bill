import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [],
    loading: false,
    error: null
};

const invoiceItemsSlice = createSlice({
    name: 'invoiceItems',
    initialState,
    reducers: {
        addItem: (state, action) => {
            state.items.push({
                itemId: "",
                itemName: "",
                hsnCode: "",
                qty: 0,
                rate: 0,
                amount: 0,
                gst: 0,
                ...action.payload
            });
        },
        updateItem: (state, action) => {
            const { index, data } = action.payload;
            if (state.items[index]) {
                // Update the item with new data
                state.items[index] = { ...state.items[index], ...data };

                // Recalculate amount (qty * rate)
                const qty = Number(state.items[index].qty) || 0;
                const rate = Number(state.items[index].rate) || 0;
                state.items[index].amount = qty * rate;
            }
        },
        deleteItem: (state, action) => {
            state.items = state.items.filter((_, i) => i !== action.payload);
        },
        clearItems: (state) => {
            state.items = [];
        }
    }
});

export const { addItem, updateItem, deleteItem, clearItems } = invoiceItemsSlice.actions;
export default invoiceItemsSlice.reducer;