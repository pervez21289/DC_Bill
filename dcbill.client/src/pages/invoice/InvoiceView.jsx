// pages/invoice/InvoiceView.jsx
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box, Button, Paper, Typography, CircularProgress,
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Tooltip, Menu, MenuItem, Snackbar, Alert,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField
} from '@mui/material';
import {
    ArrowBack as ArrowBackIcon,
    PictureAsPdf as PdfIcon,
    Print as PrintIcon,
    ReceiptLong as ReceiptIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Tag as TagIcon,
    CheckCircle as PaidIcon,
    Schedule as PartialIcon,
    Cancel as UnpaidIcon,
    ArrowDropDown as ArrowDropDownIcon,
    EditNote as EditNoteIcon,
    Email as EmailIcon,
    Send as SendIcon,
} from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';

import {
    fetchInvoiceById,
    clearCurrentInvoice,
    updateInvoicePaymentStatus,
    sendPaymentReminder
} from '../../store/invoiceSlice';
import { fetchBillingSettings } from '../../store/billingSettingsSlice';
import { InvoicePDF } from './Pdf/InvoicePDF';
import InvoicePDFViewer from './Pdf/InvoicePDFViewer';
import InvoicePDFButton from './Pdf/InvoicePDFButton';
import { useInvoicePdf } from './Pdf/useInvoicePdf';
import { useInvoiceSummary as useInvoiceSummaryHook } from './useInvoiceSummary';

// ─── Design tokens ───────────────────────────────────────────────────────────
const T = {
    navy: '#1a2744', blue: '#2563eb', blueSoft: '#eff4ff',
    blueBorder: '#bfcfff', bg: '#f0f4fb', card: '#ffffff',
    border: '#e2e8f0', text: '#0f172a', muted: '#64748b',
    faint: '#94a3b8', green: '#16a34a', greenSoft: '#dcfce7',
    tableHead: '#f8faff', stripe: '#fafcff',
};

// ─── Payment status config ────────────────────────────────────────────────────
// 1 = Paid, 2 = Partially Paid, 3 = Not Paid
const PAYMENT_STATUS = {
    1: { label: 'Paid', bg: '#dcfce7', color: '#15803d', border: '#86efac', Icon: PaidIcon },
    2: { label: 'Partially Paid', bg: '#fef3c7', color: '#b45309', border: '#fcd34d', Icon: PartialIcon },
    3: { label: 'Not Paid', bg: '#fee2e2', color: '#b91c1c', border: '#fca5a5', Icon: UnpaidIcon },
};
const getPaymentStatus = (val) => PAYMENT_STATUS[val] ?? PAYMENT_STATUS[3];

// ─── Shared styles ────────────────────────────────────────────────────────────
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

// ─── Sub-components ───────────────────────────────────────────────────────────
function SectionHeading({ children }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Box sx={{ width: 3, height: 18, bgcolor: T.blue, borderRadius: 2 }} />
            <Typography sx={{
                fontSize: '0.72rem', fontWeight: 700, color: T.muted,
                letterSpacing: '0.07em', textTransform: 'uppercase',
            }}>
                {children}
            </Typography>
        </Box>
    );
}

function PageLoader({ message = 'Loading…' }) {
    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column', justifyContent: 'center',
            alignItems: 'center', height: '100vh', gap: 2, bgcolor: T.bg,
        }}>
            <CircularProgress sx={{ color: T.blue }} />
            <Typography sx={{ color: T.muted, fontSize: '0.85rem' }}>{message}</Typography>
        </Box>
    );
}

