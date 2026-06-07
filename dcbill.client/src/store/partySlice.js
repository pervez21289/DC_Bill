// store/partySlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { partyService } from "./../services/partyService";

// Async thunks
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

export const fetchPartyById = createAsyncThunk(
    "parties/fetchById",
    async (id, { rejectWithValue }) => {
        try {
            const response = await partyService.getById(id);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const addParty = createAsyncThunk(
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

export const updateParty = createAsyncThunk(
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

export const deleteParty = createAsyncThunk(
    "parties/delete",
    async (id, { rejectWithValue }) => {
        try {
            const response = await partyService.delete(id);
            return { id, ...response };
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const searchParties = createAsyncThunk(
    "parties/search",
    async (keyword, { rejectWithValue }) => {
        try {
            const response = await partyService.search(keyword);
            return response;
        } catch (error) {
            return rejectWithValue(error.response?.data || error.message);
        }
    }
);

export const fetchPartyByGSTIN = createAsyncThunk(
    "parties/fetchByGSTIN",
    async (gstin, { rejectWithValue }) => {
        try {
            const response = await partyService.getByGSTIN(gstin);
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
    searchResults: []
};

const partySlice = createSlice({
    name: 'parties',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSearchResults: (state) => {
            state.searchResults = [];
        },
        selectParty: (state, action) => {
            state.selectedParty = action.payload;
        },
        clearSelectedParty: (state) => {
            state.selectedParty = null;
        },
        addLocalParty: (state, action) => {
            state.parties.push(action.payload);
        },
        updateLocalParty: (state, action) => {
            const index = state.parties.findIndex(party => party.id === action.payload.id);
            if (index !== -1) {
                state.parties[index] = action.payload;
            }
        },
        deleteLocalParty: (state, action) => {
            state.parties = state.parties.filter(party => party.id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all parties
            .addCase(fetchParties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchParties.fulfilled, (state, action) => {
                state.loading = false;
                state.parties = action.payload;
            })
            .addCase(fetchParties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch by ID
            .addCase(fetchPartyById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartyById.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedParty = action.payload;
            })
            .addCase(fetchPartyById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add party
            .addCase(addParty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addParty.fulfilled, (state, action) => {
                state.loading = false;
                state.parties.push(action.payload);
                state.selectedParty = action.payload;
            })
            .addCase(addParty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update party
            .addCase(updateParty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateParty.fulfilled, (state, action) => {
                state.loading = false;
                const index = state.parties.findIndex(party => party.id === action.payload.id);
                if (index !== -1) {
                    state.parties[index] = action.payload;
                }
                if (state.selectedParty?.id === action.payload.id) {
                    state.selectedParty = action.payload;
                }
            })
            .addCase(updateParty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete party
            .addCase(deleteParty.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteParty.fulfilled, (state, action) => {
                state.loading = false;
                state.parties = state.parties.filter(party => party.id !== action.payload.id);
                if (state.selectedParty?.id === action.payload.id) {
                    state.selectedParty = null;
                }
            })
            .addCase(deleteParty.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Search parties
            .addCase(searchParties.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchParties.fulfilled, (state, action) => {
                state.loading = false;
                state.searchResults = action.payload;
            })
            .addCase(searchParties.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch by GSTIN
            .addCase(fetchPartyByGSTIN.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPartyByGSTIN.fulfilled, (state, action) => {
                state.loading = false;
                state.selectedParty = action.payload;
            })
            .addCase(fetchPartyByGSTIN.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    }
});

export const {
    clearError,
    clearSearchResults,
    selectParty,
    clearSelectedParty,
    addLocalParty,
    updateLocalParty,
    deleteLocalParty
} = partySlice.actions;

export default partySlice.reducer;