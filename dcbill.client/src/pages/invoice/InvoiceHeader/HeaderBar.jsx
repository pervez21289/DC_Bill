import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import EditIcon from '@mui/icons-material/Edit';

export default function HeaderBar({ isExpanded, setIsExpanded, isEditMode, setIsEditMode, invoiceData, setEditedData }) {
    const handleEditClick = (e) => {
        e.stopPropagation();
        setIsEditMode(true);
        setEditedData({
            gstin: invoiceData.gstin,
            mobile: invoiceData.mobile,
            companyName: invoiceData.companyName,
            address: invoiceData.address,
            city: invoiceData.city,
            pinCode: invoiceData.pinCode,
            state: invoiceData.state,
            country: invoiceData.country
        });
    };

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                bgcolor: '#f5f5f5',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#ebebeb' }
            }}
            onClick={() => setIsExpanded(!isExpanded)}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                    INVOICE HEADER
                </Typography>
                {isExpanded ? (
                    <ExpandLessIcon sx={{ fontSize: '18px' }} />
                ) : (
                    <ExpandMoreIcon sx={{ fontSize: '18px' }} />
                )}
            </Box>

            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                {!isEditMode && (
                    <Tooltip title="Edit Company Details">
                        <IconButton
                            size="small"
                            onClick={handleEditClick}
                            sx={{ padding: 0.5 }}
                        >
                            <EditIcon sx={{ fontSize: '14px' }} />
                        </IconButton>
                    </Tooltip>
                )}
                {!isExpanded && (
                    <Typography sx={{ fontSize: '0.7rem', color: 'text.secondary' }}>
                        {invoiceData.companyName || 'Click to expand'}
                    </Typography>
                )}
            </Box>
        </Box>
    );
}