// components/InvoicePDFViewer.jsx
import { PDFViewer } from '@react-pdf/renderer';
import { InvoicePDF } from './InvoicePDF';
import { Box, Button, Dialog, DialogTitle, DialogContent, IconButton, Typography } from '@mui/material';
import { Close as CloseIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';

export default function InvoicePDFViewer({ open, onClose, invoiceData }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xl"
            fullWidth
            fullScreen
            PaperProps={{
                sx: {
                    height: '100vh',
                    maxHeight: '100vh',
                    margin: 0,
                    borderRadius: 0
                }
            }}
        >
            <DialogTitle sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '1px solid #e0e0e0',
                p: 2,
                bgcolor: '#f5f5f5'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PdfIcon color="error" />
                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                        Invoice Preview - {invoiceData?.invoiceNo || 'Invoice'}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ p: 0, height: 'calc(100vh - 60px)', overflow: 'hidden' }}>
                <PDFViewer style={{ width: '100%', height: '100%', border: 'none' }}>
                    <InvoicePDF invoiceData={invoiceData} />
                </PDFViewer>
            </DialogContent>
        </Dialog>
    );
}