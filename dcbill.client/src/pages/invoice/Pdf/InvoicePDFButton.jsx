// components/InvoicePDFButton.jsx
import { IconButton, CircularProgress, Button } from '@mui/material';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { useState } from 'react';
import { useInvoicePdf } from './useInvoicePdf';

export default function InvoicePDFButton({ invoice, invoiceId, invoiceNo, billingData, variant = 'icon', onSuccess }) {
    const [isLoading, setIsLoading] = useState(false);
    const { downloadPdf, downloadInvoicePdf } = useInvoicePdf(billingData);

    const handleDownload = async () => {
        setIsLoading(true);
        let success = false;

        try {
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
        } catch (error) {
            console.error('Download error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <IconButton size="small" disabled sx={{ padding: 0.5 }}>
                <CircularProgress size={16} />
            </IconButton>
        );
    }

    if (variant === 'button') {
        return (
            <Button
                variant="outlined"
                onClick={handleDownload}
                disabled={isLoading}
                startIcon={<PdfIcon />}
                size="small"
                sx={{ fontSize: '0.7rem', textTransform: 'none' }}
            >
                {isLoading ? 'Generating...' : 'Download PDF'}
            </Button>
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