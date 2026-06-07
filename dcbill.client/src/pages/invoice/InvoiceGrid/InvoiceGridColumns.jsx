// components/InvoiceGrid/InvoiceGridColumns.jsx
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Visibility as ViewIcon, PictureAsPdf as PdfIcon, Print as PrintIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

export const useInvoiceColumns = () => {
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    return [
        {
            field: 'sno',
            headerName: 'S.No',
            width: 70,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
        },
        {
            field: 'invoiceNo',
            headerName: 'Invoice No',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'invoiceDate',
            headerName: 'Date',
            width: 110,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {formatDate(params.value)}
                </Typography>
            )
        },
        {
            field: 'partyName',
            headerName: 'Party Name',
            width: 250,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'partyGSTIN',
            headerName: 'Party GSTIN',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {params.value || '—'}
                </Typography>
            )
        },
        {
            field: 'subtotal',
            headerName: 'Subtotal',
            width: 120,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'totalGST',
            headerName: 'GST',
            width: 100,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'grandTotal',
            headerName: 'Grand Total',
            width: 130,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => (
                <Chip
                    label="Paid"
                    size="small"
                    sx={{ fontSize: '0.7rem', bgcolor: '#e8f5e9', color: '#2e7d32', height: '24px' }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/invoice/${params.row.id}`)}
                        sx={{ padding: 0.5 }}
                        title="View Invoice"
                    >
                        <ViewIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ padding: 0.5 }}
                        title="Download PDF"
                    >
                        <PdfIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ padding: 0.5 }}
                        title="Print"
                    >
                        <PrintIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                </Box>
            )
        }
    ];
};