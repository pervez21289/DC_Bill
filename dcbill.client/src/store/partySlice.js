import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { partyService } from "./../services/partyService";

// Async thunks
export const fetchParties = createAsyncThunk(
    "parties/fetch",
    async (_, { rejectWithValue }) => {
        try {
            const response = await partyService.get();
            // Handle response format
            if (response && response.success) {
                return response.data || [];
            }
            if (Array.isArray(response)) {
                return response;
            }
            return [];
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addPartyToMaster = createAsyncThunk(
    "parties/add",
    async (partyData, { rejectWithValue }) => {
        try {
            const response = await partyService.create(partyData);
            if (response && response.success) {
                const newParty = {
                    id: response.data,
                    ...partyData
                };
                return newParty;
            }
            return rejectWithValue(response?.message || 'Failed to add party');
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const updatePartyInMaster = createAsyncThunk(
    "parties/update",
    async ({ id, partyData }, { rejectWithValue }) => {
        try {
            const response = await partyService.update(id, partyData);
            if (response && response.success) {
                return { id, ...partyData };
            }
            return rejectWithValue(response?.message || 'Failed to update party');
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const deletePartyFromMaster = createAsyncThunk(
    "parties/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await partyService.delete(id);
            if (response && response.success) {
                return { id };
            }
            return rejectWithValue(response?.message || 'Failed to delete party');
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
        addPartyLocally: (state, action) => {
            state.parties.push(action.payload);
        },
        // Add this - the addParty action you're trying to use
        addParty: (state, action) => {
            state.parties.push(action.payload);
        },
        updateParty: (state, action) => {
            const index = state.parties.findIndex(party => party.id === action.payload.id);
            if (index !== -1) {
                state.parties[index] = action.payload;
            }
        },
        deleteParty: (state, action) => {
            state.parties = state.parties.filter(party => party.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchParties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParties.fulfilled, (state, action) => {
                state.loading = false;
                state.parties = Array.isArray(action.payload) ? action.payload : [];
            })
            .addCase(fetchParties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.parties = [];
            })
            .addCase(addPartyToMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addPartyToMaster.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload) {
                    state.parties.push(action.payload);
                    state.selectedParty = action.payload;
                }
            })
            .addCase(addPartyToMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(updatePartyInMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePartyInMaster.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.parties.findIndex(party => party.id === action.payload.id);
                if (index !== -1) {
                    state.parties[index] = action.payload;
                }
                state.selectedParty = action.payload;
            })
            .addCase(updatePartyInMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(deletePartyFromMaster.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deletePartyFromMaster.fulfilled, (state, action) => {
                state.loading = false;
                state.parties = state.parties.filter(party => party.id !== action.payload.id);
                if (state.selectedParty?.id === action.payload.id) {
                    state.selectedParty = null;
                }
            })
            .addCase(deletePartyFromMaster.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

// Export all actions including addParty
export const {
    clearError,
    selectParty,
    clearSelectedParty,
    addPartyLocally,
    addParty,      // Add this export
    updateParty,   // Add this export
    deleteParty    // Add this export
} = partySlice.actions;

export default partySlice.reducer;