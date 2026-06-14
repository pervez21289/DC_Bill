// components/InvoiceGrid/InvoiceGridColumns.jsx
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Visibility as ViewIcon } from '@mui/icons-material';
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

const getPaymentStatusConfig = (paymentStatus) => {
    switch (paymentStatus) {
        case 1: return { label: 'Paid', bgColor: '#e8f5e9', textColor: '#2e7d32' };
        case 2: return { label: 'Partially Paid', bgColor: '#fff3e0', textColor: '#ed6c02' };
        case 3: return { label: 'Not Paid', bgColor: '#ffebee', textColor: '#d32f2f' };
        default: return { label: 'Not Paid', bgColor: '#ffebee', textColor: '#d32f2f' };
    }
};

// Wraps every cell so its content is vertically + horizontally aligned
// DataGrid cells are display:flex but don't always center children by default
const Cell = ({ children, justify = 'flex-start' }) => (
    <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: justify,
        width: '100%',
        height: '100%',
    }}>
        {children}
    </Box>
);

const cellText = {
    fontSize: '0.78rem',
    lineHeight: 1,          // prevents text from pushing the row taller
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};

export const useInvoiceColumns = (billingData = null) => {
    const navigate = useNavigate();

    return [
        {
            field: 'sno',
            headerName: 'S.No',
            width: 65,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Cell justify="center">
                    <Typography sx={cellText}>
                        {params.api.getAllRowIds().indexOf(params.id) + 1}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'invoiceNo',
            headerName: 'Invoice No',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Cell justify="center">
                    <Typography sx={{ ...cellText, fontWeight: 700 }}>
                        {params.value}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'invoiceDate',
            headerName: 'Date',
            width: 110,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Cell justify="center">
                    <Typography sx={cellText}>
                        {formatDate(params.value)}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'partyName',
            headerName: 'Party Name',
            flex: 1,
            minWidth: 200,
            headerAlign: 'left',
            align: 'left',
            renderCell: (params) => (
                <Cell justify="flex-start">
                    <Typography sx={cellText} title={params.value}>
                        {params.value}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'partyGSTIN',
            headerName: 'Party GSTIN',
            width: 155,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <Cell justify="center">
                    <Typography sx={{ ...cellText, fontFamily: 'monospace' }}>
                        {params.value || '—'}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'subtotal',
            headerName: 'Subtotal',
            width: 125,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Cell justify="flex-end">
                    <Typography sx={{ ...cellText, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(params.value)}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'totalGST',
            headerName: 'GST',
            width: 105,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Cell justify="flex-end">
                    <Typography sx={{ ...cellText, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(params.value)}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'grandTotal',
            headerName: 'Grand Total',
            width: 135,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Cell justify="flex-end">
                    <Typography sx={{ ...cellText, fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>
                        {formatCurrency(params.value)}
                    </Typography>
                </Cell>
            ),
        },
        {
            field: 'paymentStatus',
            headerName: 'Status',
            width: 125,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                const s = getPaymentStatusConfig(params.value);
                return (
                    <Cell justify="center">
                        <Chip
                            label={s.label}
                            size="small"
                            sx={{
                                fontSize: '0.7rem',
                                fontWeight: 600,
                                bgcolor: s.bgColor,
                                color: s.textColor,
                                height: 22,
                                '& .MuiChip-label': { px: 1 },
                            }}
                        />
                    </Cell>
                );
            },
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Cell justify="center">
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/invoice/${params.row.id}`)}
                        sx={{ p: 0.5 }}
                        title="View Invoice"
                    >
                        <ViewIcon sx={{ fontSize: '1.1rem' }} />
                    </IconButton>
                    <InvoicePDFButton
                        invoiceId={params.row.id}
                        invoiceNo={params.row.invoiceNo}
                        billingData={billingData}
                    />
                </Cell>
            ),
        },
    ];
};
