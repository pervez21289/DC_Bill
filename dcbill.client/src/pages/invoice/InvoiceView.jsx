// pages/invoice/InvoiceView.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Paper, Typography, CircularProgress,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Chip, Tooltip
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    PictureAsPdf as PdfIcon,
    Print as PrintIcon,
    ReceiptLong as ReceiptIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Tag as TagIcon
} from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';

import { fetchInvoiceById, clearCurrentInvoice } from '../../store/invoiceSlice';
import { fetchBillingSettings } from '../../store/billingSettingsSlice';
import { InvoicePDF } from './Pdf/InvoicePDF';
import InvoicePDFViewer from './Pdf/InvoicePDFViewer';
import InvoicePDFButton from './Pdf/InvoicePDFButton';
import { useInvoicePdf } from './Pdf/useInvoicePdf';
import { useInvoiceSummary as useInvoiceSummaryHook } from './useInvoiceSummary';

const T = {
    navy: '#1a2744', blue: '#2563eb', blueSoft: '#eff4ff',
    blueBorder: '#bfcfff', bg: '#f0f4fb', card: '#ffffff',
    border: '#e2e8f0', text: '#0f172a', muted: '#64748b',
    faint: '#94a3b8', green: '#16a34a', greenSoft: '#dcfce7',
    tableHead: '#f8faff', stripe: '#fafcff',
};

const sx = {
    page: { minHeight: '100vh', bgcolor: T.bg, p: { xs: 2, sm: 3 } },
    actionBar: {
        bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: '12px',
        px: 2.5, py: 1.5, mb: 3, display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    },
    invoiceCard: {
        bgcolor: T.card, border: `1px solid ${T.border}`, borderRadius: '16px',
        overflow: 'hidden', boxShadow: '0 4px 24px rgba(26,39,68,0.08)',
    },
    docHeader: {
        background: `linear-gradient(135deg, ${T.navy} 0%, #2a3f6e 100%)`,
        px: 4, py: 3, display: 'flex', justifyContent: 'space-between',
        alignItems: 'flex-start', flexWrap: 'wrap', gap: 2,
    },
    docBody: { px: { xs: 2.5, sm: 4 }, py: 3 },
    sectionCard: { border: `1px solid ${T.border}`, borderRadius: '10px', p: 2.5, bgcolor: T.tableHead },
    tableHead: {
        '& .MuiTableCell-head': {
            bgcolor: T.navy, color: '#fff', fontWeight: 600, fontSize: '0.72rem',
            letterSpacing: '0.05em', textTransform: 'uppercase', py: 1.5, borderBottom: 'none',
        },
    },
    tableRow: {
        '&:nth-of-type(even)': { bgcolor: T.stripe },
        '&:last-child td': { borderBottom: 'none' },
        '& .MuiTableCell-body': { fontSize: '0.82rem', color: T.text, py: 1.4 },
    },
    summaryBox: {
        border: `1px solid ${T.blueBorder}`, borderRadius: '10px',
        bgcolor: T.blueSoft, overflow: 'hidden', minWidth: 300,
    },
    summaryRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.2 },
    summaryTotal: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2.5, py: 1.6, bgcolor: T.navy },
    pill: {
        display: 'inline-flex', alignItems: 'center', gap: 0.6,
        bgcolor: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '6px', px: 1.5, py: 0.5,
    },
};

const fmt = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(n || 0);

const fmtDate = (d) => {
    if (!d) return '—';
    return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

function SectionHeading({ children }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 3, height: 18, bgcolor: T.blue, borderRadius: 2 }} />
            <Typography sx={{ fontSize: '0.72rem', fontWeight: 700, color: T.muted, letterSpacing: '0.07em', textTransform: 'uppercase' }}>
                {children}
            </Typography>
        </Box>
    );
}

function PageLoader({ message = 'Loading…' }) {
    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', gap: 2, bgcolor: T.bg }}>
            <CircularProgress sx={{ color: T.blue }} />
            <Typography sx={{ color: T.muted, fontSize: '0.85rem' }}>{message}</Typography>
        </Box>
    );
}

