import { Box, Typography } from '@mui/material';

const labelStyles = { fontSize: '0.7rem', fontWeight: 'bold', minWidth: '70px' };
const textStyles = { fontSize: '0.7rem', color: '#333', lineHeight: '1.4', py: 0.2 };
const rightLabelStyles = { fontSize: '0.7rem', fontWeight: 'bold' };

export default function PartyDetails({ invoiceData }) {
    // Safety check for invoiceData
    if (!invoiceData) {
        return null;
    }

    return (
        <>
            {/* M/s on left, Party GSTIN on extreme right */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={labelStyles}>M/s.:</Typography>
                    <Typography sx={textStyles}>{invoiceData.partyName || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={rightLabelStyles}>Party GSTIN:</Typography>
                    <Typography sx={textStyles}>{invoiceData.partyGstin || '—'}</Typography>
                </Box>
            </Box>

            {/* Address on left, City/Pin/State on extreme right */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', mb: 0.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={labelStyles}>Address:</Typography>
                    <Typography sx={textStyles}>{invoiceData.partyAddress || '—'}</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography sx={rightLabelStyles}>City/Pin/State:</Typography>
                    <Typography sx={textStyles}>
                        {invoiceData.partyCity || '—'} {invoiceData.partyCity && invoiceData.partyPinCode && '-'}
                        {invoiceData.partyPinCode || '—'} {invoiceData.partyPinCode && invoiceData.partyState && '-'}
                        {invoiceData.partyState || '—'}
                    </Typography>
                </Box>
            </Box>
        </>
    );
}