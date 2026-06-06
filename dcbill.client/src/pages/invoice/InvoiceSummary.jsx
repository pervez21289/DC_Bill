import { Paper, Typography, Grid, Divider, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';

export default function InvoiceSummary({ subtotal, totalGST, total, itemsCount, gstAmount = 18 }) {
    // Safe number conversion
    const safeSubtotal = Number(subtotal) || 0;
    const safeTotalGST = Number(totalGST) || 0;
    const safeTotal = Number(total) || 0;
    const safeItemsCount = Number(itemsCount) || 0;

    // Calculate CGST and SGST (half of total GST each)
    const cgst = safeTotalGST / 2;
    const sgst = safeTotalGST / 2;

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return new Intl.NumberFormat('en-IN', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(numAmount);
    };

    return (
        <Paper
            sx={{
                maxWidth: 500,
                width: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                boxShadow: 3
            }}
        >
            {/* Header */}
            <Box sx={{ bgcolor: '#f5f5f5', p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Typography variant="h6" fontWeight="bold" align="center">
                    Invoice Summary
                </Typography>
            </Box>

            {/* Calculation Table */}
            <Box sx={{ p: 2 }}>
                <Table size="small">
                    <TableBody>
                        {/* Total Row */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1, fontWeight: 'bold' }}>
                                Total
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                {safeItemsCount}
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹{formatCurrency(safeSubtotal)}
                            </TableCell>
                        </TableRow>

                        {/* Discount Row (optional) */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1 }}>
                                Discount
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                -
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹0.00
                            </TableCell>
                        </TableRow>

                        {/* Total after discount */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1, fontWeight: 'bold' }}>
                                Total
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                {safeItemsCount}
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹{formatCurrency(safeSubtotal)}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={3} sx={{ p: 0 }}>
                                <Divider sx={{ my: 1 }} />
                            </TableCell>
                        </TableRow>

                        {/* CGST Row */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1 }}>
                                CGST
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                {gstAmount / 2}%
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹{formatCurrency(cgst)}
                            </TableCell>
                        </TableRow>

                        {/* SGST Row */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1 }}>
                                SGST
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                {gstAmount / 2}%
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹{formatCurrency(sgst)}
                            </TableCell>
                        </TableRow>

                        {/* IGST Row (if applicable) */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1 }}>
                                IGST
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                -
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹0.00
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={3} sx={{ p: 0 }}>
                                <Divider sx={{ my: 1 }} />
                            </TableCell>
                        </TableRow>

                        {/* Advance Row */}
                        <TableRow>
                            <TableCell sx={{ border: 'none', py: 1 }}>
                                Advance
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                -
                            </TableCell>
                            <TableCell sx={{ border: 'none', py: 1 }} align="right">
                                ₹0.00
                            </TableCell>
                        </TableRow>

                        {/* GRAND TOTAL Row */}
                        <TableRow>
                            <TableCell
                                sx={{
                                    border: 'none',
                                    py: 2,
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem'
                                }}
                            >
                                GRAND TOTAL
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 'none',
                                    py: 2
                                }}
                                align="right"
                            >
                                -
                            </TableCell>
                            <TableCell
                                sx={{
                                    border: 'none',
                                    py: 2,
                                    fontWeight: 'bold',
                                    fontSize: '1.1rem',
                                    color: '#2e7d32'
                                }}
                                align="right"
                            >
                                ₹{formatCurrency(safeTotal)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                {/* Footer / Company Name */}
                <Box sx={{
                    mt: 3,
                    pt: 2,
                    borderTop: '1px solid #e0e0e0',
                    textAlign: 'center'
                }}>
                    <Typography
                        variant="subtitle2"
                        sx={{
                            fontWeight: 'bold',
                            letterSpacing: 1
                        }}
                    >
                        DHANRAJ CITY DEVELOPERS
                    </Typography>
                </Box>
            </Box>
        </Paper>
    );
}