// components/InvoiceGrid/InvoiceGridHeader.jsx
import { Box, Typography, Button } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';

export default function InvoiceGridHeader({ onAddNew }) {
    return (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mb: 2 }}>
            <Button
                variant="contained"
                startIcon={<AddIcon sx={{ fontSize: '0.9rem' }} />}
                onClick={onAddNew}
                size="small"
                sx={{
                    fontSize: '0.7rem',
                    height: '32px',
                    textTransform: 'none',
                    whiteSpace: 'nowrap'
                }}
            >
                Add New Invoice
            </Button>
        </Box>
    );
}