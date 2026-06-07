import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button, CircularProgress, Snackbar, Alert } from '@mui/material';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addPartyToMaster, updatePartyInMaster, fetchParties } from './../../../store/partySlice';

export default function PartyDialog({ open, onClose, isEditing, partyData, setPartyData, onSave }) {
    const [saving, setSaving] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const dispatch = useDispatch();

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const showMessage = (message, severity = 'success') => {
        setSnackbar({ open: true, message, severity });
    };

    const handleChange = (field, value) => {
        setPartyData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        if (isEditing) {
            // Update existing party
            if (!partyData.partyName || !partyData.gstin) {
                showMessage('Please fill Party Name and GSTIN', 'warning');
                return;
            }

            setSaving(true);
            try {
                const result = await dispatch(updatePartyInMaster({
                    id: partyData.id,
                    partyData: partyData
                })).unwrap();

                if (result && result.success) {
                    await dispatch(fetchParties());
                    showMessage('Party updated successfully!', 'success');
                    setTimeout(() => {
                        onSave(); // Call parent to refresh
                        onClose(); // Close dialog
                    }, 1000);
                } else {
                    showMessage(result?.message || 'Failed to update party', 'error');
                }
            } catch (error) {
                console.error('Error updating party:', error);
                showMessage('Error updating party: ' + (error?.message || 'Please try again'), 'error');
            } finally {
                setSaving(false);
            }
        } else {
            // Add new party
            if (!partyData.partyName || !partyData.gstin) {
                showMessage('Please fill Party Name and GSTIN', 'warning');
                return;
            }

            setSaving(true);
            try {
                const partyDataToSave = {
                    partyName: partyData.partyName,
                    address: partyData.address || '',
                    city: partyData.city || '',
                    state: partyData.state || '',
                    pinCode: partyData.pinCode || '',
                    gstin: partyData.gstin,
                    mobile: partyData.mobile || '',
                    email: partyData.email || ''
                };

                const result = await dispatch(addPartyToMaster(partyDataToSave)).unwrap();

                if (result && result.success) {
                    await dispatch(fetchParties());
                    showMessage('Party added successfully!', 'success');
                    setTimeout(() => {
                        onSave(); // Call parent to refresh
                        onClose(); // Close dialog
                    }, 1000);
                } else {
                    showMessage(result?.message || 'Failed to add party', 'error');
                }
            } catch (error) {
                console.error('Error adding party:', error);
                showMessage('Error adding party: ' + (error?.message || 'Please try again'), 'error');
            } finally {
                setSaving(false);
            }
        }
    };

    return (
        <>
            <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1, minWidth: 400 } }}>
                <DialogTitle sx={{ fontSize: '1rem', py: 1.5 }}>
                    {isEditing ? 'Edit Party' : 'Add New Party'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Party Name"
                                size="small"
                                value={partyData?.partyName || ''}
                                onChange={(e) => handleChange('partyName', e.target.value)}
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
                                value={partyData?.address || ''}
                                onChange={(e) => handleChange('address', e.target.value)}
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
                                value={partyData?.city || ''}
                                onChange={(e) => handleChange('city', e.target.value)}
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
                                value={partyData?.state || ''}
                                onChange={(e) => handleChange('state', e.target.value)}
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
                                value={partyData?.pinCode || ''}
                                onChange={(e) => handleChange('pinCode', e.target.value)}
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
                                value={partyData?.mobile || ''}
                                onChange={(e) => handleChange('mobile', e.target.value)}
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
                                value={partyData?.gstin || ''}
                                onChange={(e) => handleChange('gstin', e.target.value)}
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
                                value={partyData?.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
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
                        onClick={onClose}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={20} /> : (isEditing ? 'Update Party' : 'Add Party')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}