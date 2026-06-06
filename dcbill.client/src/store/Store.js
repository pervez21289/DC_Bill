import { configureStore } from '@reduxjs/toolkit';

import customerReducer from './customerSlice';
import itemReducer from './itemSlice';
import invoiceReducer from './invoiceSlice';

export const store = configureStore({
    reducer: {
        customer: customerReducer,
        item: itemReducer,
        invoice: invoiceReducer
    }
});