import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { partyService } from "./../services/partyService";

// Async thunk to add party to database
export const addPartyToMaster = createAsyncThunk(
    "parties/add",
    async (partyData, { rejectWithValue }) => {
        try {
            const response = await partyService.create(partyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to fetch parties
export const fetchParties = createAsyncThunk(
    "parties/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await partyService.get();
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

// Async thunk to update party
export const updatePartyInMaster = createAsyncThunk(
    "parties/update",
    async ({ id, partyData }, { rejectWithValue }) => {
        try {
            const response = await partyService.update(id, partyData);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

const initialState = {
    parties: [],
    selectedParty: null,
    loading: false,
    error: null,
};

const partySlice = createSlice({
    name: 'parties',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        selectParty: (state, action) => {
            state.selectedParty = action.payload;
        },
        clearSelectedParty: (state) => {
            state.selectedParty = null;
        },
        // Add this - local action for adding party without API
        addParty: (state, action) => {
            state.parties.push(action.payload);
        },
        // Add this - local action for updating party without API
        updateParty: (state, action) => {
            const index = state.parties.findIndex(party => party.id === action.payload.id);
            if (index !== -1) {
                state.parties[index] = action.payload;
            }
        },
        // Add this - local action for deleting party without API
        deleteParty: (state, action) => {
            state.parties = state.parties.filter(party => party.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch parties
            .addCase(fetchParties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParties.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.success) {
                    state.parties = Array.isArray(action.payload.data) ? action.payload.data : [];
                } else if (Array.isArray(action.payload)) {
                    state.parties = action.payload;
                } else {
                    state.parties = [];
                }
            })
            .addCase(fetchParties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.parties = [];
            })
            // Add party
            .addCase(addPartyToMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPartyToMaster.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload && action.payload.success && action.payload.data) {
                    // Refresh parties after successful API call
                    // You'll need to call fetchParties again or construct the object
                }
            })
            .addCase(addPartyToMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update party
            .addCase(updatePartyInMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePartyInMaster.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(updatePartyInMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearError,
    selectParty,
    clearSelectedParty,
    addParty,      // Export this
    updateParty,   // Export this
    deleteParty    // Export this
} = partySlice.actions;

export default partySlice.reducer;