import { Box, Typography, Paper } from '@mui/material';

export default function InvoiceHeader() {
    return (
        <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h5" gutterBottom>
                Invoice Generator
            </Typography>
            <Typography variant="body2" color="textSecondary">
                Create and manage your invoice items
            </Typography>
        </Paper>
    );
}