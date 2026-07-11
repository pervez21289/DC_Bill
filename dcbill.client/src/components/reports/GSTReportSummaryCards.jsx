import React, { useEffect, useMemo } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Chip,
    Divider,
    useTheme,
    Paper,
    Stack,
} from '@mui/material';
import {
    Receipt,
    AttachMoney,
    AccountBalance,
    TrendingUp,
    TrendingDown,
    CheckCircle,
    Warning,
    Error,
    Payment,
} from '@mui/icons-material';
import { formatCurrency } from '../../hooks/useGSTReport';

const GSTReportSummaryCards = ({ summary, company }) => {
    const theme = useTheme();

    useEffect(() => {
        console.log('Summary Cards mounted/updated with:', {
            totalInvoices: summary?.totalInvoices,
            paidInvoices: summary?.paidInvoices,
            partialInvoices: summary?.partialInvoices,
            unpaidInvoices: summary?.unpaidInvoices,
            totalTaxableAmount: summary?.totalTaxableAmount,
            totalGST: summary?.totalGST,
        });
    }, [summary]);

    if (!summary) {
        console.log('No summary data available');
        return null;
    }

    // Use useMemo to create cards with stable references
    const cards = useMemo(() => [
        {
            title: 'Total Invoices',
            value: summary.totalInvoices || 0,
            icon: Receipt,
            color: theme.palette.primary.main,
            bgColor: theme.palette.primary.light + '20',
            subtitle: 'Invoices processed',
            key: 'totalInvoices'
        },
        {
            title: 'Taxable Value',
            value: formatCurrency(summary.totalTaxableAmount || 0),
            icon: AttachMoney,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light + '20',
            subtitle: 'Net taxable amount',
            key: 'totalTaxableAmount'
        },
        {
            title: 'Total Tax',
            value: formatCurrency(summary.totalGST || 0),
            icon: AccountBalance,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light + '20',
            subtitle: 'CGST + SGST + IGST',
            key: 'totalGST'
        },
        {
            title: 'Invoice Value',
            value: formatCurrency(summary.grandTotal || 0),
            icon: Payment,
            color: theme.palette.info.main,
            bgColor: theme.palette.info.light + '20',
            subtitle: 'Total including tax',
            key: 'grandTotal'
        },
        {
            title: 'Paid',
            value: summary.paidInvoices || 0,
            icon: CheckCircle,
            color: theme.palette.success.main,
            bgColor: theme.palette.success.light + '20',
            subtitle: 'Fully paid invoices',
            key: 'paidInvoices'
        },
        {
            title: 'Partial Paid',
            value: summary.partialInvoices || 0,
            icon: Warning,
            color: theme.palette.warning.main,
            bgColor: theme.palette.warning.light + '20',
            subtitle: 'Partially paid invoices',
            key: 'partialInvoices'
        },
        {
            title: 'Unpaid',
            value: summary.unpaidInvoices || 0,
            icon: Error,
            color: theme.palette.error.main,
            bgColor: theme.palette.error.light + '20',
            subtitle: 'Pending invoices',
            key: 'unpaidInvoices'
        },
    ], [summary, theme]);

    const taxCards = useMemo(() => [
        {
            title: 'CGST',
            value: formatCurrency(summary.totalCGST || 0),
            color: theme.palette.info.main,
            key: 'totalCGST'
        },
        {
            title: 'SGST',
            value: formatCurrency(summary.totalSGST || 0),
            color: theme.palette.success.main,
            key: 'totalSGST'
        },
        {
            title: 'IGST',
            value: formatCurrency(summary.totalIGST || 0),
            color: theme.palette.warning.main,
            key: 'totalIGST'
        },
    ], [summary, theme]);

    // Create a unique hash based on summary values
    const summaryHash = useMemo(() => {
        return `${summary.totalInvoices}-${summary.paidInvoices}-${summary.partialInvoices}-${summary.unpaidInvoices}-${summary.totalGST}-${summary.grandTotal}`;
    }, [summary]);

    return (
        <Box>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    Report Summary
                </Typography>
                <Chip
                    label={`${summary.totalInvoices || 0} Invoices`}
                    size="small"
                    color="primary"
                    variant="outlined"
                />
            </Stack>

            {/* Main Summary Cards */}
            <Grid container spacing={2.5}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={`card-${card.key}-${summaryHash}`}>
                        <Card
                            sx={{
                                height: '100%',
                                position: 'relative',
                                overflow: 'visible',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: theme.shadows[8],
                                },
                                borderRadius: 3,
                            }}
                        >
                            <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                    <Box>
                                        <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ fontWeight: 500, textTransform: 'uppercase', letterSpacing: 0.5 }}
                                        >
                                            {card.title}
                                        </Typography>
                                        <Typography
                                            variant="h5"
                                            sx={{
                                                fontWeight: 700,
                                                mt: 0.5,
                                                color: card.color,
                                            }}
                                        >
                                            {card.value}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {card.subtitle}
                                        </Typography>
                                    </Box>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 2,
                                            bgcolor: card.bgColor,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <card.icon sx={{ color: card.color, fontSize: 28 }} />
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Tax Breakdown Cards */}
            <Box sx={{ mt: 3 }}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom sx={{ fontWeight: 500 }}>
                    Tax Breakdown
                </Typography>
                <Grid container spacing={2}>
                    {taxCards.map((card, index) => (
                        <Grid item xs={12} sm={4} key={`tax-${card.key}-${summaryHash}`}>
                            <Paper
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: card.color + '08',
                                    border: `1px solid ${card.color}20`,
                                }}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.title}
                                    </Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 600, color: card.color }}>
                                        {card.value}
                                    </Typography>
                                </Box>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Box>

            {/* Company Information */}
            {company && (
                <Paper
                    key={`company-${company.gstin}`}
                    sx={{
                        mt: 3,
                        p: 3,
                        borderRadius: 2,
                        bgcolor: theme.palette.grey[50],
                        border: `1px solid ${theme.palette.divider}`,
                    }}
                >
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2 }}>
                        Company Details
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">
                                Company Name
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {company.companyName}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">
                                GSTIN
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                                {company.gstin}
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography variant="caption" color="text.secondary">
                                State
                            </Typography>
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                {company.state} ({company.stateCode})
                            </Typography>
                        </Grid>
                    </Grid>
                </Paper>
            )}
        </Box>
    );
};

export default GSTReportSummaryCards;