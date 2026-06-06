import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    customers: []
};

const customerSlice = createSlice({
    name: 'customer',

    initialState,

    reducers: {
        setCustomers: (state, action) => {
            state.customers = action.payload;
        },

        addCustomer: (state, action) => {
            state.customers.push(action.payload);
        }
    }
});

export const {
    setCustomers,
    addCustomer
} = customerSlice.actions;

export default customerSlice.reducer;