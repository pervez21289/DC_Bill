import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: []
};

const itemSlice = createSlice({
    name: 'item',

    initialState,

    reducers: {
        setItems: (state, action) => {
            state.items = action.payload;
        },

        addItemMaster: (state, action) => {
            state.items.push(action.payload);
        }
    }
});

export const {
    setItems,
    addItemMaster
} = itemSlice.actions;

export default itemSlice.reducer;