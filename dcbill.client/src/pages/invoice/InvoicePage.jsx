// pages/invoice/InvoicePage.jsx
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Snackbar, Alert, CircularProgress, Menu, MenuItem, ButtonGroup, Chip } from "@mui/material";
import { PictureAsPdf as PdfIcon, ArrowDropDown as ArrowDropDownIcon, Payment as PaymentIcon } from '@mui/icons-material';

import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import { useInvoiceSummary } from "./useInvoiceSummary";
import { fetchItemMaster } from "./../../store/itemMasterSlice";
import { saveInvoice } from "./../../store/invoiceSlice";
import { clearItems } from "./../../store/invoiceItemsSlice";
import InvoicePDFViewer from "./Pdf/InvoicePDFViewer";
import InvoicePDFDownload from "./Pdf/InvoicePDFDownload";

export default function InvoicePage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const items = useSelector(state => state.invoiceItems.items);
    const { selectedParty } = useSelector(state => state.parties);
    const { data: billingData } = useSelector(state => state.billingSettings);
    const { invoices } = useSelector(state => state.invoice);

    const [pdfOpen, setPdfOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [gstPercent, setGstPercent] = useState(18);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [resetFormFlag, setResetFormFlag] = useState(false);

    // Payment status states (1 = Paid, 2 = Partially Paid, 3 = Not Paid)
    const [paymentStatus, setPaymentStatus] = useState(3); // Default to Not Paid (3)
    const [anchorEl, setAnchorEl] = useState(null);
    const paymentMenuOpen = Boolean(anchorEl);

    // Payment status mapping
    const paymentStatusMap = {
        1: { label: 'Paid', color: 'success', value: 1 },
        2: { label: 'Partially Paid', color: 'warning', value: 2 },
        3: { label: 'Not Paid', color: 'error', value: 3 }
    };

    // Generate invoice number based on today's date
    const generateInvoiceNumber = () => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const dateStr = `${day}${month}${year}`;

        // Count invoices created today
        const todayInvoices = invoices?.filter(invoice => {
            const invoiceDate = new Date(invoice.invoiceDate);
            const today = new Date();
            return invoiceDate.toDateString() === today.toDateString();
        }) || [];

        const nextNumber = todayInvoices.length + 1;
        const paddedNumber = String(nextNumber).padStart(3, '0');
        return `${dateStr}${paddedNumber}`;
    };

    // State for invoice number and date
    const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
    const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);

    // Regenerate invoice number when invoices list changes (after save)
    useEffect(() => {
        setInvoiceNumber(generateInvoiceNumber());
    }, [invoices?.length]);

    // Use the custom hook for calculations
    const { subtotal, totalGST, grandTotal, itemsCount } = useInvoiceSummary(items, gstPercent);

    useEffect(() => {
        dispatch(fetchItemMaster());
    }, [dispatch]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleGSTChange = (newGSTPercent) => {
        setGstPercent(newGSTPercent);
    };

    const handleInvoiceNoChange = (newInvoiceNo) => {
        setInvoiceNumber(newInvoiceNo);
    };

    const handleInvoiceDateChange = (newDate) => {
        setInvoiceDate(newDate);
    };

    const handleResetForm = () => {
        setResetFormFlag(true);
        setTimeout(() => setResetFormFlag(false), 100);
    };

    // Handle payment status selection
    const handlePaymentStatusClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handlePaymentStatusClose = (statusValue) => {
        if (statusValue) {
            setPaymentStatus(statusValue);
        }
        setAnchorEl(null);
    };

    // Get color for payment status chip
    const getPaymentStatusColor = () => {
        return paymentStatusMap[paymentStatus]?.color || 'default';
    };

    // Get payment status label
    const getPaymentStatusLabel = () => {
        return paymentStatusMap[paymentStatus]?.label || 'Not Paid';
    };

    // Prepare invoice data for PDF
    const invoiceData = {
        gstin: billingData?.gstin || '',
        mobile: billingData?.mobileNumber || '',
        companyName: billingData?.companyName || '',
        address: billingData?.address || '',
        city: billingData?.city || "",
        pinCode: billingData?.pinCode || "",
        state: billingData?.state || "",
        invoiceDate: invoiceDate,
        invoiceNo: invoiceNumber,
        partyName: selectedParty?.partyName || "",
        partyAddress: selectedParty?.address || "",
        partyCity: selectedParty?.city || "",
        partyPinCode: selectedParty?.pinCode || "",
        partyState: selectedParty?.state || "",
        partyGstin: selectedParty?.gstin || "",
        paymentStatus: paymentStatus, // Add payment status (1, 2, or 3) to invoice data
        paymentStatusLabel: getPaymentStatusLabel(),
        items: items.map(item => ({
            itemName: item.itemName,
            hsnCode: item.hsnCode,
            quantity: item.qty,
            rate: item.rate,
            amount: item.amount,
            gstPercent: gstPercent
        })),
        subtotal: subtotal,
        totalGST: totalGST,
        grandTotal: grandTotal,
        cgstPercent: gstPercent / 2,
        sgstPercent: gstPercent / 2,
        cgstAmount: totalGST / 2,
        sgstAmount: totalGST / 2
    };

    const handleSaveInvoice = async () => {
        if (!selectedParty) {
            setSnackbar({ open: true, message: 'Please select a party', severity: 'error' });
            return;
        }

        if (items.length === 0) {
            setSnackbar({ open: true, message: 'Please add at least one item', severity: 'error' });
            return;
        }

        const invalidItems = items.filter(item => !item.qty || item.qty <= 0);
        if (invalidItems.length > 0) {
            setSnackbar({ open: true, message: 'Please enter quantity for all items', severity: 'error' });
            return;
        }

        const saveData = {
            invoiceNo: invoiceNumber,
            invoiceDate: invoiceDate,
            partyId: selectedParty.id,
            partyName: selectedParty.partyName,
            partyAddress: selectedParty.address || '',
            partyCity: selectedParty.city || '',
            partyState: selectedParty.state || '',
            partyPinCode: selectedParty.pinCode || '',
            partyGSTIN: selectedParty.gstin || '',
            subtotal: subtotal,
            gstPercent: gstPercent,
            totalGST: totalGST,
            grandTotal: grandTotal,
            paymentStatus: paymentStatus, // Save payment status (1, 2, or 3)
            notes: '',
            details: items.map(item => ({
                itemId: item.itemId,
                itemName: item.itemName,
                hsnCode: item.hsnCode,
                quantity: item.qty,
                rate: item.rate,
                amount: item.amount
            }))
        };

        setSaving(true);
        try {
            const result = await dispatch(saveInvoice(saveData)).unwrap();
            if (result && result.success) {
                setSnackbar({ open: true, message: 'Invoice saved successfully!', severity: 'success' });
                dispatch(clearItems());
                // Reset form after successful save
                handleResetForm();
                // Reset payment status to default (3 = Not Paid)
                setPaymentStatus(3);
                // Generate new invoice number for next invoice
                setTimeout(() => {
                    setInvoiceNumber(generateInvoiceNumber());
                    setInvoiceDate(new Date().toISOString().split('T')[0]);
                }, 500);
            } else {
                setSnackbar({ open: true, message: result?.message || 'Failed to save invoice', severity: 'error' });
            }
        } catch (error) {
            console.error('Save error:', error);
            setSnackbar({ open: true, message: error?.message || 'Error saving invoice', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const isPartySelected = () => selectedParty !== null && selectedParty !== undefined;
    const hasItems = () => items.length > 0;
    const areItemsValid = () => items.every(item => item.itemId && item.qty > 0 && item.rate > 0 && item.itemName);
    const validForm = isPartySelected() && hasItems() && areItemsValid();

    return (
        <>
            <Box p={3}>
                <InvoiceHeader
                    onInvoiceNoChange={handleInvoiceNoChange}
                    onInvoiceDateChange={handleInvoiceDateChange}
                    initialInvoiceNo={invoiceNumber}
                    initialInvoiceDate={invoiceDate}
                    resetForm={resetFormFlag}
                />
                <InvoiceItemsTable resetForm={resetFormFlag} />

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3, gap: 2 }}>
                    <InvoiceSummary
                        items={items}
                        gstPercent={gstPercent}
                        onGSTChange={handleGSTChange}
                    />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2, gap: 2 }}>
                    <Button variant="outlined" onClick={() => navigate('/invoices')} sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button variant="outlined" onClick={() => setPdfOpen(true)} startIcon={<PdfIcon />} disabled={!hasItems()} sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
                        Preview PDF
                    </Button>

                    {/* Payment Status Dropdown Button */}
                    <Button
                        variant="outlined"
                        onClick={handlePaymentStatusClick}
                        disabled={!hasItems()}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                        endIcon={<ArrowDropDownIcon />}
                        startIcon={<PaymentIcon />}
                    >
                        Payment: {getPaymentStatusLabel()}
                    </Button>

                    <Menu
                        anchorEl={anchorEl}
                        open={paymentMenuOpen}
                        onClose={() => handlePaymentStatusClose()}
                    >
                        <MenuItem onClick={() => handlePaymentStatusClose(1)}>
                            <Chip label="Paid" size="small" color="success" sx={{ mr: 1 }} />
                            Paid (1)
                        </MenuItem>
                        <MenuItem onClick={() => handlePaymentStatusClose(2)}>
                            <Chip label="Partially Paid" size="small" color="warning" sx={{ mr: 1 }} />
                            Partially Paid (2)
                        </MenuItem>
                        <MenuItem onClick={() => handlePaymentStatusClose(3)}>
                            <Chip label="Not Paid" size="small" color="error" sx={{ mr: 1 }} />
                            Not Paid (3)
                        </MenuItem>
                    </Menu>

                    <Button variant="contained" onClick={handleSaveInvoice} disabled={saving || !validForm} sx={{ fontSize: '0.75rem', textTransform: 'none' }}>
                        {saving ? <CircularProgress size={20} /> : 'Save Invoice'}
                    </Button>
                </Box>

                {/* Display selected payment status */}
                {hasItems() && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                        <Chip
                            label={`Payment Status: ${getPaymentStatusLabel()} (${paymentStatus})`}
                            color={getPaymentStatusColor()}
                            size="small"
                            icon={<PaymentIcon />}
                        />
                    </Box>
                )}

                {!isPartySelected() && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>Please select a party</Alert>
                    </Box>
                )}
                {isPartySelected() && !hasItems() && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>Please add at least one item</Alert>
                    </Box>
                )}
                {hasItems() && !areItemsValid() && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>Please enter valid quantity for all items</Alert>
                    </Box>
                )}

                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
                    <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>{snackbar.message}</Alert>
                </Snackbar>
            </Box>

            <InvoicePDFViewer open={pdfOpen} onClose={() => setPdfOpen(false)} invoiceData={invoiceData} />
        </>
    );
}