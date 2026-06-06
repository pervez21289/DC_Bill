import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial mock data
const initialState = {
    items: [
        {
            id: 1,
            itemName: 'Cement OPC 43',
            hsnCode: '2523',
            rate: 310,
            gst: 18
        },
        {
            id: 2,
            itemName: 'Cement PPC',
            hsnCode: '2523',
            rate: 295,
            gst: 18
        },
        {
            id: 3,
            itemName: 'TMT Steel 10mm',
            hsnCode: '7214',
            rate: 65000,
            gst: 18
        }
    ],
    loading: false,
    error: null
};

// Async thunk to fetch items from API
export const fetchItemMaster = createAsyncThunk(
    'itemMaster/fetch',
    async () => {
        // Replace with your API call
        // const response = await itemMasterService.get();
        // return response.data;

        // Mock API call
        return new Promise((resolve) => {
            setTimeout(() => resolve(initialState.items), 500);
        });
    }
);

// Async thunk to add new item
export const addItemToMaster = createAsyncThunk(
    'itemMaster/add',
    async (newItem, { rejectWithValue }) => {
        try {
            // Replace with your API call
            // const response = await itemMasterService.create(newItem);
            // return response.data;

            // Mock API call
            return {
                id: Date.now(),
                ...newItem,
                rate: Number(newItem.rate),
                gst: Number(newItem.gst)
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const itemMasterSlice = createSlice({
    name: 'itemMaster',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const newId = state.items.length + 1;
            state.items.push({
                id: newId,
                ...action.payload
            });
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchItemMaster.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchItemMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchItemMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addItemToMaster.fulfilled, (state, action) => {
                state.items.push(action.payload);
            });
    }
});

export const { addItem } = itemMasterSlice.actions;
export default itemMasterSlice.reducer;