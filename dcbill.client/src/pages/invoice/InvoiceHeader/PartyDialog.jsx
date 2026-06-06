import { Dialog, DialogTitle, DialogContent, DialogActions, Grid, TextField, Button } from '@mui/material';

export default function PartyDialog({ open, onClose, isEditing, partyData, setPartyData, onSave }) {
    const handleChange = (field, value) => {
        setPartyData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 1, minWidth: 400 } }}>
            <DialogTitle sx={{ fontSize: '1rem', py: 1.5 }}>
                {isEditing ? 'Edit Party' : 'Add New Party'}
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2} sx={{ mt: 0.5 }}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="Party Name" size="small"
                            value={partyData?.partyName || ''}
                            onChange={(e) => handleChange('partyName', e.target.value)}
                            required sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="Address" size="small"
                            value={partyData?.address || ''}
                            onChange={(e) => handleChange('address', e.target.value)}
                            sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth label="City" size="small"
                            value={partyData?.city || ''}
                            onChange={(e) => handleChange('city', e.target.value)}
                            sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth label="State" size="small"
                            value={partyData?.state || ''}
                            onChange={(e) => handleChange('state', e.target.value)}
                            sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth label="Pin Code" size="small"
                            value={partyData?.pinCode || ''}
                            onChange={(e) => handleChange('pinCode', e.target.value)}
                            sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <TextField
                            fullWidth label="Mobile" size="small"
                            value={partyData?.mobile || ''}
                            onChange={(e) => handleChange('mobile', e.target.value)}
                            sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="GSTIN" size="small"
                            value={partyData?.gstin || ''}
                            onChange={(e) => handleChange('gstin', e.target.value)}
                            required sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth label="Email" size="small" type="email"
                            value={partyData?.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            sx={{ '& .MuiInputLabel-root': { fontSize: '0.75rem' }, '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} size="small" sx={{ fontSize: '0.7rem' }}>Cancel</Button>
                <Button onClick={onSave} variant="contained" color="primary" size="small" sx={{ fontSize: '0.7rem' }}>
                    {isEditing ? 'Update Party' : 'Add Party'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}