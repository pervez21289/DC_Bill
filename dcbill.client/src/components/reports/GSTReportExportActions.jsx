import React from 'react';
import {
    Box,
    Button,
    Tooltip,
    IconButton,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    Typography,
    useTheme,
    Paper,
} from '@mui/material';
import {
    Download,
    Print,
    PictureAsPdf,
    TableChart,
    FileCopy,
    ContentCopy,
    FilterList,
    Refresh,
    Delete,
    Clear,
} from '@mui/icons-material';
import { formatCurrency } from '../../hooks/useGSTReport';

const GSTReportExportActions = ({
    gstReport,
    activeTab,
    onExportExcel,
    onExportPDF,
    onPrint,
    onCopyData,
    onClearFilters,
    loading,
}) => {
    const theme = useTheme();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleExportAction = (action) => {
        handleMenuClose();
        switch (action) {
            case 'excel':
                onExportExcel();
                break;
            case 'pdf':
                onExportPDF();
                break;
            case 'print':
                onPrint();
                break;
            case 'copy':
                onCopyData();
                break;
            default:
                break;
        }
    };

    const getTabLabel = () => {
        switch (activeTab) {
            case 0: return 'Invoice-wise';
            case 1: return 'HSN-wise';
            case 2: return 'Party-wise';
            default: return 'Report';
        }
    };

    const summary = gstReport?.summary;
    const invoiceCount = gstReport?.invoices?.length || 0;
    const hsnCount = gstReport?.summary?.hsnWiseSummary?.length || 0;
    const partyCount = gstReport?.summary?.partyWiseSummary?.length || 0;

    const getCurrentCount = () => {
        switch (activeTab) {
            case 0: return invoiceCount;
            case 1: return hsnCount;
            case 2: return partyCount;
            default: return 0;
        }
    };

    return (
        <Paper
            sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: theme.palette.grey[50],
                border: `1px solid ${theme.palette.divider}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: 2,
            }}
        >
            {/* Left side - Info */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                        {getTabLabel()}
                    </Typography>
                    <Box
                        sx={{
                            bgcolor: theme.palette.primary.main,
                            color: 'white',
                            borderRadius: '50%',
                            width: 24,
                            height: 24,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                        }}
                    >
                        {getCurrentCount()}
                    </Box>
                    <Typography variant="body2" color="text.secondary">records</Typography>
                </Box>

                {summary && (
                    <Box sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                        <Divider orientation="vertical" flexItem />
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Taxable
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>
                                {formatCurrency(summary.totalTaxableAmount)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Total Tax
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: theme.palette.primary.main }}>
                                {formatCurrency(summary.totalGST)}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                Invoice Value
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 600, fontSize: '0.85rem', color: theme.palette.success.main }}>
                                {formatCurrency(summary.grandTotal)}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Right side - Actions */}
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Export Button with Dropdown */}
                <Button
                    variant="contained"
                    onClick={handleMenuOpen}
                    disabled={loading}
                    startIcon={<Download />}
                    endIcon={<span style={{ fontSize: '0.7rem' }}>▼</span>}
                    sx={{
                        borderRadius: 2,
                        textTransform: 'none',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        px: 2,
                        py: 0.8,
                        boxShadow: 'none',
                        '&:hover': {
                            boxShadow: 'none',
                        },
                    }}
                >
                    Export
                </Button>

                <Menu
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleMenuClose}
                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            minWidth: 220,
                            boxShadow: theme.shadows[4],
                        },
                    }}
                >
                    <Typography variant="subtitle2" sx={{ px: 2, py: 1.5, color: 'text.secondary', fontWeight: 600, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        Export {getTabLabel()} Data
                    </Typography>
                    <Divider />
                    <MenuItem onClick={() => handleExportAction('excel')} disabled={loading} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <TableChart fontSize="small" sx={{ color: theme.palette.success.main }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Excel (.xlsx)"
                            secondary="Full data with formatting"
                            slotProps={{
                                primary: { fontSize: '0.85rem', fontWeight: 500 },
                                secondary: { fontSize: '0.7rem' },
                            }}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => handleExportAction('pdf')} disabled={loading} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <PictureAsPdf fontSize="small" sx={{ color: theme.palette.error.main }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="PDF"
                            secondary="Formatted report"
                            slotProps={{
                                primary: { fontSize: '0.85rem', fontWeight: 500 },
                                secondary: { fontSize: '0.7rem' },
                            }}
                        />
                    </MenuItem>
                    <MenuItem onClick={() => handleExportAction('print')} disabled={loading} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <Print fontSize="small" sx={{ color: theme.palette.info.main }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Print"
                            secondary="Open print dialog"
                            slotProps={{
                                primary: { fontSize: '0.85rem', fontWeight: 500 },
                                secondary: { fontSize: '0.7rem' },
                            }}
                        />
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={() => handleExportAction('copy')} disabled={loading} sx={{ py: 1.5 }}>
                        <ListItemIcon>
                            <ContentCopy fontSize="small" sx={{ color: theme.palette.warning.main }} />
                        </ListItemIcon>
                        <ListItemText
                            primary="Copy to Clipboard"
                            secondary="Tab-separated values"
                            slotProps={{
                                primary: { fontSize: '0.85rem', fontWeight: 500 },
                                secondary: { fontSize: '0.7rem' },
                            }}
                        />
                    </MenuItem>
                </Menu>

                {/* Refresh Button */}
                <Tooltip title="Refresh Report">
                    <Button
                        variant="outlined"
                        onClick={() => !loading && onExportExcel()}
                        disabled={loading}
                        startIcon={<Refresh />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            px: 2,
                            py: 0.8,
                            borderColor: theme.palette.grey[300],
                            color: theme.palette.text.primary,
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                bgcolor: theme.palette.primary.light + '10',
                            },
                        }}
                    >
                        Refresh
                    </Button>
                </Tooltip>

                {/* Clear Filters Button */}
                <Tooltip title="Clear Filters">
                    <Button
                        variant="outlined"
                        onClick={() => !loading && onClearFilters?.()}
                        disabled={loading}
                        startIcon={<Clear />}
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 500,
                            fontSize: '0.8rem',
                            px: 2,
                            py: 0.8,
                            borderColor: theme.palette.error.light,
                            color: theme.palette.error.main,
                            '&:hover': {
                                borderColor: theme.palette.error.main,
                                bgcolor: theme.palette.error.light + '10',
                            },
                        }}
                    >
                        Clear
                    </Button>
                </Tooltip>
            </Box>
        </Paper>
    );
};

export default GSTReportExportActions;