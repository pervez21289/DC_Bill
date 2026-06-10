// components/InvoiceSummary.jsx
import { Paper, Box, Table, TableBody, TableRow, TableCell, TextField, IconButton } from '@mui/material';
import { Edit as EditIcon, Save as SaveIcon, Close as CloseIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useInvoiceSummary } from './useInvoiceSummary';

export default function InvoiceSummary({
    items = [],  // Pass items array directly
    gstPercent: externalGstPercent = 18,
    onGSTChange,
    readOnly = false
}) {
    const [isEditingGST, setIsEditingGST] = useState(false);
    const [localGSTPercent, setLocalGSTPercent] = useState(externalGstPercent);

    // Use the custom hook to calculate all values from items
    const {
        subtotal,
        totalGST,
        cgstAmount,
        sgstAmount,
        grandTotal,
        itemsCount,
        cgstPercent,
        sgstPercent,
        formattedSubtotal,
        formattedCgstAmount,
        formattedSgstAmount,
        formattedGrandTotal,
    } = useInvoiceSummary(items, localGSTPercent);

    const handleGSTSave = () => {
        const newGSTPercent = Number(localGSTPercent);
        if (newGSTPercent >= 0 && newGSTPercent <= 100) {
            onGSTChange?.(newGSTPercent);
            setIsEditingGST(false);
        } else {
            setLocalGSTPercent(externalGstPercent);
            setIsEditingGST(false);
        }
    };

    const handleGSTCancel = () => {
        setLocalGSTPercent(externalGstPercent);
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
                            <TableCell align="right">{itemsCount}</TableCell>
                            <TableCell align="right">{formattedSubtotal}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Discount</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">-</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold' }}>Total</TableCell>
                            <TableCell align="right"></TableCell>
                            <TableCell align="right">{formattedSubtotal}</TableCell>
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
                                        <span>{localGSTPercent}%</span>
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
                        <TableRow>
                            <TableCell>CGST</TableCell>
                            <TableCell align="right">{cgstPercent}%</TableCell>
                            <TableCell align="right">{formattedCgstAmount}</TableCell>
                        </TableRow>

                        {/* SGST Row */}
                        <TableRow>
                            <TableCell>SGST</TableCell>
                            <TableCell align="right">{sgstPercent}%</TableCell>
                            <TableCell align="right">{formattedSgstAmount}</TableCell>
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
                                {formattedGrandTotal}
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