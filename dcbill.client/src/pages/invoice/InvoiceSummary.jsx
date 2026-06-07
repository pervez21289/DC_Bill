import { Paper, Box, Table, TableBody, TableRow, TableCell, TextField, IconButton, InputAdornment } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';

export default function InvoiceSummary({
    subtotal,
    totalGST,
    total,
    itemsCount,
    gstPercent = 18,
    onGSTChange,
    readOnly = false
}) {
    const [isEditingGST, setIsEditingGST] = useState(false);
    const [localGSTPercent, setLocalGSTPercent] = useState(gstPercent);
    const [isInterState, setIsInterState] = useState(false); // Will be passed from parent

    // Safe number conversion
    const safeSubtotal = Number(subtotal) || 0;
    const safeTotalGST = Number(totalGST) || 0;
    const safeTotal = Number(total) || 0;
    const safeItemsCount = Number(itemsCount) || 0;
    const safeGSTPercent = Number(localGSTPercent) || 18;

    // Calculate CGST and SGST based on transaction type
    const cgstPercent = isInterState ? 0 : safeGSTPercent / 2;
    const sgstPercent = isInterState ? 0 : safeGSTPercent / 2;
    const igstPercent = isInterState ? safeGSTPercent : 0;

    // Calculate GST amounts
    const calculatedTotalGST = (safeSubtotal * safeGSTPercent) / 100;
    const calculatedCGST = isInterState ? 0 : calculatedTotalGST / 2;
    const calculatedSGST = isInterState ? 0 : calculatedTotalGST / 2;
    const calculatedIGST = isInterState ? calculatedTotalGST : 0;
    const calculatedGrandTotal = safeSubtotal + calculatedTotalGST;

    // Use passed values or calculated values
    const displayTotalGST = totalGST || calculatedTotalGST;
    const displayCGST = isInterState ? 0 : displayTotalGST / 2;
    const displaySGST = isInterState ? 0 : displayTotalGST / 2;
    const displayIGST = isInterState ? displayTotalGST : 0;
    const displayGrandTotal = total || calculatedGrandTotal;

    // Format currency
    const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return numAmount % 1 === 0 ? numAmount.toString() : numAmount.toFixed(2);
    };

    const handleGSTSave = () => {
        const newGSTPercent = Number(localGSTPercent);
        if (newGSTPercent >= 0 && newGSTPercent <= 100) {
            onGSTChange?.(newGSTPercent);
            setIsEditingGST(false);
        } else {
            setLocalGSTPercent(safeGSTPercent);
            setIsEditingGST(false);
        }
    };

    const handleGSTCancel = () => {
        setLocalGSTPercent(safeGSTPercent);
        setIsEditingGST(false);
    };

    const handleGSTChange = (e) => {
        let value = e.target.value;
        if (value === '') {
            setLocalGSTPercent('');
        } else {
            let numValue = Number(value);
            if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
                setLocalGSTPercent(numValue);
            }
        }
    };

    return (
        <Paper
            elevation={1}
            sx={{
                width: 360,
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

                        {/* Editable GST Percent Row */}
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>GST%</TableCell>
                            <TableCell align="center" colSpan={2}>
                                {isEditingGST && !readOnly ? (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 0.5 }}>
                                        <TextField
                                            value={localGSTPercent}
                                            onChange={handleGSTChange}
                                            size="small"
                                            type="number"
                                            inputProps={{
                                                min: 0,
                                                max: 100,
                                                step: 1,
                                                style: {
                                                    fontSize: '11px',
                                                    padding: '2px 4px',
                                                    width: '60px',
                                                    textAlign: 'center'
                                                }
                                            }}
                                            sx={{ width: 70 }}
                                            autoFocus
                                        />
                                        <IconButton size="small" onClick={handleGSTSave} sx={{ p: 0.2 }}>
                                            <SaveIcon sx={{ fontSize: '14px' }} />
                                        </IconButton>
                                        <IconButton size="small" onClick={handleGSTCancel} sx={{ p: 0.2 }}>
                                            <CloseIcon sx={{ fontSize: '14px' }} />
                                        </IconButton>
                                    </Box>
                                ) : (
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
                                        <span>{safeGSTPercent}%</span>
                                        {!readOnly && (
                                            <IconButton size="small" onClick={() => setIsEditingGST(true)} sx={{ p: 0.2 }}>
                                                <EditIcon sx={{ fontSize: '12px' }} />
                                            </IconButton>
                                        )}
                                    </Box>
                                )}
                            </TableCell>
                        </TableRow>

                        {/* CGST Row */}
                        {!isInterState && cgstPercent > 0 && (
                            <TableRow>
                                <TableCell>CGST</TableCell>
                                <TableCell align="right">{cgstPercent}%</TableCell>
                                <TableCell align="right">{formatCurrency(displayCGST)}</TableCell>
                            </TableRow>
                        )}

                        {/* SGST Row */}
                        {!isInterState && sgstPercent > 0 && (
                            <TableRow>
                                <TableCell>SGST</TableCell>
                                <TableCell align="right">{sgstPercent}%</TableCell>
                                <TableCell align="right">{formatCurrency(displaySGST)}</TableCell>
                            </TableRow>
                        )}

                        {/* IGST Row */}
                        {isInterState && igstPercent > 0 && (
                            <TableRow>
                                <TableCell>IGST</TableCell>
                                <TableCell align="right">{igstPercent}%</TableCell>
                                <TableCell align="right">{formatCurrency(displayIGST)}</TableCell>
                            </TableRow>
                        )}

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
                                {formatCurrency(displayGrandTotal)}
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