// Badge shown in the dark header band
function PaymentStatusBadge({ status }) {
    const s = getPaymentStatus(status);
    return (
        <Box sx={{
            display: 'inline-flex', alignItems: 'center', gap: 0.6,
            bgcolor: s.bg, border: `1px solid ${s.border}`,
            borderRadius: '6px', px: 1.4, py: 0.45,
        }}>
            <s.Icon sx={{ fontSize: '0.85rem', color: s.color }} />
            <Typography sx={{ fontSize: '0.78rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>
                {s.label}
            </Typography>
        </Box>
    );
}

// Clickable payment status card with dropdown
function PaymentStatusCard({ currentStatus, onStatusChange, updating }) {
    const [anchor, setAnchor] = useState(null);
    const s = getPaymentStatus(currentStatus);

    const handleSelect = (value) => {
        setAnchor(null);
        onStatusChange(value);
    };

    return (
        <>
            <Tooltip title="Click to change payment status" placement="top">
                <Box
                    onClick={(e) => setAnchor(e.currentTarget)}
                    sx={{
                        border: `1.5px solid ${s.border}`,
                        borderRadius: '10px',
                        bgcolor: s.bg,
                        p: 2,
                        minWidth: 190,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0.5,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        userSelect: 'none',
                        '&:hover': {
                            filter: 'brightness(0.95)',
                            boxShadow: `0 0 0 3px ${s.border}`,
                        },
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{
                            fontSize: '0.67rem', fontWeight: 700, color: T.faint,
                            textTransform: 'uppercase', letterSpacing: '0.08em',
                        }}>
                            Payment Status
                        </Typography>
                        <EditNoteIcon sx={{ fontSize: '0.95rem', color: T.faint }} />
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 0.5 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                            {updating ? (
                                <CircularProgress size={18} sx={{ color: s.color }} />
                            ) : (
                                <>
                                    <s.Icon sx={{ fontSize: '1.35rem', color: s.color }} />
                                    <Typography sx={{ fontSize: '0.98rem', fontWeight: 700, color: s.color }}>
                                        {s.label}
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <ArrowDropDownIcon sx={{ fontSize: '1.1rem', color: s.color, opacity: 0.7 }} />
                    </Box>

                    <Typography sx={{ fontSize: '0.67rem', color: T.faint, mt: 0.3 }}>
                        Tap to update
                    </Typography>
                </Box>
            </Tooltip>

            <Menu
                anchorEl={anchor}
                open={Boolean(anchor)}
                onClose={() => setAnchor(null)}
                transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                PaperProps={{
                    elevation: 4,
                    sx: {
                        borderRadius: '10px',
                        minWidth: 200,
                        mt: 0.5,
                        border: `1px solid ${T.border}`,
                        boxShadow: '0 8px 24px rgba(0,0,0,0.10)',
                        overflow: 'hidden',
                    },
                }}
            >
                <Box sx={{ px: 2, pt: 1.5, pb: 1, borderBottom: `1px solid ${T.border}` }}>
                    <Typography sx={{ fontSize: '0.7rem', fontWeight: 700, color: T.faint, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                        Change Status
                    </Typography>
                </Box>

                {Object.values(PAYMENT_STATUS).map(({ label, color, bg, border, Icon, value: _ }, idx) => {
                    const val = parseInt(Object.keys(PAYMENT_STATUS)[idx]);
                    const isCurrent = val === currentStatus;
                    return (
                        <MenuItem
                            key={val}
                            onClick={() => handleSelect(val)}
                            disabled={isCurrent}
                            sx={{
                                gap: 1.2, py: 1.3, px: 2,
                                bgcolor: isCurrent ? bg : 'transparent',
                                '&:hover': { bgcolor: bg },
                                '&.Mui-disabled': { opacity: 1, bgcolor: bg },
                            }}
                        >
                            <Icon sx={{ fontSize: '1.05rem', color }} />
                            <Box sx={{ flex: 1 }}>
                                <Typography sx={{ fontSize: '0.85rem', fontWeight: isCurrent ? 700 : 500, color }}>
                                    {label}
                                </Typography>
                            </Box>
                            {isCurrent && (
                                <Box sx={{
                                    fontSize: '0.65rem', fontWeight: 700, color,
                                    bgcolor: border, borderRadius: '4px', px: 0.8, py: 0.2,
                                }}>
                                    CURRENT
                                </Box>
                            )}
                        </MenuItem>
                    );
                })}
            </Menu>
        </>
    );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function InvoiceView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();

    // ── Redux state ────────────────────────────────────────────────────────────
    const { currentInvoice, loading, statusUpdating, reminderSending } = useSelector(s => s.invoice);
    const { data: billingData, loading: billingLoading } = useSelector(s => s.billingSettings);

    // ── Local state ────────────────────────────────────────────────────────────
    const [fetchInitiated, setFetchInitiated] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [reminderDialogOpen, setReminderDialogOpen] = useState(false);
    const [reminderMessage, setReminderMessage] = useState('');

    // ── PDF state ──────────────────────────────────────────────────────────────
    const { pdfData, getPdfData, isLoading: pdfLoading } = useInvoicePdf(billingData);
    const [pdfOpen, setPdfOpen] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);

    // ── Effects ────────────────────────────────────────────────────────────────
    useEffect(() => {
        if (!billingData && !billingLoading) dispatch(fetchBillingSettings());
    }, [dispatch, billingData, billingLoading]);

    useEffect(() => {
        if (!id) return;
        setFetchInitiated(false);
        dispatch(clearCurrentInvoice());
        dispatch(fetchInvoiceById(id)).finally(() => setFetchInitiated(true));
        return () => { dispatch(clearCurrentInvoice()); };
    }, [dispatch, id]);

    // ── Invoice summary ──────────────────────────────────────────────────────
    const invoiceItems = currentInvoice?.details?.map(item => ({
        amount: item.amount, quantity: item.quantity,
        rate: item.rate, itemName: item.itemName, hsnCode: item.hsnCode,
    })) || [];

    const gstPercent = currentInvoice?.gstPercent || 18;
    const { subtotal, totalGST, grandTotal, cgstAmount, sgstAmount, cgstPercent, sgstPercent } =
        useInvoiceSummaryHook(invoiceItems, gstPercent);

    // ── PDF data preparation ──────────────────────────────────────────────────
    const preparePdfData = async () => {
        if (!currentInvoice) return null;
        return {
            gstin: billingData?.gstin || '', mobile: billingData?.mobileNumber || '',
            companyName: billingData?.companyName || '', address: billingData?.address || '',
            city: billingData?.city || '', pinCode: billingData?.pinCode || '',
            state: billingData?.state || '', upi: billingData?.upi || '',
            invoiceDate: currentInvoice.invoiceDate, invoiceNo: currentInvoice.invoiceNo,
            partyName: currentInvoice.partyName, partyAddress: currentInvoice.partyAddress || '',
            partyCity: currentInvoice.partyCity || '', partyPinCode: currentInvoice.partyPinCode || '',
            partyState: currentInvoice.partyState || '', partyGstin: currentInvoice.partyGSTIN || '',
            items: currentInvoice.details?.map(item => ({ ...item, gstPercent })) || [],
            subtotal, totalGST, grandTotal, gstPercent, cgstPercent, sgstPercent, cgstAmount, sgstAmount,
        };
    };

    // ── PDF handlers ───────────────────────────────────────────────────────────
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

    // ── Payment status update ──────────────────────────────────────────────────
    const handleStatusChange = async (newStatus) => {
        if (!newStatus || newStatus === currentInvoice?.paymentStatus) return;
        try {
            const result = await dispatch(
                updateInvoicePaymentStatus({ invoiceId: id, paymentStatus: newStatus })
            ).unwrap();
            if (result?.success) {
                setSnackbar({ open: true, message: `Payment status updated to "${getPaymentStatus(newStatus).label}"`, severity: 'success' });
            } else {
                setSnackbar({ open: true, message: result?.message || 'Update failed', severity: 'error' });
            }
        } catch (err) {
            setSnackbar({ open: true, message: err?.message || 'Error updating status', severity: 'error' });
        }
    };

    // ── Send Reminder via Redux ───────────────────────────────────────────────
    const handleSendReminder = async () => {
        if (!id) return;
        try {
            const result = await dispatch(sendPaymentReminder({
                invoiceId: id,
                customMessage: reminderMessage.trim()
            })).unwrap();

            setSnackbar({
                open: true,
                message: result.message || 'Reminder sent successfully!',
                severity: 'success'
            });
            setReminderDialogOpen(false);
            setReminderMessage('');
        } catch (error) {
            setSnackbar({
                open: true,
                message: error?.message || 'Failed to send reminder',
                severity: 'error'
            });
        }
    };

    // ── Guards ────────────────────────────────────────────────────────────────
    if (loading || billingLoading || !fetchInitiated) {
        return <PageLoader message="Loading invoice…" />;
    }

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

                {/* ── Action Bar ─────────────────────────────────────────────── */}
                <Paper elevation={0} sx={sx.actionBar}>
                    <Button
                        startIcon={<ArrowBackIcon sx={{ fontSize: '1rem' }} />}
                        onClick={() => navigate('/invoices')}
                        sx={{ ...btnBase, color: T.navy, border: `1px solid ${T.border}`, '&:hover': { bgcolor: T.bg } }}
                    >
                        Invoices
                    </Button>
                    <Box sx={{ display: 'flex', gap: 1.2, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Tooltip title="Preview as PDF">
                            <Button
                                variant="outlined"
                                onClick={handlePreviewPDF}
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
                                onClick={handlePrintPDF}
                                disabled={printLoading}
                                sx={{ ...btnBase, bgcolor: T.navy, '&:hover': { bgcolor: '#243260' }, boxShadow: 'none' }}
                            >
                                Print
                            </Button>
                        </Tooltip>
                        {/* ── Send Reminder Button ── */}
                        <Tooltip title="Send Payment Reminder">
                            <Button
                                variant="outlined"
                                onClick={() => setReminderDialogOpen(true)}
                                disabled={currentInvoice?.paymentStatus === 1 || reminderSending}
                                startIcon={<EmailIcon sx={{ fontSize: '1rem' }} />}
                                sx={{
                                    ...btnBase,
                                    color: '#d97706',
                                    borderColor: '#fcd34d',
                                    '&:hover': { bgcolor: '#fef3c7' }
                                }}
                            >
                                {reminderSending ? 'Sending...' : 'Remind'}
                            </Button>
                        </Tooltip>
                    </Box>
                </Paper>

                {/* ── Invoice Document Card ───────────────────────────────────── */}
                <Box sx={sx.invoiceCard}>

                    {/* Header band */}
                    <Box sx={sx.docHeader}>
                        {/* Left: company info */}
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                <Box sx={{
                                    width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.15)',
                                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <ReceiptIcon sx={{ fontSize: '1.1rem', color: '#fff' }} />
                                </Box>
                                <Typography sx={{
                                    color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', fontWeight: 700,
                                    letterSpacing: '0.12em', textTransform: 'uppercase',
                                }}>
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

                        {/* Right: invoice meta + payment status badge */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: { xs: 'flex-start', sm: 'flex-end' }, gap: 1.2 }}>
                            <Box sx={sx.pill}>
                                <TagIcon sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                                    {currentInvoice.invoiceNo}
                                </Typography>
                            </Box>
                            <Box sx={sx.pill}>
                                <CalendarIcon sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)' }} />
                                <Typography sx={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.85)' }}>
                                    {fmtDate(currentInvoice.invoiceDate)}
                                </Typography>
                            </Box>
                            {billingData?.gstin && (
                                <Typography sx={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>
                                    GSTIN: {billingData.gstin}
                                </Typography>
                            )}
                            <PaymentStatusBadge status={currentInvoice.paymentStatus} />
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
                                        <Typography sx={{ fontWeight: 700, fontSize: '0.95rem', color: T.text }}>
                                            {currentInvoice.partyName}
                                        </Typography>
                                    </Box>
                                    {currentInvoice.partyAddress && (
                                        <Typography sx={{ fontSize: '0.82rem', color: T.muted, mb: 0.3 }}>
                                            {currentInvoice.partyAddress}
                                        </Typography>
                                    )}
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>
                                        {[currentInvoice.partyCity, currentInvoice.partyPinCode, currentInvoice.partyState].filter(Boolean).join(' – ')}
                                    </Typography>
                                </Box>
                                {currentInvoice.partyGSTIN && (
                                    <Box sx={{ flex: '0 0 auto' }}>
                                        <Typography sx={{
                                            fontSize: '0.7rem', color: T.faint, fontWeight: 600,
                                            textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.3,
                                        }}>
                                            GSTIN
                                        </Typography>
                                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color: T.text, fontFamily: 'monospace' }}>
                                            {currentInvoice.partyGSTIN}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>

                        {/* Line Items */}
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
                                                    <Typography sx={{ fontSize: '0.78rem', color: T.muted, fontFamily: 'monospace' }}>
                                                        {item.hsnCode || '—'}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Typography sx={{ fontSize: '0.82rem', fontWeight: 600, color: T.text }}>{item.quantity}</Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
                                                        {fmt(item.rate)}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography sx={{ fontSize: '0.83rem', fontWeight: 700, color: T.text, fontVariantNumeric: 'tabular-nums' }}>
                                                        {fmt(item.amount)}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        {(!currentInvoice.details || currentInvoice.details.length === 0) && (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                                                    <Typography sx={{ color: T.faint, fontSize: '0.85rem' }}>
                                                        No line items on this invoice.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>

                        {/* Summary + Payment Status */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 2, mb: 3, flexWrap: 'wrap' }}>

                            {/* ── Editable Payment Status Card ── */}
                            <PaymentStatusCard
                                currentStatus={currentInvoice.paymentStatus}
                                onStatusChange={handleStatusChange}
                                updating={statusUpdating}
                            />

                            {/* ── Financial Summary ── */}
                            <Box sx={sx.summaryBox}>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>Subtotal</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: T.text, fontVariantNumeric: 'tabular-nums' }}>
                                        {fmt(subtotal)}
                                    </Typography>
                                </Box>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>CGST @ {cgstPercent}%</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
                                        {fmt(cgstAmount)}
                                    </Typography>
                                </Box>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>SGST @ {sgstPercent}%</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', color: T.muted, fontVariantNumeric: 'tabular-nums' }}>
                                        {fmt(sgstAmount)}
                                    </Typography>
                                </Box>
                                <Box sx={{ ...sx.summaryRow, borderBottom: `1px solid ${T.blueBorder}` }}>
                                    <Typography sx={{ fontSize: '0.82rem', color: T.muted }}>Total GST ({gstPercent}%)</Typography>
                                    <Typography sx={{ fontSize: '0.88rem', color: T.blue, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                                        {fmt(totalGST)}
                                    </Typography>
                                </Box>
                                <Box sx={sx.summaryTotal}>
                                    <Typography sx={{
                                        fontSize: '0.88rem', fontWeight: 700, color: 'rgba(255,255,255,0.8)',
                                        letterSpacing: '0.04em', textTransform: 'uppercase',
                                    }}>
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
                                <Typography sx={{ fontSize: '0.75rem', color: T.faint, mt: 0.5 }}>
                                    Contact: {billingData.mobileNumber}
                                </Typography>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* PDF Viewer */}
            <InvoicePDFViewer open={pdfOpen} onClose={() => setPdfOpen(false)} invoiceData={pdfData} />

            {/* ── Reminder Dialog ── */}
            <Dialog
                open={reminderDialogOpen}
                onClose={() => {
                    if (!reminderSending) setReminderDialogOpen(false);
                }}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                        p: 1,
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: 600, fontSize: '1.1rem', pb: 1 }}>
                    Send Payment Reminder
                </DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        This will send an email reminder to the customer for invoice <strong>{currentInvoice?.invoiceNo}</strong>.
                        {currentInvoice?.dueDate && (
                            <> Due date was <strong>{fmtDate(currentInvoice.dueDate)}</strong>.</>
                        )}
                    </Typography>
                    <TextField
                        autoFocus
                        multiline
                        rows={3}
                        fullWidth
                        label="Custom Message (Optional)"
                        placeholder="Add any additional note for the customer..."
                        value={reminderMessage}
                        onChange={(e) => setReminderMessage(e.target.value)}
                        variant="outlined"
                        sx={{ mt: 1 }}
                        disabled={reminderSending}
                    />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setReminderDialogOpen(false)} disabled={reminderSending}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSendReminder}
                        variant="contained"
                        disabled={reminderSending}
                        startIcon={reminderSending ? <CircularProgress size={18} /> : <SendIcon />}
                        sx={{
                            bgcolor: T.blue,
                            '&:hover': { bgcolor: '#1d4ed8' },
                            textTransform: 'none',
                            fontWeight: 600,
                            borderRadius: '8px',
                            px: 3,
                        }}
                    >
                        {reminderSending ? 'Sending...' : 'Send Reminder'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar feedback */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    variant="filled"
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(s => ({ ...s, open: false }))}
                    sx={{ borderRadius: '8px' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
}