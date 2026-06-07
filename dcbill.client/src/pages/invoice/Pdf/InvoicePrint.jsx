// components/InvoicePrint.jsx
import { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';

const InvoicePrint = forwardRef(({ invoiceData, billingData }, ref) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    };

    // Calculate GST breakdown
    const companyState = billingData?.state || '';
    const partyState = invoiceData?.partyState || '';
    const isInterState = companyState !== partyState && companyState !== '' && partyState !== '';
    const gstPercent = invoiceData?.gstPercent || 18;
    const totalGST = invoiceData?.totalGST || (invoiceData?.subtotal * gstPercent) / 100;
    const cgstPercent = isInterState ? 0 : gstPercent / 2;
    const sgstPercent = isInterState ? 0 : gstPercent / 2;
    const igstPercent = isInterState ? gstPercent : 0;
    const cgstAmount = isInterState ? 0 : totalGST / 2;
    const sgstAmount = isInterState ? 0 : totalGST / 2;
    const igstAmount = isInterState ? totalGST : 0;

    return (
        <Box ref={ref} sx={{ p: 3, fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3, borderBottom: '2px solid #000', pb: 2 }}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
                    {billingData?.companyName || 'DHANRAJ CITY DEVELOPERS'}
                </Typography>
                <Typography variant="body2">
                    {billingData?.address || 'C-19, Clement Town, Turner Road, Dehradun-248002'}
                </Typography>
                <Typography variant="body2">
                    GSTIN: {billingData?.gstin || '05AOSPA8862Q2Z2'} | MOB: {billingData?.mobileNumber || '9358001015'}
                </Typography>
                <Typography variant="h5" sx={{ mt: 2, fontWeight: 'bold' }}>
                    TAX INVOICE
                </Typography>
            </Box>

            {/* Invoice Details */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="body1">
                    <strong>Invoice No:</strong> {invoiceData?.invoiceNo}
                </Typography>
                <Typography variant="body1">
                    <strong>Date:</strong> {formatDate(invoiceData?.invoiceDate)}
                </Typography>
            </Box>

            {/* Party Details */}
            <Box sx={{ border: '1px solid #ddd', p: 2, mb: 3 }}>
                <Typography variant="body1"><strong>M/s.:</strong> {invoiceData?.partyName}</Typography>
                <Typography variant="body1"><strong>Address:</strong> {invoiceData?.partyAddress}</Typography>
                <Typography variant="body1">
                    <strong>City/Pin/State:</strong> {invoiceData?.partyCity} - {invoiceData?.partyPinCode} - {invoiceData?.partyState}
                </Typography>
                <Typography variant="body1"><strong>Party GSTIN:</strong> {invoiceData?.partyGSTIN || '—'}</Typography>
            </Box>

            {/* Items Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f5f5f5', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>S.No</th>
                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>Description</th>
                        <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>HSN Code</th>
                        <th style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>Qty</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Rate</th>
                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    {invoiceData?.details?.map((item, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{index + 1}</td>
                            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #ddd' }}>{item.itemName}</td>
                            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{item.hsnCode}</td>
                            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>{item.quantity}</td>
                            <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>{formatCurrency(item.rate)}</td>
                            <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>{formatCurrency(item.amount)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Summary */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: '300px' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body1">Subtotal:</Typography>
                        <Typography variant="body1">{formatCurrency(invoiceData?.subtotal)}</Typography>
                    </Box>

                    {!isInterState && (
                        <>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">CGST ({cgstPercent}%):</Typography>
                                <Typography variant="body1">{formatCurrency(cgstAmount)}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body1">SGST ({sgstPercent}%):</Typography>
                                <Typography variant="body1">{formatCurrency(sgstAmount)}</Typography>
                            </Box>
                        </>
                    )}

                    {isInterState && (
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="body1">IGST ({igstPercent}%):</Typography>
                            <Typography variant="body1">{formatCurrency(igstAmount)}</Typography>
                        </Box>
                    )}

                    <Box sx={{ borderTop: '2px solid #000', mt: 1, pt: 1 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography variant="h6"><strong>Grand Total:</strong></Typography>
                            <Typography variant="h6"><strong>{formatCurrency(invoiceData?.grandTotal)}</strong></Typography>
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: 4, pt: 2, borderTop: '1px solid #ddd' }}>
                <Typography variant="body2">Thank you for your business!</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                    Terms: All disputes subject to Dehradun Jurisdiction only.
                </Typography>
            </Box>
        </Box>
    );
});

InvoicePrint.displayName = 'InvoicePrint';

export default InvoicePrint;