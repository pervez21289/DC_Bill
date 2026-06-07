// components/InvoicePDFDownload.jsx
import { Button } from '@mui/material';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';

export default function InvoicePDFDownload({ invoiceData, buttonText = "Download PDF" }) {
    return (
        <PDFDownloadLink
            document={<InvoicePDF invoiceData={invoiceData} />}
            fileName={`Invoice_${invoiceData.invoiceNo || 'draft'}.pdf`}
        >
            {({ loading }) => (
                <Button
                    variant="contained"
                    color="error"
                    startIcon={<PdfIcon />}
                    disabled={loading}
                    size="small"
                    sx={{ fontSize: '0.7rem', textTransform: 'none' }}
                >
                    {loading ? 'Generating PDF...' : buttonText}
                </Button>
            )}
        </PDFDownloadLink>
    );
}