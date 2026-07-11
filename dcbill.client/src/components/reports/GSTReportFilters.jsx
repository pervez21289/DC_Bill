import React, { useState } from 'react';
import {
    Box,
    Grid,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    FormControlLabel,
    Checkbox,
    Tooltip,
    IconButton,
    Typography,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Refresh, FilterList, FilterListOff } from '@mui/icons-material';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
    startDate: Yup.date().required('Start date is required'),
    endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date must be after start date'),
});

const GSTReportFilters = ({
    dateRange,
    handleDateRangeChange,
    fetchReport,
    loading,
    error,
    clearError,
    company,
    showHSN = true,
    showParty = true,
    onShowHSNChange,
    onShowPartyChange,
}) => {
    const [includeCancelled, setIncludeCancelled] = useState(false);
    const [invoiceType, setInvoiceType] = useState('all');
    const [gstRate, setGstRate] = useState('all');

    const formik = useFormik({
        initialValues: {
            startDate: dateRange.startDate,
            endDate: dateRange.endDate,
        },
        validationSchema,
        onSubmit: (values) => {
            console.log('Form submitted with values:', values);
            // Just update the date range - the container will handle the fetch
            handleDateRangeChange(values);
        },
        validateOnChange: false,
        validateOnBlur: false,
        enableReinitialize: true,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        formik.validateForm().then((errors) => {
            if (Object.keys(errors).length === 0) {
                formik.submitForm();
            }
        });
    };

    const handleClear = () => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const newDateRange = { startDate: firstDay, endDate: today };
        formik.setValues(newDateRange);
        handleDateRangeChange(newDateRange);
        setIncludeCancelled(false);
        setInvoiceType('all');
        setGstRate('all');
        if (clearError) clearError();
    };

    const companyName = company?.companyName || 'Your Company';
    const gstin = company?.gstin || 'GSTIN Not Available';

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{
                mb: 3,
                p: 3,
                bgcolor: 'background.paper',
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                opacity: loading ? 0.6 : 1,
                transition: 'opacity 0.3s ease',
            }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" component="h2" gutterBottom>
                            GST Report Filters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {companyName} - {gstin}
                        </Typography>
                    </Box>
                    <Tooltip title="Clear Filters">
                        <IconButton onClick={handleClear} disabled={loading} size="small">
                            <FilterListOff />
                        </IconButton>
                    </Tooltip>
                </Box>

                <form onSubmit={handleSubmit} noValidate>
                    <Grid container spacing={3} alignItems="flex-end">
                        <Grid item xs={12} sm={6} md={4}>
                            <DatePicker
                                label="Start Date"
                                value={formik.values.startDate}
                                onChange={(newValue) => {
                                    formik.setFieldValue('startDate', newValue);
                                }}
                                disabled={loading}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: formik.touched.startDate && Boolean(formik.errors.startDate),
                                        helperText: formik.touched.startDate && formik.errors.startDate,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <DatePicker
                                label="End Date"
                                value={formik.values.endDate}
                                onChange={(newValue) => {
                                    formik.setFieldValue('endDate', newValue);
                                }}
                                disabled={loading}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        error: formik.touched.endDate && Boolean(formik.errors.endDate),
                                        helperText: formik.touched.endDate && formik.errors.endDate,
                                    },
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth size="small" disabled={loading}>
                                <InputLabel id="invoice-type-label">Invoice Type</InputLabel>
                                <Select
                                    labelId="invoice-type-label"
                                    label="Invoice Type"
                                    value={invoiceType}
                                    onChange={(e) => setInvoiceType(e.target.value)}
                                >
                                    <MenuItem value="all">All Types</MenuItem>
                                    <MenuItem value="B2B">B2B</MenuItem>
                                    <MenuItem value="B2C">B2C</MenuItem>
                                    <MenuItem value="Export">Export</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControl fullWidth size="small" disabled={loading}>
                                <InputLabel id="gst-rate-label">GST Rate</InputLabel>
                                <Select
                                    labelId="gst-rate-label"
                                    label="GST Rate"
                                    value={gstRate}
                                    onChange={(e) => setGstRate(e.target.value)}
                                >
                                    <MenuItem value="all">All Rates</MenuItem>
                                    <MenuItem value="0">0%</MenuItem>
                                    <MenuItem value="5">5%</MenuItem>
                                    <MenuItem value="12">12%</MenuItem>
                                    <MenuItem value="18">18%</MenuItem>
                                    <MenuItem value="28">28%</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={includeCancelled}
                                        onChange={(e) => setIncludeCancelled(e.target.checked)}
                                        size="small"
                                        disabled={loading}
                                    />
                                }
                                label="Include Cancelled Invoices"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showHSN}
                                        onChange={(e) => onShowHSNChange?.(e.target.checked)}
                                        size="small"
                                        disabled={loading}
                                    />
                                }
                                label="Show HSN Summary"
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={showParty}
                                        onChange={(e) => onShowPartyChange?.(e.target.checked)}
                                        size="small"
                                        disabled={loading}
                                    />
                                }
                                label="Show Party Summary"
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', pt: 1 }}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={<FilterList />}
                                    disabled={loading}
                                    size="large"
                                    sx={{ minWidth: 180 }}
                                >
                                    {loading ? 'Generating...' : 'Generate Report'}
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={fetchReport}
                                    disabled={loading}
                                    size="large"
                                >
                                    Refresh
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>

                    {error && (
                        <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                            <Typography color="error" variant="body2">
                                {error}
                            </Typography>
                        </Box>
                    )}
                </form>
            </Box>
        </LocalizationProvider>
    );
};

export default GSTReportFilters;