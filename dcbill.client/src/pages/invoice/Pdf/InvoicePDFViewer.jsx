// components/InvoicePDFViewer.jsx
import { PDFViewer } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { Box, Button, Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material';
import { Close as CloseIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

export default function InvoicePDFViewer({ open, onClose, invoiceData }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                sx: {
                    height: '90vh',
                    maxHeight: '90vh'
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                p: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PdfIcon color="error" />
                    <span>Invoice Preview</span>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: 'calc(100% - 64px)' }}>
                <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                    <InvoicePDF invoiceData={invoiceData} />
                </PDFViewer>
            </DialogContent>
        </Dialog>
    );
}