import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Initial state
const initialState = {
    parties: [],
    selectedParty: null,
    loading: false,
    error: null
};

// Async thunk to fetch parties from API
export const fetchParties = createAsyncThunk(
    'parties/fetch',
    async () => {
        // Replace with your API call
        // const response = await partyService.getAll();
        // return response.data;

        // Mock data for now
        return new Promise((resolve) => {
            setTimeout(() => resolve([
                {
                    id: 1,
                    partyName: 'M/s. Tata Motors Ltd',
                    address: '91, Phata 2, Tapanpur Nagar',
                    city: 'Tehri',
                    state: 'Uttarakhand',
                    pinCode: '248001',
                    gstin: '05AAACT1234Q1Z2',
                    mobile: '9876543210',
                    email: 'tata@example.com'
                },
                {
                    id: 2,
                    partyName: 'M/s. Reliance Industries',
                    address: 'Block A, Corporate Park',
                    city: 'Mumbai',
                    state: 'Maharashtra',
                    pinCode: '400001',
                    gstin: '27AAACR1234Q1Z5',
                    mobile: '9876543211',
                    email: 'reliance@example.com'
                },
                {
                    id: 3,
                    partyName: 'M/s. Adani Group',
                    address: 'Adani Corporate House',
                    city: 'Ahmedabad',
                    state: 'Gujarat',
                    pinCode: '380001',
                    gstin: '24AAACA1234Q1Z8',
                    mobile: '9876543212',
                    email: 'adani@example.com'
                }
            ]), 500);
        });
    }
);

// Async thunk to add new party
export const addParty = createAsyncThunk(
    'parties/add',
    async (partyData, { rejectWithValue }) => {
        try {
            // Replace with your API call
            // const response = await partyService.create(partyData);
            // return response.data;

            return {
                id: Date.now(),
                ...partyData
            };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

// Async thunk to update party
export const updateParty = createAsyncThunk(
    'parties/update',
    async ({ id, partyData }, { rejectWithValue }) => {
        try {
            // Replace with your API call
            // const response = await partyService.update(id, partyData);
            // return response.data;

            return { id, ...partyData };
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

const partySlice = createSlice({
    name: 'parties',
    initialState,
    reducers: {
        selectParty: (state, action) => {
            state.selectedParty = action.payload;
        },
        clearSelectedParty: (state) => {
            state.selectedParty = null;
        },
        addLocalParty: (state, action) => {
            const newParty = {
                id: Date.now(),
                ...action.payload
            };
            state.parties.push(newParty);
            state.selectedParty = newParty;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchParties.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchParties.fulfilled, (state, action) => {
                state.loading = false;
                state.parties = action.payload;
            })
            .addCase(fetchParties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(addParty.fulfilled, (state, action) => {
                state.parties.push(action.payload);
                state.selectedParty = action.payload;
            })
            .addCase(updateParty.fulfilled, (state, action) => {
                const index = state.parties.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.parties[index] = action.payload;
                    state.selectedParty = action.payload;
                }
            });
    }
});

export const { selectParty, clearSelectedParty, addLocalParty } = partySlice.actions;
export default partySlice.reducer;