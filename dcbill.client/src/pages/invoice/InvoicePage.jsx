import { useEffect, useState } from "react";
import { Box, Button, Snackbar, Alert, CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    PictureAsPdf as PdfIcon,
    Print as PrintIcon,
    Visibility as ViewIcon
} from '@mui/icons-material';

import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import useInvoiceCalculation from "./useInvoiceCalculation";
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
    const calculations = useInvoiceCalculation(items);

    const [pdfOpen, setPdfOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [gstPercent, setGstPercent] = useState(18);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [resetForm, setResetForm] = useState(false);

    useEffect(() => {
        dispatch(fetchItemMaster());
    }, [dispatch]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Get company state from billing settings
    const companyState = billingData?.state || '';
    const partyState = selectedParty?.state || '';

    // Determine if inter-state (different states)
    const isInterState = companyState !== partyState && companyState !== '' && partyState !== '';

    // Calculate GST based on GST percent and transaction type
    const totalGST = (calculations.subtotal * gstPercent) / 100;
    const grandTotal = calculations.subtotal + totalGST;

    // Calculate CGST, SGST, IGST based on transaction type
    const cgstPercent = isInterState ? 0 : gstPercent / 2;
    const sgstPercent = isInterState ? 0 : gstPercent / 2;
    const igstPercent = isInterState ? gstPercent : 0;
    const cgstAmount = isInterState ? 0 : totalGST / 2;
    const sgstAmount = isInterState ? 0 : totalGST / 2;
    const igstAmount = isInterState ? totalGST : 0;

    const handleGSTChange = (newGSTPercent) => {
        setGstPercent(newGSTPercent);
    };

    // Validation functions
    const isPartySelected = () => {
        return selectedParty !== null && selectedParty !== undefined;
    };

    const hasItems = () => {
        return items.length > 0;
    };

    const areItemsValid = () => {
        return items.every(item =>
            item.itemId &&
            item.qty > 0 &&
            item.rate > 0 &&
            item.itemName
        );
    };

    const getValidationErrors = () => {
        const errors = [];
        if (!isPartySelected()) {
            errors.push('Please select a party');
        }
        if (!hasItems()) {
            errors.push('Please add at least one item');
        } else {
            const invalidItems = items.filter(item => !item.qty || item.qty <= 0);
            if (invalidItems.length > 0) {
                errors.push('Please enter valid quantity for all items');
            }
        }
        return errors;
    };

    const isFormValid = () => {
        return isPartySelected() && hasItems() && areItemsValid();
    };

    const resetInvoiceForm = () => {
        // Clear items from the invoice
        dispatch(clearItems());
        // Clear selected party from Redux
        dispatch({ type: 'parties/clearSelectedParty' });
        // Reset GST percent to default
        setGstPercent(18);
        // Trigger reset in child components
        setResetForm(true);
        setTimeout(() => setResetForm(false), 100);
    };

    // Prepare invoice data for PDF (without default values)
    const invoiceData = {
        gstin: billingData?.gstin || '',
        mobile: billingData?.mobileNumber || '',
        companyName: billingData?.companyName || '',
        address: billingData?.address || '',
        city: billingData?.city || "",
        pinCode: billingData?.pinCode || "",
        state: billingData?.state || "",
        invoiceDate: new Date().toISOString().split('T')[0],
        invoiceNo: `INV-${Date.now()}`,
        partyName: selectedParty?.partyName || "",
        partyAddress: selectedParty?.address || "",
        partyCity: selectedParty?.city || "",
        partyPinCode: selectedParty?.pinCode || "",
        partyState: selectedParty?.state || "",
        partyGstin: selectedParty?.gstin || "",
        items: items.map(item => ({
            itemName: item.itemName,
            hsnCode: item.hsnCode,
            quantity: item.qty,
            rate: item.rate,
            amount: item.amount,
            gstPercent: gstPercent
        })),
        subtotal: calculations.subtotal,
        totalGST: totalGST,
        grandTotal: grandTotal,
        isInterState: isInterState,
        cgstPercent: cgstPercent,
        sgstPercent: sgstPercent,
        igstPercent: igstPercent,
        cgstAmount: cgstAmount,
        sgstAmount: sgstAmount,
        igstAmount: igstAmount
    };

    const handleSaveInvoice = async () => {
        // Validate invoice data
        const errors = getValidationErrors();
        if (errors.length > 0) {
            setSnackbar({ open: true, message: errors.join('. '), severity: 'error' });
            return;
        }

        // Validate each item has quantity > 0
        const invalidItems = items.filter(item => !item.qty || item.qty <= 0);
        if (invalidItems.length > 0) {
            setSnackbar({ open: true, message: 'Please enter quantity for all items', severity: 'error' });
            return;
        }

        // Prepare invoice data for API
        const saveData = {
            invoiceNo: `INV-${Date.now()}`,
            invoiceDate: new Date().toISOString().split('T')[0],
            partyId: selectedParty.id,
            partyName: selectedParty.partyName,
            partyAddress: selectedParty.address || '',
            partyCity: selectedParty.city || '',
            partyState: selectedParty.state || '',
            partyPinCode: selectedParty.pinCode || '',
            partyGSTIN: selectedParty.gstin || '',
            subtotal: calculations.subtotal,
            gstPercent: gstPercent,
            totalGST: totalGST,
            grandTotal: grandTotal,
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
                // Reset the form after successful save
                resetInvoiceForm();
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

    const handleNewInvoice = () => {
        resetInvoiceForm();
        setSnackbar({ open: true, message: 'Form reset. You can create a new invoice', severity: 'info' });
    };

    // Check if form is valid to enable save button
    const validForm = isFormValid();

    return (
        <>
            <Box p={3}>
                <InvoiceHeader resetForm={resetForm} />
                <InvoiceItemsTable resetForm={resetForm} />

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 3,
                        gap: 2
                    }}
                >
                    <InvoiceSummary
                        subtotal={calculations.subtotal}
                        totalGST={totalGST}
                        total={grandTotal}
                        itemsCount={calculations.itemsCount}
                        gstPercent={gstPercent}
                        onGSTChange={handleGSTChange}
                        isInterState={isInterState}
                    />
                </Box>

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "flex-end",
                        mt: 2,
                        gap: 2
                    }}
                >
                    <Button
                        variant="outlined"
                        onClick={handleNewInvoice}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                        disabled={saving}
                    >
                        New Invoice
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setPdfOpen(true)}
                        startIcon={<PdfIcon />}
                        size="small"
                        sx={{ fontSize: '0.7rem', textTransform: 'none' }}
                        disabled={!hasItems()}
                    >
                        Preview PDF
                    </Button>

                    <InvoicePDFDownload
                        invoiceData={invoiceData}
                        buttonText="Download PDF"
                    />

                    <Button
                        variant="contained"
                        onClick={handleSaveInvoice}
                        disabled={saving || !validForm}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                    >
                        {saving ? <CircularProgress size={20} /> : 'Save Invoice'}
                    </Button>
                </Box>

                {/* Show validation warnings */}
                {!isPartySelected() && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
                            Please select a party
                        </Alert>
                    </Box>
                )}

                {isPartySelected() && !hasItems() && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
                            Please add at least one item
                        </Alert>
                    </Box>
                )}

                {hasItems() && !areItemsValid() && (
                    <Box sx={{ mt: 2, p: 1, bgcolor: '#fff3e0', borderRadius: 1 }}>
                        <Alert severity="warning" sx={{ fontSize: '0.75rem' }}>
                            Please enter valid quantity for all items
                        </Alert>
                    </Box>
                )}

                <Snackbar
                    open={snackbar.open}
                    autoHideDuration={6000}
                    onClose={handleCloseSnackbar}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                >
                    <Alert severity={snackbar.severity} onClose={handleCloseSnackbar}>
                        {snackbar.message}
                    </Alert>
                </Snackbar>
            </Box>

            {/* PDF Viewer Modal */}
            <InvoicePDFViewer
                open={pdfOpen}
                onClose={() => setPdfOpen(false)}
                invoiceData={invoiceData}
            />
        </>
    );
}