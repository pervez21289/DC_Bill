// BillingInfo.jsx
import {
    Paper, Box, Typography, TextField, Button, Grid, Snackbar, Alert, InputAdornment } from "@mui/material";
// In BillingSettings.jsx, update the imports
import {
    Save as SaveIcon,
    PictureAsPdf as PdfIcon,
    AccountBalanceWallet as WalletIcon  // Add this line
} from '@mui/icons-material';

export default function BillingInfo({ formData, handleChange, handleSubmit, snackbar, handleCloseSnackbar }) {
    return (
        <>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        bgcolor: "primary.main",
                        color: "white",
                        px: 4,
                        py: 2.5,
                    }}
                >
                    <Typography variant="h5" component="h2" fontWeight="bold">
                        Billing Settings
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                        Configure company billing information
                    </Typography>
                </Box>

                <Box component="form" onSubmit={handleSubmit} sx={{ p: 4, flex: 1, display: "flex", flexDirection: "column" }}>
                    <Grid container spacing={3}>
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

                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="PIN Code"
                                name="pinCode"
                                value={formData.pinCode}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="110001"
                            />
                        </Grid>

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
                        {/* UPI Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="UPI ID"
                                name="upi"
                                value={formData.upi}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="company@upi"
                                helperText="e.g., company@upi, name@bank, or phone@upi"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <WalletIcon sx={{ color: '#6c63ff' }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>

                    {/* Button - Now aligned with Country field */}
                    <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
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
                            Save Billing Settings
                        </Button>
                    </Box>
                </Box>
            </Paper>

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
        </>
    );
}