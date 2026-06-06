import { Box, TextField, Typography, Collapse, Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';

const textFieldStyles = {
    '& .MuiInputBase-root': { fontSize: '0.7rem', minHeight: '28px' },
    '& .MuiInputBase-input': { py: 0.3, px: 0.5 }
};

const readonlyFieldStyles = {
    '& .MuiInputBase-root': { fontSize: '0.7rem', minHeight: '28px', backgroundColor: '#fafafa' },
    '& .MuiInputBase-input': { py: 0.3, px: 0.5, color: '#666' }
};

export default function CompanyDetails({
    isExpanded, isEditMode, invoiceData, editedData,
    handleEditChange, handleSaveCompanyDetails, handleCancelEdit,
    onDateChange  // Add this prop
}) {
    return (
        <Collapse in={isExpanded}>
            <Box sx={{ p: 1.5 }}>
                {/* Top Row - GSTIN, TAX INVOICE, MOB */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>GSTIN :</Typography>
                        {isEditMode ? (
                            <TextField
                                size="small"
                                value={editedData.gstin || ''}
                                onChange={(e) => handleEditChange('gstin', e.target.value)}
                                sx={{ width: 150, ...textFieldStyles }}
                                variant="outlined"
                            />
                        ) : (
                            <TextField
                                size="small"
                                value={invoiceData.gstin}
                                disabled
                                sx={{ width: 150, ...readonlyFieldStyles }}
                                variant="outlined"
                            />
                        )}
                    </Box>

                    <Typography sx={{ fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: 1 }}>
                        TAX INVOICE
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold' }}>MOB.:</Typography>
                        {isEditMode ? (
                            <TextField
                                size="small"
                                value={editedData.mobile || ''}
                                onChange={(e) => handleEditChange('mobile', e.target.value)}
                                sx={{ width: 100, ...textFieldStyles }}
                                variant="outlined"
                            />
                        ) : (
                            <TextField
                                size="small"
                                value={invoiceData.mobile}
                                disabled
                                sx={{ width: 100, ...readonlyFieldStyles }}
                                variant="outlined"
                            />
                        )}
                    </Box>
                </Box>

                {/* Centered Company Details */}
                <Box sx={{ textAlign: 'center', mb: 1 }}>
                    {isEditMode ? (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mb: 0.5 }}>
                                <TextField
                                    value={editedData.companyName || ''}
                                    onChange={(e) => handleEditChange('companyName', e.target.value)}
                                    placeholder="Company Name"
                                    sx={{ width: '60%', '& .MuiInputBase-root': { fontSize: '0.8rem', fontWeight: 'bold', textAlign: 'center' } }}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                                <TextField
                                    value={editedData.address || ''}
                                    onChange={(e) => handleEditChange('address', e.target.value)}
                                    placeholder="Address"
                                    sx={{ width: '70%', '& .MuiInputBase-root': { fontSize: '0.7rem', textAlign: 'center' } }}
                                    size="small"
                                />
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, mt: 0.5 }}>
                                <TextField value={editedData.city || ''} onChange={(e) => handleEditChange('city', e.target.value)} placeholder="City" size="small" sx={{ width: '25%', ...textFieldStyles }} />
                                <TextField value={editedData.pinCode || ''} onChange={(e) => handleEditChange('pinCode', e.target.value)} placeholder="Pin Code" size="small" sx={{ width: '15%', ...textFieldStyles }} />
                                <TextField value={editedData.state || ''} onChange={(e) => handleEditChange('state', e.target.value)} placeholder="State" size="small" sx={{ width: '25%', ...textFieldStyles }} />
                            </Box>
                        </>
                    ) : (
                        <>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 'bold', mb: 0.5 }}>{invoiceData.companyName}</Typography>
                            <Typography sx={{ fontSize: '0.7rem', mb: 0.3 }}>{invoiceData.address}</Typography>
                            <Typography sx={{ fontSize: '0.7rem', color: '#666' }}>
                                {invoiceData.city} {invoiceData.city && invoiceData.pinCode && '-'} {invoiceData.pinCode} {invoiceData.pinCode && invoiceData.state && '-'} {invoiceData.state}
                            </Typography>
                        </>
                    )}
                </Box>

                {/* Date on Right, No. on Left */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', minWidth: '70px' }}>No.:</Typography>
                        <TextField
                            size="small"
                            value={invoiceData.invoiceNo}
                            disabled
                            sx={{ width: 100, ...readonlyFieldStyles }}
                            variant="outlined"
                        />
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography sx={{ fontSize: '0.7rem', fontWeight: 'bold', minWidth: '70px' }}>Dated:</Typography>
                        <TextField
                            size="small"
                            value={invoiceData.dated}
                            onChange={(e) => onDateChange(e.target.value)}  // Use onDateChange prop
                            sx={{ width: 120, ...textFieldStyles }}
                            variant="outlined"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                        />
                    </Box>
                </Box>

                {/* Edit Mode Buttons */}
                {isEditMode && (
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mb: 1.5 }}>
                        <Button size="small" variant="outlined" onClick={handleCancelEdit} startIcon={<CancelIcon sx={{ fontSize: '14px' }} />} sx={{ fontSize: '0.7rem' }}>
                            Cancel
                        </Button>
                        <Button size="small" variant="contained" onClick={handleSaveCompanyDetails} startIcon={<SaveIcon sx={{ fontSize: '14px' }} />} sx={{ fontSize: '0.7rem' }}>
                            Save Changes
                        </Button>
                    </Box>
                )}
            </Box>
        </Collapse>
    );
}