export default function InvoiceView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    const { currentInvoice, loading } = useSelector(s => s.invoice);
    const { data: billingData, loading: billingLoading } = useSelector(s => s.billingSettings);

    // Tracks whether the fetch for the current id has settled (resolved or rejected).
    // Stays false from the moment clearCurrentInvoice fires until the thunk finishes,
    // so we never briefly flash "Invoice not found" between the clear and the response.
    const [fetchInitiated, setFetchInitiated] = useState(false);

    useEffect(() => {
        debugger;
        if (!billingData && !billingLoading) dispatch(fetchBillingSettings());
    }, [dispatch, billingData, billingLoading]);

    const { pdfData, getPdfData, isLoading: pdfLoading } = useInvoicePdf(billingData);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);

    useEffect(() => {
        if (!id) return;
        setFetchInitiated(false);
        dispatch(clearCurrentInvoice());
        dispatch(fetchInvoiceById(id)).finally(() => setFetchInitiated(true));
        return () => { dispatch(clearCurrentInvoice()); };
    }, [dispatch, id]);

    const invoiceItems = currentInvoice?.details?.map(item => ({
        amount: item.amount, quantity: item.quantity,
        rate: item.rate, itemName: item.itemName, hsnCode: item.hsnCode,
    })) || [];

    const gstPercent = currentInvoice?.gstPercent || 18;
    const { subtotal, totalGST, grandTotal, cgstAmount, sgstAmount, cgstPercent, sgstPercent } =
        useInvoiceSummaryHook(invoiceItems, gstPercent);

    const preparePdfData = async () => {
        if (!currentInvoice) return null;
        return {
            gstin: billingData?.gstin || '', mobile: billingData?.mobileNumber || '',
            companyName: billingData?.companyName || '', address: billingData?.address || '',
            city: billingData?.city || '', pinCode: billingData?.pinCode || '', state: billingData?.state || '',
            invoiceDate: currentInvoice.invoiceDate, invoiceNo: currentInvoice.invoiceNo,
            partyName: currentInvoice.partyName, partyAddress: currentInvoice.partyAddress || '',
            partyCity: currentInvoice.partyCity || '', partyPinCode: currentInvoice.partyPinCode || '',
            partyState: currentInvoice.partyState || '', partyGstin: currentInvoice.partyGSTIN || '',
            items: currentInvoice.details?.map(item => ({ ...item, gstPercent })) || [],
            subtotal, totalGST, grandTotal, gstPercent, cgstPercent, sgstPercent, cgstAmount, sgstAmount,
        };
    };

    const handlePrintPDF = async () => {
        if (!currentInvoice) return;
        setPrintLoading(true);
        try {
            const invoiceData = await preparePdfData();
            if (!invoiceData) return;
            const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
            const url = URL.createObjectURL(blob);
            const win = window.open(url, '_blank');
            if (!win) { alert('Please allow pop-ups to print the invoice'); return; }
            setTimeout(() => URL.revokeObjectURL(url), 5000);
        } catch (e) {
            console.error(e);
            alert('Error generating PDF for printing');
        } finally {
            setPrintLoading(false);
        }
    };

    const handlePreviewPDF = async () => {
        if (currentInvoice) { await getPdfData(currentInvoice); setPdfOpen(true); }
    };

    // ── Guards ──────────────────────────────────────────────────────────────
    // Show loader while billing is loading, the invoice fetch is in flight,
    // OR fetchInitiated is still false (i.e. we just cleared and haven't resolved yet).
    if (loading || billingLoading || !fetchInitiated) {
        return <PageLoader message="Loading invoice…" />;
    }

    // Only show "not found" once fetch has settled with no result
    if (!currentInvoice) {
        return (
            <Box sx={{ p: 4, textAlign: 'center', bgcolor: T.bg, minHeight: '100vh' }}>
                <ReceiptIcon sx={{ fontSize: 48, color: T.faint, mb: 2 }} />
                <Typography sx={{ fontWeight: 600, color: T.text, mb: 1 }}>Invoice not found</Typography>
                <Typography sx={{ color: T.muted, mb: 3, fontSize: '0.85rem' }}>
                    The invoice you're looking for doesn't exist or was removed.
                </Typography>
                <Button variant="contained" onClick={() => navigate('/invoices')}
                    sx={{ bgcolor: T.blue, borderRadius: '8px', textTransform: 'none', fontWeight: 600 }}>
                    Back to Invoices
                </Button>
            </Box>
        );
    }

    const btnBase = {
        textTransform: 'none', fontWeight: 600, fontSize: '0.8rem',
        borderRadius: '8px', px: 2, py: 0.8,
    };

    return (
        <>
            <Box sx={sx.page}>

                {/* ── Action Bar ── */}
                <Paper elevation={0} sx={sx.actionBar}>
                    <Button
                        startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
                        onClick={() => navigate('/invoices')}
                        sx={{ ...btnBase, color: T.navy, border: `1px solid ${T.border}`, '&:hover': { bgcolor: T.bg } }}
                    >
                        Invoices
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center' }}>
                        <Tooltip title="Preview as PDF">
                            <Button
                                variant="outlined" onClick={handlePreviewPDF}
                                startIcon={pdfLoading ? <CircularProgress size={14} /> : <PdfIcon sx={{ fontSize: '1rem' }} />}
                                disabled={pdfLoading}
                                sx={{ ...btnBase, color: T.blue, borderColor: T.blueBorder, '&:hover': { bgcolor: T.blueSoft } }}
                            >
                                Preview
                            </Button>
                        </Tooltip>
                        <InvoicePDFButton invoice={currentInvoice} billingData={billingData} variant="button" />
                        <Tooltip title="Open printable PDF">
                            <Button
                                variant="contained"
                                startIcon={printLoading ? <CircularProgress size={14} sx={{ color: '#fff' }} /> : <PrintIcon sx={{ fontSize: '1rem' }} />}
                                onClick={handlePrintPDF} disabled={printLoading}
                                sx={{ ...btnBase, bgcolor: T.navy, '&:hover': { bgcolor: '#243260' }, boxShadow: 'none' }}
                            >
                                Print
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>

                {/* ── Invoice Document Card ── */}
                <Box sx={sx.invoiceCard}>

                    {/* Header band */}
                    <Box sx={sx.docHeader}>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Box sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <ReceiptIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
                                </Box>
                                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                                    Tax Invoice
                                </Typography>
                            </Box>
                            {billingData?.companyName && (
                                <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '1.25rem', mb: 0.5 }}>
                                    {billingData.companyName}
                                </Typography>
                            )}
                            {(billingData?.address || billingData?.city) && (
                                <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', maxWidth: 320 }}>
                                    {[billingData.address, billingData.city, billingData.state, billingData.pinCode].filter(Boolean).join(', ')}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.5 }}>
                            <Box sx={sx.pill}>
                                <TagIcon sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>{currentInvoice.invoiceNo}</Typography>
                            </Box>
                            <Box sx={sx.pill}>
                                <CalendarIcon sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>{fmtDate(currentInvoice.invoiceDate)}</Typography>
                            </Box>
                            {billingData?.gstin && (
                                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>GSTIN: {billingData.gstin}</Typography>
                            )}
                            <Chip label="Paid" size="small"
                                sx={{ bgcolor: T.greenSoft, color: T.green, fontWeight: 700, fontSize: '0.7rem', height: 22, border: `1px solid ${T.green}` }} />
                        </Box>
                    </Box>

                    {/* Body */}
                    <Box sx={sx.docBody}>

                        {/* Bill To */}
                        <Box sx={{ mb: 3 }}>
                            <SectionHeading>Bill To</SectionHeading>
                            <Box sx={{ ...sx.sectionCard, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                                <Box sx={{ flex: '1 1 200px' }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mb: 0.8 }}>
                                        <PersonIcon sx={{ fontSize: '1rem', color: T.blue }} />
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: T.text }}>{currentInvoice.partyName}</Typography>
                                    </Box>
                                    {currentInvoice.partyAddress && (
                                        <Typography sx={{ fontSize: '0.82rem', color: T.muted, mb: 0.3 }}>{currentInvoice.partyAddress}</Typography>
                                    )}
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>
                                        {[currentInvoice.partyCity, currentInvoice.partyPinCode, currentInvoice.partyState].filter(Boolean).join(' – ')}
                                    </Typography>
                                </Box>
                                {currentInvoice.partyGSTIN && (
                                    <Box sx={{ flex: '0 0 auto' }}>
                                        <Typography sx={{ fontSize: '0.7rem', color: T.faint, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.3 }}>GSTIN</Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: T.text, fontFamily: 'monospace' }}>{currentInvoice.partyGSTIN}</Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Items Table */}
                        <Box sx={{ mb: 3 }}>
                            <SectionHeading>Line Items</SectionHeading>
                            <TableContainer sx={{ border: `1px solid ${T.border}`, borderRadius: '10px', overflow: 'hidden' }}>
                                <Table size="small">
                                    <TableHead sx={sx.tableHead}>
                                        <TableRow>
                                            <TableCell align="center" sx={{ width: 50 }}>#</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell align="center">HSN Code</TableCell>
                                            <TableCell align="center">Qty</TableCell>
                                            <TableCell align="right">Rate</TableCell>
                                            <TableCell align="right">Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {currentInvoice.details?.map((item, i) => (
                                            <TableRow key={i} sx={sx.tableRow}>
                                                <TableCell align="center">
                                                    <Typography sx={{ fontSize: '0.75rem', color: T.faint, fontWeight: 600 }}>{i + 1}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography sx={{ fontWeight: 600, fontSize: '0.83rem', color: T.text }}>{item.itemName}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography sx={{ fontSize: '0.78rem', color: T.muted, fontFamily: 'monospace' }}>{item.hsnCode || '—'}</Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: T.text }}>{item.quantity}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted, fontVariantNumeric: 'tabular-nums' }}>{fmt(item.rate)}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 700, color: T.text, fontVariantNumeric: 'tabular-nums' }}>{fmt(item.amount)}</Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!currentInvoice.details || currentInvoice.details.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                    <Typography sx={{ color: T.faint, fontSize: '0.85rem' }}>No line items on this invoice.</Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Summary */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
                            <Box sx={sx.summaryBox}>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>Subtotal</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums' }}>{fmt(subtotal)}</Typography>
                                </Box>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>CGST @ {cgstPercent}%</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', color: T.muted, fontVariantNumeric: 'tabular-nums' }}>{fmt(cgstAmount)}</Typography>
                                </Box>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>SGST @ {sgstPercent}%</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', color: T.muted, fontVariantNumeric: 'tabular-nums' }}>{fmt(sgstAmount)}</Typography>
                                </Box>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>Total GST ({gstPercent}%)</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', color: T.blue, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>{fmt(totalGST)}</Typography>
                                </Box>
                                <Box sx={sx.summaryTotal}>
                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                                        Grand Total
                                    </Typography>
                                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 800, color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                                        {fmt(grandTotal)}
                                    </Typography>
                                </Box>
                            </Box>
                        </Box>

                        {/* Footer */}
                        <Box sx={{ pt: 2.5, borderTop: `1px dashed ${T.border}`, textAlign: 'center' }}>
                            <Typography sx={{ fontSize: '0.8rem', color: T.faint }}>Thank you for your business!</Typography>
                            {billingData?.mobileNumber && (
                                <Typography sx={{ fontSize: '0.75rem', color: T.faint, mt: 0.5 }}>Contact: {billingData.mobileNumber}</Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            <InvoicePDFViewer open={pdfOpen} onClose={() => setPdfOpen(false)} invoiceData={pdfData} />
        </>
    );
}
