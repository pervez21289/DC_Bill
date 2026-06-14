// components/InvoiceGrid/InvoiceGridColumns.jsx
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Visibility as ViewIcon, Print as PrintIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import InvoicePDFButton from './../Pdf/InvoicePDFButton';

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

// Helper function to get payment status color and label
const getPaymentStatusConfig = (paymentStatus) => {
    // Payment status mapping: 1 = Paid, 2 = Partially Paid, 3 = Not Paid
    switch (paymentStatus) {
        case 1:
            return {
                label: 'Paid',
                color: 'success',
                bgColor: '#e8f5e9',
                textColor: '#2e7d32'
            };
        case 2:
            return {
                label: 'Partially Paid',
                color: 'warning',
                bgColor: '#fff3e0',
                textColor: '#ed6c02'
            };
        case 3:
            return {
                label: 'Not Paid',
                color: 'error',
                bgColor: '#ffebee',
                textColor: '#d32f2f'
            };
        default:
            return {
                label: 'Not Paid',
                color: 'error',
                bgColor: '#ffebee',
                textColor: '#d32f2f'
            };
    }
};

export const useInvoiceColumns = (billingData = null) => {
    const navigate = useNavigate();

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
            field: 'paymentStatus',
            headerName: 'Payment Status',
            width: 130,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const statusConfig = getPaymentStatusConfig(params.value);
                return (
                    <Chip
                        label={statusConfig.label}
                        size="small"
                        sx={{
                            fontSize: '0.7rem',
                            bgcolor: statusConfig.bgColor,
                            color: statusConfig.textColor,
                            height: '24px',
                            fontWeight: 500
                        }}
                    />
                );
            }
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
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/invoice/${params.row.id}`)}
                        sx={{ padding: 0.5 }}
                        title="View Invoice"
                    >
                        <ViewIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>

                    <InvoicePDFButton
                        invoiceId={params.row.id}
                        invoiceNo={params.row.invoiceNo}
                        billingData={billingData}
                    />
                </Box>
            )
        }
    ];
};