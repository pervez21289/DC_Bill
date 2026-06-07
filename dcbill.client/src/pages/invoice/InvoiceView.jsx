// pages/invoice/InvoiceView.jsx
import { useRef, useState, useEffect } from 'react'; // Add useState and useEffect here
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Button, Paper, Typography, CircularProgress } from '@mui/material';
import { ArrowBack as ArrowBackIcon, PictureAsPdf as PdfIcon, Print as PrintIcon } from '@mui/icons-material';
import { useReactToPrint } from 'react-to-print';

import { fetchInvoiceById } from '../../store/invoiceSlice';
import { useInvoicePdf } from './Pdf/useInvoicePdf';
import InvoicePrint from './Pdf/InvoicePrint';
import InvoicePDFViewer from './Pdf/InvoicePDFViewer';
import InvoicePDFDownload from './Pdf/InvoicePDFDownload';
import InvoicePDFButton from './Pdf/InvoicePDFButton';

export default function InvoiceView() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const printRef = useRef();

    const { currentInvoice, loading } = useSelector(state => state.invoice);
    const { data: billingData } = useSelector(state => state.billingSettings);
    const { pdfData, getPdfData, isLoading: pdfLoading } = useInvoicePdf(billingData);

    const [pdfOpen, setPdfOpen] = useState(false);

    useEffect(() => {
        if (id) {
            dispatch(fetchInvoiceById(id));
        }
    }, [dispatch, id]);

    const handlePrint = useReactToPrint({
        content: () => printRef.current,
        pageStyle: '@page { size: A4; margin: 1cm; }'
    });

    const handlePreviewPDF = async () => {
        if (currentInvoice) {
            await getPdfData(currentInvoice);
            setPdfOpen(true);
        }
    };

    if (loading) {
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

    return (
        <>
            <Box sx={{ p: 3 }}>
                {/* Actions Bar */}
                <Paper sx={{ p: 2, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/invoices')} variant="outlined">
                        Back to Invoices
                    </Button>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button variant="outlined" onClick={handlePreviewPDF} startIcon={<PdfIcon />}>
                            Preview PDF
                        </Button>
                        <InvoicePDFButton
                            invoice={currentInvoice}
                            billingData={billingData}
                            variant="button"
                        />
                        <Button variant="outlined" startIcon={<PrintIcon />} onClick={handlePrint}>
                            Print
                        </Button>
                    </Box>
                </Paper>

                {/* Hidden Print Content */}
                <div style={{ display: 'none' }}>
                    <InvoicePrint
                        ref={printRef}
                        invoiceData={currentInvoice}
                        billingData={billingData}
                    />
                </div>

                {/* Screen View Content */}
                {/* ... your existing invoice display ... */}
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