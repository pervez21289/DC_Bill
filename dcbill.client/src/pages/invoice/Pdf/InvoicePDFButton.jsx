// components/InvoicePDFButton.jsx
import { IconButton, CircularProgress } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useInvoicePdf } from './useInvoicePdf';

export default function InvoicePDFButton({ invoice, invoiceId, invoiceNo, billingData, variant = 'icon', onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const { downloadPdf, downloadInvoicePdf } = useInvoicePdf(billingData);

    const handleDownload = async () => {
        setIsLoading(true);
        let success = false;

        if (invoice) {
            // If invoice data is already available
            success = await downloadPdf(invoice);
        } else if (invoiceId) {
            // If only ID is available (for grid)
            success = await downloadInvoicePdf(invoiceId, invoiceNo);
        }

        if (success && onSuccess) {
            onSuccess();
        }
        setIsLoading(false);
    };

    if (isLoading) {
        return (
            <IconButton size="small" disabled>
                <CircularProgress size={16} />
            </IconButton>
        );
    }

    if (variant === 'button') {
        return (
            <button onClick={handleDownload} disabled={isLoading}>
                Download PDF
            </button>
        );
    }

    return (
        <IconButton
            size="small"
            onClick={handleDownload}
            sx={{ padding: 0.5 }}
            title="Download PDF"
        >
            <PdfIcon sx={{ fontSize: '1rem', color: '#f44336' }} />
        </IconButton>
    );
}