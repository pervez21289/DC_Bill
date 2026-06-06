// BillingSettings.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBillingSettings,
  updateBillingSettings,
} from "./../../store/billingSettingsSlice";

// MUI Components
import {
  Container,
  Paper,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import { Save as SaveIcon } from "@mui/icons-material";

export default function BillingSettings() {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(
    (state) => state.billingSettings
  );

  const [formData, setFormData] = useState({
    id: 0,
    companyName: "",
    gstin: "",
    mobileNumber: "",
    address: "",
    city: "",
    pinCode: "",
    state: "",
    country: "",
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchBillingSettings());
  }, [dispatch]);

    useEffect(() => {
      debugger
    if (data) {
      setFormData({
        id: data.id || 0,
        companyName: data.companyName || "",
        gstin: data.gstin || "",
        mobileNumber: data.mobileNumber || "",
        address: data.address || "",
        city: data.city || "",
        pinCode: data.pinCode || "",
        state: data.state || "",
        country: data.country || "",
      });
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(updateBillingSettings(formData)).unwrap();
      setSnackbar({
        open: true,
        message: "Billing settings saved successfully!",
        severity: "success",
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message || "Failed to save settings",
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading billing settings...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* Header */}
        <Box
          sx={{
            bgcolor: "primary.main",
            color: "white",
            px: 4,
            py: 3,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="h5" component="h2" fontWeight="bold">
            Billing Settings
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
            Configure company billing information
          </Typography>
        </Box>

        {/* Form */}
        <Box component="form" onSubmit={handleSubmit} sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {/* Company Name */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter company name"
              />
            </Grid>

            {/* GSTIN */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                required
                label="GST Number (GSTIN)"
                name="gstin"
                value={formData.gstin}
                onChange={handleChange}
                variant="outlined"
                placeholder="22AAAAA0000A1Z"
                helperText="15-digit GST identification number"
              />
            </Grid>

            {/* Mobile Number */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Mobile Number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                variant="outlined"
                placeholder="9876543210"
                type="tel"
              />
            </Grid>

            {/* Address */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                variant="outlined"
                multiline
                rows={3}
                placeholder="Enter complete address"
              />
            </Grid>

            {/* City */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter city"
              />
            </Grid>

            {/* PIN Code */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="PIN Code"
                name="pinCode"
                value={formData.pinCode}
                onChange={handleChange}
                variant="outlined"
                placeholder="110001"
                type="text"
              />
            </Grid>

            {/* State */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={formData.state}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter state"
              />
            </Grid>

            {/* Country */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                variant="outlined"
                placeholder="Enter country"
              />
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: 2,
                  mt: 2,
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  startIcon={<SaveIcon />}
                  sx={{
                    px: 4,
                    py: 1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  Save Settings
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>

      {/* Success/Error Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}