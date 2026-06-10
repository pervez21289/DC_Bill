// PageSettings.jsx
import { useState, useEffect } from "react";
import {
    Paper,
    Box,
    Typography,
    Button,
    Grid,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormHelperText,
    TextField,
    CardContent,
    Snackbar,
    Alert,
} from "@mui/material";
import { Save as SaveIcon, PictureAsPdf as PdfIcon } from "@mui/icons-material";

export default function PageSettings() {
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
            [name]: Math.min(Math.max(numValue, 0), 50),
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden", height: "100%", display: "flex", flexDirection: "column" }}>
                <Box
                    sx={{
                        bgcolor: "secondary.main",
                        color: "white",
                        px: 4,
                        py: 2.5,
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

                <CardContent sx={{ p: 3, flex: 1 }}>
                    <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
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

                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
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

                        <Grid item xs={12}>
                            <FormControl fullWidth size="small">
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
                                <FormHelperText>Smaller font saves printing cost</FormHelperText>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <Divider sx={{ my: 1 }}>
                                <Typography variant="caption" color="textSecondary">
                                    Margins (in points, 1pt = 1/72 inch)
                                </Typography>
                            </Divider>
                        </Grid>

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

                        <Grid item xs={12}>
                            <Box
                                sx={{
                                    bgcolor: "#f5f5f5",
                                    p: 1.5,
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
                                    sx={{ textTransform: "none", flex: 1 }}
                                >
                                    Reset 
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleSavePageSettings}
                                    startIcon={<SaveIcon />}
                                    sx={{ textTransform: "none", fontWeight: "bold", flex: 1 }}
                                >
                                    Save 
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
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