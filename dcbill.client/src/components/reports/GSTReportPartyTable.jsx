import React from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TableSortLabel,
    Paper,
    Chip,
    Typography,
    useTheme,
    Stack,
    Avatar,
} from '@mui/material';
import { People, Person, BusinessCenter } from '@mui/icons-material';
import { formatCurrency } from '../../hooks/useGSTReport';

const GSTReportPartyTable = ({
    partyWiseSummary,
    sortConfig,
    handleSort,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    loading,
}) => {
    const theme = useTheme();

    const columns = [
        { field: 'partyName', headerName: 'Party Name', width: 250 },
        { field: 'partyGstin', headerName: 'GSTIN', width: 180 },
        { field: 'partyState', headerName: 'State', width: 120 },
        { field: 'taxableAmount', headerName: 'Taxable Value', width: 150, type: 'currency' },
        { field: 'cgstAmount', headerName: 'CGST', width: 120, type: 'currency' },
        { field: 'sgstAmount', headerName: 'SGST', width: 120, type: 'currency' },
        { field: 'igstAmount', headerName: 'IGST', width: 120, type: 'currency' },
        { field: 'totalGST', headerName: 'Total Tax', width: 140, type: 'currency' },
        { field: 'totalAmount', headerName: 'Invoice Value', width: 140, type: 'currency' },
        { field: 'invoiceCount', headerName: 'Invoices', width: 100 },
    ];

    const sortedData = [...(partyWiseSummary || [])].sort((a, b) => {
        const aVal = a[sortConfig.key];
        const bVal = b[sortConfig.key];
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
    });

    const paginatedData = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    const totals = partyWiseSummary?.reduce((acc, item) => ({
        taxableAmount: acc.taxableAmount + (item.taxableAmount || 0),
        cgstAmount: acc.cgstAmount + (item.cgstAmount || 0),
        sgstAmount: acc.sgstAmount + (item.sgstAmount || 0),
        igstAmount: acc.igstAmount + (item.igstAmount || 0),
        totalGST: acc.totalGST + (item.totalGST || 0),
        totalAmount: acc.totalAmount + (item.totalAmount || 0),
        invoiceCount: acc.invoiceCount + (item.invoiceCount || 0),
    }), {
        taxableAmount: 0,
        cgstAmount: 0,
        sgstAmount: 0,
        igstAmount: 0,
        totalGST: 0,
        totalAmount: 0,
        invoiceCount: 0,
    });

    // Get initials for avatar
    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ');
        return parts.slice(0, 2).map(part => part[0]).join('').toUpperCase();
    };

    // Get color for avatar
    const getAvatarColor = (name) => {
        const colors = [
            theme.palette.primary.main,
            theme.palette.secondary.main,
            theme.palette.success.main,
            theme.palette.warning.main,
            theme.palette.info.main,
            theme.palette.error.main,
        ];
        const index = name?.length ? name.length % colors.length : 0;
        return colors[index];
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <Typography>Loading party summary...</Typography>
            </Box>
        );
    }

    if (!partyWiseSummary?.length) {
        return (
            <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
                <People sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                <Typography color="text.secondary">No party data found for the selected period</Typography>
            </Paper>
        );
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2, boxShadow: 1 }}>
            {/* Header */}
            <Box sx={{ p: 1.5, bgcolor: theme.palette.grey[50], borderBottom: `1px solid ${theme.palette.divider}` }}>
                <Stack direction="row" alignItems="center" spacing={1}>
                    <People sx={{ color: theme.palette.primary.main, fontSize: 20 }} />
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Party-wise Summary
                    </Typography>
                    <Chip
                        label={`${partyWiseSummary.length} Parties`}
                        size="small"
                        color="primary"
                        variant="outlined"
                        sx={{ ml: 1, height: 24, fontSize: '0.7rem' }}
                    />
                </Stack>
            </Box>

            <TableContainer sx={{ maxHeight: 600 }}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow
                                key={row.partyId || index}
                                hover
                                sx={{
                                    '&:nth-of-type(odd)': {
                                        bgcolor: theme.palette.action.hover,
                                    },
                                    transition: 'all 0.2s',
                                }}
                            >
                                <TableCell sx={{ padding: '4px 12px' }}>
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <Avatar
                                            sx={{
                                                width: 24,
                                                height: 24,
                                                bgcolor: getAvatarColor(row.partyName),
                                                fontSize: '0.6rem',
                                                fontWeight: 600,
                                            }}
                                        >
                                            {getInitials(row.partyName)}
                                        </Avatar>
                                        <Typography sx={{ fontWeight: 500, fontSize: '0.8rem' }}>
                                            {row.partyName}
                                        </Typography>
                                    </Stack>
                                </TableCell>
                                <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.75rem', padding: '6px 12px' }}>
                                    {row.partyGstin || '-'}
                                </TableCell>
                                <TableCell sx={{ padding: '6px 12px' }}>
                                    <Chip
                                        label={row.partyState || '-'}
                                        size="small"
                                        variant="outlined"
                                        sx={{ borderRadius: 1, height: 24, fontSize: '0.7rem' }}
                                    />
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 500, padding: '6px 12px', fontSize: '0.8rem' }}>
                                    {formatCurrency(row.taxableAmount)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', color: theme.palette.info.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                    {formatCurrency(row.cgstAmount)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', color: theme.palette.success.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                    {formatCurrency(row.sgstAmount)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', color: theme.palette.warning.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                    {formatCurrency(row.igstAmount)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 700, color: theme.palette.primary.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                    {formatCurrency(row.totalGST)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'right', fontWeight: 500, padding: '6px 12px', fontSize: '0.8rem' }}>
                                    {formatCurrency(row.totalAmount)}
                                </TableCell>
                                <TableCell sx={{ textAlign: 'center', padding: '6px 12px' }}>
                                    <Chip
                                        label={row.invoiceCount}
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        sx={{ height: 24, fontSize: '0.7rem' }}
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {/* Grand Total Row */}
                        <TableRow sx={{
                            bgcolor: theme.palette.grey[100],
                            borderTop: `2px solid ${theme.palette.divider}`,
                            '&:hover': { bgcolor: theme.palette.grey[100] },
                        }}>
                            <TableCell colSpan={3} sx={{ fontWeight: 700, padding: '6px 12px', fontSize: '0.8rem' }}>
                                Grand Total
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 700, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {formatCurrency(totals?.taxableAmount)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 600, color: theme.palette.info.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {formatCurrency(totals?.cgstAmount)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 600, color: theme.palette.success.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {formatCurrency(totals?.sgstAmount)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 600, color: theme.palette.warning.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {formatCurrency(totals?.igstAmount)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 700, color: theme.palette.primary.main, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {formatCurrency(totals?.totalGST)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'right', fontWeight: 700, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {formatCurrency(totals?.totalAmount)}
                            </TableCell>
                            <TableCell sx={{ textAlign: 'center', fontWeight: 600, padding: '6px 12px', fontSize: '0.8rem' }}>
                                {totals?.invoiceCount}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50, 100]}
                component="div"
                count={sortedData.length}
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

export default GSTReportPartyTable;