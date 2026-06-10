// BillingSettings.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchBillingSettings, updateBillingSettings } from "./../../store/billingSettingsSlice";
import { Container, Grid, CircularProgress, Box, Typography } from "@mui/material";
import BillingInfo from "./BillingInfo";
import PageSettings from "./PageSettings";

export default function BillingSettings() {
    const dispatch = useDispatch();
    const { data, loading, error } = useSelector((state) => state.billingSettings);

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
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
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
                    <BillingInfo
                        formData={formData}
                        handleChange={handleChange}
                        handleSubmit={handleSubmit}
                        snackbar={snackbar}
                        handleCloseSnackbar={handleCloseSnackbar}
                    />
                </Grid>

                {/* Page Settings Section */}
                <Grid item xs={12} md={5}>
                    <PageSettings />
                </Grid>
            </Grid>
        </Container>
    );
}