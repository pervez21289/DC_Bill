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
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    Card,
    CardContent,
} from "@mui/material";
import { Save as SaveIcon, PictureAsPdf as PdfIcon } from "@mui/icons-material";

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

    const [pageSettings, setPageSettings] = useState({
        pageSize: "A4",
        orientation: "portrait",
        marginTop: 20,
        marginRight: 20,
        marginBottom: 20,
        marginLeft: 20,
        fontSize: 8,
    });

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    // Load page settings from localStorage on component mount
    useEffect(() => {
        const savedPageSettings = localStorage.getItem("invoicePageSettings");
        if (savedPageSettings) {
            try {
                const parsed = JSON.parse(savedPageSettings);
                setPageSettings(parsed);
            } catch (error) {
                console.error("Error loading page settings:", error);
            }
        }
    }, []);

    useEffect(() => {
        dispatch(fetchBillingSettings());
    }, [dispatch]);

    useEffect(() => {
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

    const handlePageSettingChange = (e) => {
        const { name, value } = e.target;
        setPageSettings((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleMarginChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseInt(value) || 0;
        setPageSettings((prev) => ({
            ...prev,
            [name]: Math.min(Math.max(numValue, 0), 50), // Limit margins between 0-50
        }));
    };

    const handleSavePageSettings = () => {
        try {
            localStorage.setItem("invoicePageSettings", JSON.stringify(pageSettings));
            setSnackbar({
                open: true,
                message: "Page settings saved successfully!",
                severity: "success",
            });
        } catch (error) {
            setSnackbar({
                open: true,
                message: "Failed to save page settings",
                severity: "error",
            });
        }
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

    const handleResetPageSettings = () => {
        const defaultSettings = {
            pageSize: "A4",
            orientation: "portrait",
            marginTop: 20,
            marginRight: 20,
            marginBottom: 20,
            marginLeft: 20,
            fontSize: 8,
        };
        setPageSettings(defaultSettings);
        localStorage.setItem("invoicePageSettings", JSON.stringify(defaultSettings));
        setSnackbar({
            open: true,
            message: "Page settings reset to default!",
            severity: "success",
        });
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
            <Grid container spacing={3}>
                {/* Billing Information Section */}
                <Grid item xs={12} md={7}>
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
                                            Save Billing Settings
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>

                {/* Page Settings Section */}
                <Grid item xs={12} md={5}>
                    <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
                        <Box
                            sx={{
                                bgcolor: "secondary.main",
                                color: "white",
                                px: 4,
                                py: 3,
                                borderBottom: 1,
                                borderColor: "divider",
                            }}
                        >
                            <Typography variant="h5" component="h2" fontWeight="bold">
                                <PdfIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                                Page Settings
                            </Typography>
                            <Typography variant="body2" sx={{ opacity: 0.9, mt: 0.5 }}>
                                Configure PDF invoice page layout (saved locally)
                            </Typography>
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                            <Grid container spacing={3}>
                                {/* Page Size */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Page Size</InputLabel>
                                        <Select
                                            name="pageSize"
                                            value={pageSettings.pageSize}
                                            onChange={handlePageSettingChange}
                                            label="Page Size"
                                        >
                                            <MenuItem value="A4">A4 (210 × 297 mm)</MenuItem>
                                            <MenuItem value="A5">A5 (148 × 210 mm)</MenuItem>
                                            <MenuItem value="Letter">Letter (216 × 279 mm)</MenuItem>
                                            <MenuItem value="Legal">Legal (216 × 356 mm)</MenuItem>
                                        </Select>
                                        <FormHelperText>Select paper size for PDF</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Orientation */}
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth>
                                        <InputLabel>Orientation</InputLabel>
                                        <Select
                                            name="orientation"
                                            value={pageSettings.orientation}
                                            onChange={handlePageSettingChange}
                                            label="Orientation"
                                        >
                                            <MenuItem value="portrait">Portrait</MenuItem>
                                            <MenuItem value="landscape">Landscape</MenuItem>
                                        </Select>
                                        <FormHelperText>Page orientation</FormHelperText>
                                    </FormControl>
                                </Grid>

                                {/* Font Size */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth>
                                        <InputLabel>Font Size</InputLabel>
                                        <Select
                                            name="fontSize"
                                            value={pageSettings.fontSize}
                                            onChange={handlePageSettingChange}
                                            label="Font Size"
                                        >
                                            <MenuItem value={6}>6 - Extra Small (Save More)</MenuItem>
                                            <MenuItem value={7}>7 - Small (Save Ink)</MenuItem>
                                            <MenuItem value={8}>8 - Normal (Balanced)</MenuItem>
                                            <MenuItem value={9}>9 - Large (Readable)</MenuItem>
                                            <MenuItem value={10}>10 - Extra Large</MenuItem>
                                        </Select>
                                        <FormHelperText>
                                            Smaller font saves printing cost
                                        </FormHelperText>
                                    </FormControl>
                                </Grid>

                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }}>
                                        <Typography variant="caption" color="textSecondary">
                                            Margins (in points, 1pt = 1/72 inch)
                                        </Typography>
                                    </Divider>
                                </Grid>

                                {/* Margins */}
                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Top Margin"
                                        name="marginTop"
                                        type="number"
                                        value={pageSettings.marginTop}
                                        onChange={handleMarginChange}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, max: 50 } }}
                                        helperText="0-50 pts"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Bottom Margin"
                                        name="marginBottom"
                                        type="number"
                                        value={pageSettings.marginBottom}
                                        onChange={handleMarginChange}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, max: 50 } }}
                                        helperText="0-50 pts"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Left Margin"
                                        name="marginLeft"
                                        type="number"
                                        value={pageSettings.marginLeft}
                                        onChange={handleMarginChange}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, max: 50 } }}
                                        helperText="0-50 pts"
                                    />
                                </Grid>

                                <Grid item xs={6}>
                                    <TextField
                                        fullWidth
                                        label="Right Margin"
                                        name="marginRight"
                                        type="number"
                                        value={pageSettings.marginRight}
                                        onChange={handleMarginChange}
                                        variant="outlined"
                                        size="small"
                                        InputProps={{ inputProps: { min: 0, max: 50 } }}
                                        helperText="0-50 pts"
                                    />
                                </Grid>

                                {/* Preview Box */}
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            bgcolor: "#f5f5f5",
                                            p: 2,
                                            borderRadius: 1,
                                            mt: 1,
                                            textAlign: "center",
                                        }}
                                    >
                                        <Typography variant="caption" color="textSecondary">
                                            Preview: {pageSettings.pageSize} | {pageSettings.orientation} | Font: {pageSettings.fontSize}pt
                                        </Typography>
                                    </Box>
                                </Grid>

                                {/* Action Buttons */}
                                <Grid item xs={12}>
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            gap: 2,
                                            mt: 2,
                                        }}
                                    >
                                        <Button
                                            variant="outlined"
                                            onClick={handleResetPageSettings}
                                            sx={{ textTransform: "none" }}
                                        >
                                            Reset to Default
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            onClick={handleSavePageSettings}
                                            startIcon={<SaveIcon />}
                                            sx={{ textTransform: "none", fontWeight: "bold" }}
                                        >
                                            Save Page Settings
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Paper>
                </Grid>
            </Grid>

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