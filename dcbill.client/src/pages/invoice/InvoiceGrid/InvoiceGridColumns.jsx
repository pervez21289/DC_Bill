// components/InvoiceGrid/InvoiceGridColumns.jsx (Simpler Version)
import { Box, Typography, Chip, IconButton } from '@mui/material';
import { Visibility as ViewIcon, PictureAsPdf as PdfIcon, Print as PrintIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import { InvoicePDF } from './../Pdf/InvoicePDF';
import { useState } from 'react';
import { CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInvoiceById } from './../../../store/invoiceSlice';

// Format helpers
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

// Function to prepare invoice data for PDF
const prepareInvoiceData = (invoice, billingData) => {
    if (!invoice) return null;

    // Get company state from billing data
    const companyState = billingData?.state || '';
    const partyState = invoice.partyState || '';
    const isInterState = companyState !== partyState && companyState !== '' && partyState !== '';

    // Calculate GST based on GSTPercent
    const gstPercent = invoice.gstPercent || 18;
    const totalGST = invoice.totalGST || (invoice.subtotal * gstPercent) / 100;
    const cgstPercent = isInterState ? 0 : gstPercent / 2;
    const sgstPercent = isInterState ? 0 : gstPercent / 2;
    const igstPercent = isInterState ? gstPercent : 0;
    const cgstAmount = isInterState ? 0 : totalGST / 2;
    const sgstAmount = isInterState ? 0 : totalGST / 2;
    const igstAmount = isInterState ? totalGST : 0;

    return {
        gstin: billingData?.gstin || "05AOSPA8862Q2Z2",
        mobile: billingData?.mobileNumber || "9358001015",
        companyName: billingData?.companyName || "DHANRAJ CITY DEVELOPERS",
        address: billingData?.address || "C-19, Clement Town, Turner Road, Dehradun-248002",
        city: billingData?.city || "",
        pinCode: billingData?.pinCode || "",
        state: billingData?.state || "",
        invoiceDate: invoice.invoiceDate,
        invoiceNo: invoice.invoiceNo,
        partyName: invoice.partyName,
        partyAddress: invoice.partyAddress || "",
        partyCity: invoice.partyCity || "",
        partyPinCode: invoice.partyPinCode || "",
        partyState: invoice.partyState || "",
        partyGstin: invoice.partyGSTIN || "",
        items: invoice.details?.map(item => ({
            itemName: item.itemName,
            hsnCode: item.hsnCode,
            quantity: item.quantity,
            rate: item.rate,
            amount: item.amount,
            gstPercent: gstPercent
        })) || [],
        subtotal: invoice.subtotal,
        totalGST: totalGST,
        grandTotal: invoice.grandTotal,
        isInterState: isInterState,
        cgstPercent: cgstPercent,
        sgstPercent: sgstPercent,
        igstPercent: igstPercent,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount
    };
};

// PDF Button Component
const PDFButton = ({ row, billingData }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const handleDownloadPDF = async () => {
        setIsLoading(true);
        try {
            const result = await dispatch(fetchInvoiceById(row.id)).unwrap();
            if (result && result.success) {
                // Get the invoice data from the response
                const invoice = result.data || result;
                const invoiceData = prepareInvoiceData(invoice, billingData);

                if (invoiceData) {
                    const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = url;
                    link.download = `Invoice_${row.invoiceNo}.pdf`;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);
                }
            }
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <IconButton size="small" sx={{ padding: 0.5 }} disabled>
                <CircularProgress size={16} />
            </IconButton>
        );
    }

    return (
        <IconButton
            size="small"
            onClick={handleDownloadPDF}
            sx={{ padding: 0.5 }}
            title="Download PDF"
        >
            <PdfIcon sx={{ fontSize: '1rem' }} />
        </IconButton>
    );
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
                <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/invoice/${params.row.id}`)}
                        sx={{ padding: 0.5 }}
                        title="View Invoice"
                    >
                        <ViewIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>

                    <PDFButton row={params.row} billingData={billingData} />

                    <IconButton
                        size="small"
                        sx={{ padding: 0.5 }}
                        title="Print Invoice"
                    >
                        <PrintIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                </Box>
            )
        }
    ];
};