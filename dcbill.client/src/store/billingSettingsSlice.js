import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { billingSettingsService } from "./../services/billingSettingsService";

export const fetchBillingSettings = createAsyncThunk(
  "billingSettings/fetch",
  async () => {
      const response = await billingSettingsService.get();
   
    return response;
  }
);

export const updateBillingSettings = createAsyncThunk(
  "billingSettings/save",
  async (payload) => {
      const response = await billingSettingsService.save(payload);
    return response;
  }
);

const billingSlice = createSlice({
  name: "billingSettings",
  initialState: {
    data: null,
    loading: false,
    error: null,
  },
  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchBillingSettings.pending, (state) => {
        state.loading = true;
      })

        .addCase(fetchBillingSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })

      .addCase(fetchBillingSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(updateBillingSettings.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export default billingSlice.reducer;