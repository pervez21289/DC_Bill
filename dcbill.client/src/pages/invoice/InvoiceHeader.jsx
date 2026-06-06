import { Box, TextField, Typography, Grid, Paper, Autocomplete, Button, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { fetchBillingSettings, updateBillingSettings } from './../../store/billingSettingsSlice';
import { fetchParties, selectParty, addLocalParty, addParty } from './../../store/partySlice';
import AddIcon from '@mui/icons-material/Add';

export default function InvoiceHeader() {
    const dispatch = useDispatch();
    const { data: billingData, loading: billingLoading } = useSelector(state => state.billingSettings);
    const { parties, selectedParty, loading: partiesLoading } = useSelector(state => state.parties);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newParty, setNewParty] = useState({
        partyName: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        gstin: '',
        mobile: '',
        email: ''
    });

    const [invoiceData, setInvoiceData] = useState({
        gstin: '',
        mobile: '',
        companyName: '',
        address: '',
        city: '',
        pinCode: '',
        state: '',
        country: '',
        dated: new Date().toLocaleDateString('en-GB'),
        invoiceNo: '048',
        partyName: '',
        partyAddress: '',
        partyCity: '',
        partyState: '',
        partyPinCode: '',
        partyGstin: '',
        partyMobile: ''
    });

    // Fetch billing settings and parties on component mount
    useEffect(() => {
        dispatch(fetchBillingSettings());
        dispatch(fetchParties());
    }, [dispatch]);

    // Populate form when billing data is loaded
    useEffect(() => {
        if (billingData) {
            setInvoiceData(prev => ({
                ...prev,
                gstin: billingData.gstin || '',
                mobile: billingData.mobileNumber || '',
                companyName: billingData.companyName || '',
                address: billingData.address || '',
                city: billingData.city || '',
                pinCode: billingData.pinCode || '',
                state: billingData.state || '',
                country: billingData.country || ''
            }));
        }
    }, [billingData]);

    // Populate form when party is selected
    useEffect(() => {
        if (selectedParty) {
            setInvoiceData(prev => ({
                ...prev,
                partyName: selectedParty.partyName || '',
                partyAddress: selectedParty.address || '',
                partyCity: selectedParty.city || '',
                partyState: selectedParty.state || '',
                partyPinCode: selectedParty.pinCode || '',
                partyGstin: selectedParty.gstin || '',
                partyMobile: selectedParty.mobile || ''
            }));
        }
    }, [selectedParty]);

    const handleChange = (field, value) => {
        setInvoiceData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handlePartySelect = (event, newValue) => {
        if (newValue) {
            dispatch(selectParty(newValue));
        } else {
            dispatch(selectParty(null));
            setInvoiceData(prev => ({
                ...prev,
                partyName: '',
                partyAddress: '',
                partyCity: '',
                partyState: '',
                partyPinCode: '',
                partyGstin: '',
                partyMobile: ''
            }));
        }
    };

    // Save billing settings when company details change
    const handleSaveCompanyDetails = () => {
        const billingSettings = {
            companyName: invoiceData.companyName,
            gstin: invoiceData.gstin,
            mobileNumber: invoiceData.mobile,
            address: invoiceData.address,
            city: invoiceData.city,
            pinCode: invoiceData.pinCode,
            state: invoiceData.state,
            country: invoiceData.country
        };

        dispatch(updateBillingSettings(billingSettings));
    };

    const handleAddNewParty = () => {
        // Validate required fields
        if (!newParty.partyName || !newParty.gstin) {
            alert('Please fill Party Name and GSTIN');
            return;
        }

        // Add new party
        dispatch(addParty(newParty));

        // Reset form and close dialog
        setNewParty({
            partyName: '',
            address: '',
            city: '',
            state: '',
            pinCode: '',
            gstin: '',
            mobile: '',
            email: ''
        });
        setIsDialogOpen(false);
    };

    // Common text field styles for compact view
    const textFieldStyles = {
        '& .MuiInputBase-root': {
            fontSize: '0.7rem',
            minHeight: '28px'
        },
        '& .MuiInputBase-input': {
            py: 0.3,
            px: 0.5
        },
        '& .MuiFormLabel-root': {
            fontSize: '0.7rem'
        }
    };

    const labelStyles = {
        fontSize: '0.7rem',
        fontWeight: 'bold',
        minWidth: '80px'
    };

    if (billingLoading) {
        return (
            <Paper sx={{ p: 2, mb: 2, textAlign: 'center' }}>
                <Typography sx={{ fontSize: '0.75rem' }}>Loading company details...</Typography>
            </Paper>
        );
    }

    return (
        <>
            <Paper
                elevation={1}
                sx={{
                    p: 1.5,
                    mb: 2,
                    borderRadius: 1,
                    border: '1px solid #e0e0e0'
                }}
            >
                {/* Top Row - GSTIN, TAX INVOICE, MOB */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>GSTIN :</Typography>
                        <TextField
                            size="small"
                            value={invoiceData.gstin}
                            onChange={(e) => handleChange('gstin', e.target.value)}
                            onBlur={handleSaveCompanyDetails}
                            sx={{ width: 150, ...textFieldStyles }}
                            variant="outlined"
                        />
                    </Box>

                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: 1 }}>
                        TAX INVOICE
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>MOB.:</Typography>
                        <TextField
                            size="small"
                            value={invoiceData.mobile}
                            onChange={(e) => handleChange('mobile', e.target.value)}
                            onBlur={handleSaveCompanyDetails}
                            sx={{ width: 100, ...textFieldStyles }}
                            variant="outlined"
                        />
                    </Box>
                </Box>

                {/* Company Name */}
                <TextField
                    fullWidth
                    value={invoiceData.companyName}
                    onChange={(e) => handleChange('companyName', e.target.value)}
                    onBlur={handleSaveCompanyDetails}
                    sx={{
                        mb: 0.5,
                        '& .MuiInputBase-root': {
                            fontSize: '0.85rem',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        },
                        '& .MuiInputBase-input': {
                            textAlign: 'center',
                            py: 0.5
                        }
                    }}
                    variant="standard"
                    placeholder="Company Name"
                />

                {/* Address Line 1 */}
                <TextField
                    fullWidth
                    value={invoiceData.address}
                    onChange={(e) => handleChange('address', e.target.value)}
                    onBlur={handleSaveCompanyDetails}
                    sx={{
                        mb: 0.5,
                        '& .MuiInputBase-root': {
                            fontSize: '0.7rem',
                            textAlign: 'center'
                        },
                        '& .MuiInputBase-input': {
                            textAlign: 'center',
                            py: 0.3
                        }
                    }}
                    variant="standard"
                    size="small"
                    placeholder="Address"
                />

                {/* City, Pin Code, State Row */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.city}
                            onChange={(e) => handleChange('city', e.target.value)}
                            onBlur={handleSaveCompanyDetails}
                            placeholder="City"
                            sx={textFieldStyles}
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.pinCode}
                            onChange={(e) => handleChange('pinCode', e.target.value)}
                            onBlur={handleSaveCompanyDetails}
                            placeholder="Pin Code"
                            sx={textFieldStyles}
                            variant="standard"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.state}
                            onChange={(e) => handleChange('state', e.target.value)}
                            onBlur={handleSaveCompanyDetails}
                            placeholder="State"
                            sx={textFieldStyles}
                            variant="standard"
                        />
                    </Grid>
                </Grid>

                {/* Date and Invoice No */}
                <Grid container spacing={1} sx={{ mb: 1.5 }}>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={labelStyles}>Dated:</Typography>
                            <TextField
                                size="small"
                                value={invoiceData.dated}
                                onChange={(e) => handleChange('dated', e.target.value)}
                                sx={{ width: 120, ...textFieldStyles }}
                                variant="outlined"
                                type="date"
                                InputLabelProps={{ shrink: true }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography sx={labelStyles}>No.:</Typography>
                            <TextField
                                size="small"
                                value={invoiceData.invoiceNo}
                                onChange={(e) => handleChange('invoiceNo', e.target.value)}
                                sx={{ width: 100, ...textFieldStyles }}
                                variant="outlined"
                            />
                        </Box>
                    </Grid>
                </Grid>

                {/* Party Selection with Autocomplete */}
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={labelStyles}>Select Party:</Typography>
                        <Autocomplete
                            options={parties}
                            getOptionLabel={(option) => `${option.partyName} (${option.gstin})`}
                            value={selectedParty}
                            onChange={handlePartySelect}
                            loading={partiesLoading}
                            size="small"
                            fullWidth
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    placeholder="Search or select party"
                                    size="small"
                                    sx={textFieldStyles}
                                    InputProps={{
                                        ...params.InputProps,
                                        style: { fontSize: '0.7rem' }
                                    }}
                                />
                            )}
                        />
                        <IconButton
                            size="small"
                            onClick={() => setIsDialogOpen(true)}
                            sx={{
                                border: '1px solid #ccc',
                                borderRadius: 1,
                                minWidth: '30px'
                            }}
                        >
                            <AddIcon sx={{ fontSize: '16px' }} />
                        </IconButton>
                    </Box>
                </Box>

                {/* Party Name (M/s) */}
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={labelStyles}>M/s.:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.partyName}
                            onChange={(e) => handleChange('partyName', e.target.value)}
                            placeholder="Enter party name"
                            sx={textFieldStyles}
                            variant="outlined"
                        />
                    </Box>
                </Box>

                {/* Party Address */}
                <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={labelStyles}>Address:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.partyAddress}
                            onChange={(e) => handleChange('partyAddress', e.target.value)}
                            placeholder="Enter party address"
                            sx={textFieldStyles}
                            variant="outlined"
                        />
                    </Box>
                </Box>

                {/* Party City, Pin Code, State */}
                <Grid container spacing={1} sx={{ mb: 1 }}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.partyCity}
                            onChange={(e) => handleChange('partyCity', e.target.value)}
                            placeholder="City"
                            sx={textFieldStyles}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.partyPinCode}
                            onChange={(e) => handleChange('partyPinCode', e.target.value)}
                            placeholder="Pin Code"
                            sx={textFieldStyles}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.partyState}
                            onChange={(e) => handleChange('partyState', e.target.value)}
                            placeholder="State"
                            sx={textFieldStyles}
                            variant="outlined"
                        />
                    </Grid>
                </Grid>

                {/* Party GSTIN */}
                <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={labelStyles}>Party GSTIN:</Typography>
                        <TextField
                            fullWidth
                            size="small"
                            value={invoiceData.partyGstin}
                            onChange={(e) => handleChange('partyGstin', e.target.value)}
                            placeholder="Enter party GSTIN"
                            sx={textFieldStyles}
                            variant="outlined"
                        />
                    </Box>
                </Box>
            </Paper>

            {/* Add New Party Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: '1rem', py: 1.5 }}>
                    Add New Party
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Party Name"
                                size="small"
                                value={newParty.partyName}
                                onChange={(e) => setNewParty({ ...newParty, partyName: e.target.value })}
                                required
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Address"
                                size="small"
                                value={newParty.address}
                                onChange={(e) => setNewParty({ ...newParty, address: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="City"
                                size="small"
                                value={newParty.city}
                                onChange={(e) => setNewParty({ ...newParty, city: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="State"
                                size="small"
                                value={newParty.state}
                                onChange={(e) => setNewParty({ ...newParty, state: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Pin Code"
                                size="small"
                                value={newParty.pinCode}
                                onChange={(e) => setNewParty({ ...newParty, pinCode: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Mobile"
                                size="small"
                                value={newParty.mobile}
                                onChange={(e) => setNewParty({ ...newParty, mobile: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="GSTIN"
                                size="small"
                                value={newParty.gstin}
                                onChange={(e) => setNewParty({ ...newParty, gstin: e.target.value })}
                                required
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Email"
                                size="small"
                                type="email"
                                value={newParty.email}
                                onChange={(e) => setNewParty({ ...newParty, email: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddNewParty}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                    >
                        Add Party
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}