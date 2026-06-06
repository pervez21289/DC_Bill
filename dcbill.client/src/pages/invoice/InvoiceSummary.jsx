import { Paper, Box, Table, TableBody, TableRow, TableCell } from '@mui/material';

export default function InvoiceSummary({ subtotal, totalGST, total, itemsCount, gstAmount = 18 }) {
    // Safe number conversion
    const safeSubtotal = Number(subtotal) || 0;
    const safeTotalGST = Number(totalGST) || 0;
    const safeTotal = Number(total) || 0;
    const safeItemsCount = Number(itemsCount) || 0;

    // Calculate CGST and SGST
    const cgst = safeTotalGST / 2;
    const sgst = safeTotalGST / 2;

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return numAmount % 1 === 0 ? numAmount.toString() : numAmount.toFixed(2);
    };

    return (
        <Paper
            elevation={1}
            sx={{
                width: 320,
                fontFamily: 'monospace',
                fontSize: '11px',
                borderRadius: 0.5
            }}
        >
            <Box sx={{ p: 0.5 }}>
                <Table size="small" sx={{ '& .MuiTableCell-root': { p: 0.3, border: 'none', fontSize: '11px' } }}>
                    <TableBody>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right">{safeItemsCount}</TableCell>
                            <TableCell align="right">{formatCurrency(safeSubtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Discount</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">-</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{formatCurrency(safeSubtotal)}</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={3}><hr style={{ margin: '2px 0' }} /></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>CGST</TableCell>
                            <TableCell align="right">{gstAmount / 2}%</TableCell>
                            <TableCell align="right">{formatCurrency(cgst)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>SGST</TableCell>
                            <TableCell align="right">{gstAmount / 2}%</TableCell>
                            <TableCell align="right">{formatCurrency(sgst)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>IGST</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">-</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell colSpan={3}><hr style={{ margin: '2px 0' }} /></TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell>Advance</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">-</TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', fontSize: '12px' }}>GRAND TOTAL</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '12px' }}>
                                {formatCurrency(safeTotal)}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Box sx={{
                    textAlign: 'center',
                    mt: 0.5,
                    pt: 0.3,
                    borderTop: '1px solid #999',
                    fontSize: '10px',
                    fontWeight: 'bold'
                }}>
                    DHANRAJ CITY DEVELOPERS
                </Box>
            </Box>
        </Paper>
    );
}