import React from 'react';
import {
    Box,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    IconButton,
    Tooltip,
    Chip,
    Collapse,
    Typography,
    Divider,
    useTheme,
    Stack,
    Avatar,
} from '@mui/material';
import {
    KeyboardArrowDown,
    KeyboardArrowUp,
    ExpandMore,
    ExpandLess,
    Visibility,
    Download,
    Print,
    ReceiptLong,
    Person,
    CalendarToday,
    AttachMoney,
} from '@mui/icons-material';
import { formatCurrency, getPaymentStatusChip, getInvoiceTypeChip } from '../../hooks/useGSTReport';

const GSTReportInvoiceTable = ({
    invoices,
    sortConfig,
    handleSort,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    expandedRows,
    handleRowToggle,
    loading,
}) => {
    const theme = useTheme();

    const columns = [
        { field: 'invoiceNumber', headerName: 'Invoice No.', width: 150 },
        { field: 'invoiceDate', headerName: 'Date', width: 120 },
        { field: 'partyName', headerName: 'Party Name', width: 200 },
        { field: 'partyGstin', headerName: 'Party GSTIN', width: 180 },
        { field: 'invoiceType', headerName: 'Type', width: 100 },
        { field: 'taxableAmount', headerName: 'Taxable Value', width: 140, type: 'currency' },
        { field: 'cgstAmount', headerName: 'CGST', width: 100, type: 'currency' },
        { field: 'sgstAmount', headerName: 'SGST', width: 100, type: 'currency' },
        { field: 'igstAmount', headerName: 'IGST', width: 100, type: 'currency' },
        { field: 'totalGST', headerName: 'Total Tax', width: 120, type: 'currency' },
        { field: 'totalAmount', headerName: 'Invoice Value', width: 140, type: 'currency' },
        { field: 'paymentStatus', headerName: 'Payment', width: 120 },
    ];

    const renderCell = (row, column) => {
        const value = row[column.field];

        switch (column.field) {
            case 'invoiceDate':
                return value ? new Date(value).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric'
                }) : '-';
            case 'taxableAmount':
            case 'cgstAmount':
            case 'sgstAmount':
            case 'igstAmount':
            case 'totalGST':
            case 'totalAmount':
                return formatCurrency(value);
            case 'invoiceType':
                const typeChip = getInvoiceTypeChip(value);
                return (
                    <Chip
                        label={typeChip.label}
                        size="small"
                        color={typeChip.color}
                        variant="outlined"
                        sx={{ borderRadius: 1, height: 24, fontSize: '0.7rem' }}
                    />
                );
            case 'paymentStatus':
                const statusChip = getPaymentStatusChip(value);
                return (
                    <Chip
                        label={statusChip.label}
                        size="small"
                        color={statusChip.color}
                        variant="filled"
                        sx={{ borderRadius: 1, fontWeight: 500, height: 24, fontSize: '0.7rem' }}
                    />
                );
            case 'partyGstin':
                return value || '-';
            default:
                return value || '-';
        }
    };

    const renderExpandedRow = (row, index) => (
        <TableRow>
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={columns.length + 2}>
                <Collapse in={expandedRows.has(index)} timeout="auto" unmountOnExit>
                    <Box sx={{ p: 2, bgcolor: theme.palette.grey[50], borderRadius: 1, m: 1 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <ReceiptLong fontSize="small" />
                                    Invoice Details
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Invoice Number</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.invoiceNumber}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Date</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                    {row.invoiceDate ? new Date(row.invoiceDate).toLocaleDateString('en-IN', {
                                        day: '2-digit',
                                        month: 'short',
                                        year: 'numeric'
                                    }) : '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Party</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.partyName}</Typography>
                            </Grid>

                            <Grid item xs={12} sm={6} md={3}>
                                <Typography variant="caption" color="text.secondary">Party GSTIN</Typography>
                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 500 }}>
                                    {row.partyGstin || '-'}
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 1 }} />
                                <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <AttachMoney fontSize="small" />
                                    Amount Breakdown
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="caption" color="text.secondary">Taxable Value</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 600 }}>{formatCurrency(row.taxableAmount)}</Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="caption" color="text.secondary">CGST</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.info.main }}>
                                    {formatCurrency(row.cgstAmount)}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="caption" color="text.secondary">SGST</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.success.main }}>
                                    {formatCurrency(row.sgstAmount)}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="caption" color="text.secondary">IGST</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.warning.main }}>
                                    {formatCurrency(row.igstAmount)}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="caption" color="text.secondary">Total Tax</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                                    {formatCurrency(row.totalGST)}
                                </Typography>
                            </Grid>

                            <Grid item xs={6} sm={3} md={2}>
                                <Typography variant="caption" color="text.secondary">Invoice Value</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700, color: theme.palette.secondary.main }}>
                                    {formatCurrency(row.totalAmount)}
                                </Typography>
                            </Grid>

                            {row.eInvoiceStatus && (
                                <Grid item xs={12}>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                                        E-Invoice Details
                                    </Typography>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={4}>
                                            <Typography variant="caption" color="text.secondary">Status</Typography>
                                            <Chip
                                                label={row.eInvoiceStatus}
                                                size="small"
                                                color="success"
                                                variant="outlined"
                                                sx={{ height: 24, fontSize: '0.7rem' }}
                                            />
                                        </Grid>
                                        {row.irn && (
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" color="text.secondary">IRN</Typography>
                                                <Typography variant="body2" sx={{ fontFamily: 'monospace', fontSize: '0.75rem' }}>
                                                    {row.irn}
                                                </Typography>
                                            </Grid>
                                        )}
                                        {row.ackNo && (
                                            <Grid item xs={12} sm={4}>
                                                <Typography variant="caption" color="text.secondary">Ack No.</Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 500 }}>{row.ackNo}</Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                </Collapse>
            </TableCell>
        </TableRow>
    );

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Typography>Loading invoices...</Typography>
            </Box>
        );
    }

    if (!invoices.length) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <ReceiptLong sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary">No invoices found for the selected period</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 1 }}>
            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                            <TableCell style={{ width: 40, padding: '6px 4px' }} />
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    sx={{
                                        fontWeight: 600,
                                        whiteSpace: 'nowrap',
                                        cursor: 'pointer',
                                        userSelect: 'none',
                                        borderBottom: `2px solid ${theme.palette.divider}`,
                                        padding: '8px 12px',
                                        fontSize: '0.75rem',
                                    }}
                                    onClick={() => handleSort(column.field)}
                                >
                                    <TableSortLabel
                                        active={sortConfig.key === column.field}
                                        direction={sortConfig.key === column.field ? sortConfig.direction : 'asc'}
                                    >
                                        {column.headerName}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                            <TableCell style={{ width: 120, textAlign: 'center', padding: '6px 4px' }}>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {invoices.map((row, index) => (
                            <React.Fragment key={row.invoiceId || index}>
                                <TableRow
                                    hover
                                    onClick={() => handleRowToggle(index)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': {
                                            bgcolor: theme.palette.action.hover,
                                        },
                                        transition: 'all 0.2s',
                                    }}
                                >
                                    <TableCell sx={{ padding: '4px 4px' }}>
                                        <IconButton
                                            size="small"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleRowToggle(index);
                                            }}
                                            aria-expanded={expandedRows.has(index)}
                                            aria-label="Show details"
                                            sx={{
                                                transition: 'transform 0.2s',
                                                transform: expandedRows.has(index) ? 'rotate(180deg)' : 'rotate(0deg)',
                                                padding: '2px',
                                            }}
                                        >
                                            <ExpandMore fontSize="small" />
                                        </IconButton>
                                    </TableCell>
                                    {columns.map((column) => (
                                        <TableCell key={column.field} sx={{
                                            whiteSpace: 'nowrap',
                                            padding: '6px 12px',
                                            fontSize: '0.8rem',
                                        }}>
                                            {renderCell(row, column)}
                                        </TableCell>
                                    ))}
                                    <TableCell sx={{
                                        textAlign: 'center',
                                        padding: '4px 4px',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        <Tooltip title="View Details">
                                            <IconButton size="small" onClick={(e) => e.stopPropagation()} sx={{ padding: '2px' }}>
                                                <Visibility fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Download PDF">
                                            <IconButton size="small" onClick={(e) => e.stopPropagation()} sx={{ padding: '2px' }}>
                                                <Download fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Print">
                                            <IconButton size="small" onClick={(e) => e.stopPropagation()} sx={{ padding: '2px' }}>
                                                <Print fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                                {renderExpandedRow(row, index)}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={invoices.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                sx={{
                    borderTop: `1px solid ${theme.palette.divider}`,
                    bgcolor: theme.palette.grey[50],
                    '& .MuiTablePagination-toolbar': {
                        minHeight: '48px',
                    },
                }}
            />
        </Paper>
    );
};

export default GSTReportInvoiceTable;