import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { itemMasterService } from "./../services/itemMasterService";

// Async thunks
export const fetchItemMaster = createAsyncThunk(
    "itemMaster/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await itemMasterService.get();

            // Response is the object directly
            // Check if response has success property
            if (response && response.success) {
                return response.data || []; // Return the data array
            }

            // If response is directly the array
            if (Array.isArray(response)) {
                return response;
            }

            return [];
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addItemToMaster = createAsyncThunk(
    "itemMaster/add",
    async (itemData, { rejectWithValue }) => {
        try {
            const response = await itemMasterService.create(itemData);

            // Response format: { success: true, message: "...", data: 4, error: null }
            if (response && response.success) {
                // Create the complete item object with the new ID
                const newItem = {
                    id: response.data,
                    itemName: itemData.itemName,
                    hsnCode: itemData.hsnCode,
                    rate: itemData.rate,
                    gst: itemData.gst
                };
                return newItem;
            }

            return rejectWithValue(response?.message || 'Failed to add item');
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updateItemInMaster = createAsyncThunk(
    "itemMaster/update",
    async (itemData , { rejectWithValue }) => {
        try {
          
            const response = await itemMasterService.update(itemData);
            return response;

            // if (response && response.success) {
            //     return { id, ...itemData };
            // }
            // return rejectWithValue(response?.message || 'Failed to update item');
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deleteItemFromMaster = createAsyncThunk(
    "itemMaster/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await itemMasterService.delete(id);

            if (response && response.success) {
                return { id };
            }
            return rejectWithValue(response?.message || 'Failed to delete item');
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    items: [],
    selectedItem: null,
    loading: false,
    error: null,
};

const itemMasterSlice = createSlice({
    name: 'itemMaster',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectItem: (state, action) => {
            state.selectedItem = action.payload;
        },
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        },
        addItemToState: (state, action) => {
            state.items.push(action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all items
            .addCase(fetchItemMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchItemMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.items = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchItemMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.items = [];
            })
            // Add item
            .addCase(addItemToMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addItemToMaster.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.items.push(action.payload);
                    state.selectedItem = action.payload;
                }
            })
            .addCase(addItemToMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update item
            .addCase(updateItemInMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateItemInMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
                state.selectedItem = action.payload;
            })
            .addCase(updateItemInMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Delete item
            .addCase(deleteItemFromMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteItemFromMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.items = state.items.filter(item => item.id !== action.payload.id);
                if (state.selectedItem?.id === action.payload.id) {
                    state.selectedItem = null;
                }
            })
            .addCase(deleteItemFromMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearError,
    selectItem,
    clearSelectedItem,
    addItemToState
} = itemMasterSlice.actions;

export default itemMasterSlice.reducer;