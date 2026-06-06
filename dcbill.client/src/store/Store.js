import { configureStore } from '@reduxjs/toolkit';

import customerReducer from './customerSlice';
import itemReducer from './itemSlice';
import invoiceReducer from './invoiceSlice';
import billingReducer from "./billingSettingsSlice";
import itemMasterReducer from './itemMasterSlice';
import invoiceItemsReducer from './invoiceItemsSlice';
import partyReducer from './partySlice'; // Add this

export const store = configureStore({
    reducer: {
        customer: customerReducer,
        item: itemReducer,
        invoice: invoiceReducer,
        billingSettings: billingReducer,
        itemMaster: itemMasterReducer,
        invoiceItems: invoiceItemsReducer,
        parties: partyReducer // Add this
    }
});