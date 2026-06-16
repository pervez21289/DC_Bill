import { configureStore } from '@reduxjs/toolkit';

import customerReducer from './customerSlice';
import itemReducer from './itemSlice';
import invoiceReducer from './invoiceSlice';
import billingReducer from "./billingSettingsSlice";
import itemMasterReducer from './itemMasterSlice';
import invoiceItemsReducer from './invoiceItemsSlice';
import partyReducer from './partySlice';
import authReducer from './authSlice'; // Add this
import reportReducer from './reportSlice'; // Add this
import activityLogReducer from './activityLogSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,           // Add this
        customer: customerReducer,
        item: itemReducer,
        invoice: invoiceReducer,
        billingSettings: billingReducer,
        itemMaster: itemMasterReducer,
        invoiceItems: invoiceItemsReducer,
        parties: partyReducer,
        activityLog: activityLogReducer,
        report: reportReducer
    }
});