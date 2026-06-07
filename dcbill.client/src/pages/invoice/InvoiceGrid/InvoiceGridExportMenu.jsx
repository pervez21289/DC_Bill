// components/InvoiceGrid/InvoiceGridExportMenu.jsx
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import { Download as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import * as XLSX from 'xlsx';

export default function InvoiceGridExportMenu({ exportAnchorEl, setExportAnchorEl, invoices }) {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const handleExportToExcel = () => {
        const exportData = invoices.map((invoice, index) => ({
            'S.No': index + 1,
            'Invoice No': invoice.invoiceNo,
            'Invoice Date': formatDate(invoice.invoiceDate),
            'Party Name': invoice.partyName,
            'Party GSTIN': invoice.partyGSTIN || '—',
            'Subtotal': invoice.subtotal,
            'GST Amount': invoice.totalGST,
            'Grand Total': invoice.grandTotal,
            'Status': 'Paid'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, `Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
        setExportAnchorEl(null);
    };

    const handleExportToPDF = () => {
        window.print();
        setExportAnchorEl(null);
    };

    return (
        <Menu
            anchorEl={exportAnchorEl}
            open={Boolean(exportAnchorEl)}
            onClose={() => setExportAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
            <MenuItem onClick={handleExportToExcel} sx={{ fontSize: '0.75rem' }}>
                <ListItemIcon>
                    <DownloadIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export to Excel</ListItemText>
            </MenuItem>
            <MenuItem onClick={handleExportToPDF} sx={{ fontSize: '0.75rem' }}>
                <ListItemIcon>
                    <PdfIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Export to PDF</ListItemText>
            </MenuItem>
        </Menu>
    );
}