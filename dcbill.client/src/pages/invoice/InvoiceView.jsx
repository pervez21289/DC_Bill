// pages/invoice/InvoiceView.jsx
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography, CircularProgress, Grid, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { ArrowBack as ArrowBackIcon, PictureAsPdf as PdfIcon, Print as PrintIcon } from '@mui/icons-material';
import { pdf } from '@react-pdf/renderer';

import { fetchInvoiceById } from '../../store/invoiceSlice';
import { fetchBillingSettings } from '../../store/billingSettingsSlice';
import { InvoicePDF } from './Pdf/InvoicePDF';
import InvoicePDFViewer from './Pdf/InvoicePDFViewer';
import InvoicePDFButton from './Pdf/InvoicePDFButton';
import InvoiceSummary from './InvoiceSummary';
import { useInvoicePdf } from './Pdf/useInvoicePdf';

export default function InvoiceView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const printRef = useRef();

    const { currentInvoice, loading } = useSelector(state => state.invoice);
    const { data: billingData, loading: billingLoading } = useSelector(state => state.billingSettings);

    // Fetch billing settings if not available
    useEffect(() => {
        if (!billingData && !billingLoading) {
            dispatch(fetchBillingSettings());
        }
    }, [dispatch, billingData, billingLoading]);

    // Use the hook correctly
    const { pdfData, getPdfData, isLoading: pdfLoading } = useInvoicePdf(billingData);

    const [pdfOpen, setPdfOpen] = useState(false);
    const [printLoading, setPrintLoading] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchInvoiceById(id));
        }
    }, [dispatch, id]);

    // Prepare PDF data for preview and print
    const preparePdfData = async () => {
        if (!currentInvoice) return null;

        const gstPercent = currentInvoice.gstPercent || 18;
        const totalGST = currentInvoice.totalGST || (currentInvoice.subtotal * gstPercent) / 100;

        return {
            // Company Details - from billingData
            gstin: billingData?.gstin || '',
            mobile: billingData?.mobileNumber || '',
            companyName: billingData?.companyName || '',
            address: billingData?.address || '',
            city: billingData?.city || "",
            pinCode: billingData?.pinCode || "",
            state: billingData?.state || "",

            // Invoice Details
            invoiceDate: currentInvoice.invoiceDate,
            invoiceNo: currentInvoice.invoiceNo,

            // Party Details
            partyName: currentInvoice.partyName,
            partyAddress: currentInvoice.partyAddress || "",
            partyCity: currentInvoice.partyCity || "",
            partyPinCode: currentInvoice.partyPinCode || "",
            partyState: currentInvoice.partyState || "",
            partyGstin: currentInvoice.partyGSTIN || "",

            // Items
            items: currentInvoice.details?.map(item => ({
                itemName: item.itemName,
                hsnCode: item.hsnCode,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
                gstPercent: gstPercent
            })) || [],

            // Financials
            subtotal: currentInvoice.subtotal,
            totalGST: totalGST,
            grandTotal: currentInvoice.grandTotal,
            gstPercent: gstPercent,

            // Always show CGST and SGST
            cgstPercent: gstPercent / 2,
            sgstPercent: gstPercent / 2,
            cgstAmount: totalGST / 2,
            sgstAmount: totalGST / 2
        };
    };

    // Direct PDF Print
    const handlePrintPDF = async () => {
        if (!currentInvoice) return;

        setPrintLoading(true);

        try {
            const invoiceData = await preparePdfData();
            if (!invoiceData) return;

            const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
            const url = URL.createObjectURL(blob);

            const printWindow = window.open(url, '_blank');
            if (!printWindow) {
                alert('Please allow pop-ups to print the invoice');
                return;
            }

            setTimeout(() => {
                URL.revokeObjectURL(url);
            }, 5000);
        } catch (error) {
            console.error('Error printing PDF:', error);
            alert('Error generating PDF for printing');
        } finally {
            setPrintLoading(false);
        }
    };

    const handlePreviewPDF = async () => {
        if (currentInvoice) {
            const data = await preparePdfData();
            setPdfOpen(true);
            // Use the hook to set pdfData
            await getPdfData(currentInvoice);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    };

    // Calculate GST breakdown for summary
    const calculateGST = () => {
        if (!currentInvoice) return { totalGST: 0, grandTotal: 0 };

        const gstPercent = currentInvoice.gstPercent || 18;
        const totalGST = currentInvoice.totalGST || (currentInvoice.subtotal * gstPercent) / 100;
        const grandTotal = currentInvoice.grandTotal || currentInvoice.subtotal + totalGST;

        return {
            subtotal: currentInvoice.subtotal,
            totalGST: totalGST,
            grandTotal: grandTotal,
            itemsCount: currentInvoice.details?.length || 0,
            gstPercent: gstPercent
        };
    };

    // Show loading while billing settings are being fetched
    if (loading || billingLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!currentInvoice) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography>Invoice not found</Typography>
                <Button onClick={() => navigate('/invoices')} sx={{ mt: 2 }}>
                    Back to Invoices
                </Button>
            </Box>
        );
    }

    const summaryData = calculateGST();

    return (
        <>
            <Box sx={{ p: 3 }}>
                {/* Actions Bar */}
                <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoices')} variant="outlined" size="small">
                        Back to Invoices
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button
                            variant="outlined"
                            onClick={handlePreviewPDF}
                            startIcon={<PdfIcon />}
                            size="small"
                            disabled={pdfLoading}
                        >
                            {pdfLoading ? <CircularProgress size={20} /> : 'Preview PDF'}
                        </Button>
                        <InvoicePDFButton
                            invoice={currentInvoice}
                            billingData={billingData}
                            variant="button"
                        />
                        <Button
                            variant="outlined"
                            startIcon={<PrintIcon />}
                            onClick={handlePrintPDF}
                            disabled={printLoading}
                            size="small"
                        >
                            {printLoading ? <CircularProgress size={20} /> : 'Print'}
                        </Button>
                    </Box>
                </Paper>

                {/* Screen View Content */}
                <Paper sx={{ p: 3 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            TAX INVOICE
                        </Typography>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    {/* Invoice Details */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                <strong>Invoice No:</strong> {currentInvoice.invoiceNo}
                            </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: 'right' }}>
                            <Typography variant="body1">
                                <strong>Date:</strong> {formatDate(currentInvoice.invoiceDate)}
                            </Typography>
                        </Grid>
                    </Grid>

                    {/* Party Details */}
                    <Box sx={{ border: '1px solid #e0e0e0', p: 2, mb: 3, borderRadius: 1, bgcolor: '#fafafa' }}>
                        <Grid container spacing={1}>
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>M/s.:</strong> {currentInvoice.partyName}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>Address:</strong> {currentInvoice.partyAddress || '—'}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2">
                                    <strong>City/Pin/State:</strong> {currentInvoice.partyCity} - {currentInvoice.partyPinCode} - {currentInvoice.partyState}
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="body2"><strong>Party GSTIN:</strong> {currentInvoice.partyGSTIN || '—'}</Typography>
                            </Grid>
                        </Grid>
                    </Box>

                    {/* Items Table */}
                    <TableContainer component={Paper} sx={{ mb: 3, border: '1px solid #e0e0e0' }}>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                                <TableRow>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>S.No</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>HSN Code</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Rate (₹)</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {currentInvoice.details?.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell align="center">{index + 1}</TableCell>
                                        <TableCell>{item.itemName}</TableCell>
                                        <TableCell align="center">{item.hsnCode}</TableCell>
                                        <TableCell align="center">{item.quantity}</TableCell>
                                        <TableCell align="right">{formatCurrency(item.rate)}</TableCell>
                                        <TableCell align="right">{formatCurrency(item.amount)}</TableCell>
                                    </TableRow>
                                ))}
                                {(!currentInvoice.details || currentInvoice.details.length === 0) && (
                                    <TableRow>
                                        <TableCell colSpan={6} align="center">No items found</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Reusing InvoiceSummary Component */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <InvoiceSummary
                            subtotal={summaryData.subtotal}
                            totalGST={summaryData.totalGST}
                            total={summaryData.grandTotal}
                            itemsCount={summaryData.itemsCount}
                            gstPercent={summaryData.gstPercent}
                        />
                    </Box>

                    {/* Footer */}
                    <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid #e0e0e0' }}>
                        <Typography variant="body2" color="textSecondary">
                            Thank you for your business!
                        </Typography>
                    </Box>
                </Paper>
            </Box>

            {/* PDF Viewer Modal */}
            <InvoicePDFViewer
                open={pdfOpen}
                onClose={() => setPdfOpen(false)}
                invoiceData={pdfData}
            />
        </>
    );
}