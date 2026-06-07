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
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(fetchItemMaster());
    }, [dispatch]);

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    // Prepare invoice data for PDF
    const invoiceData = {
        gstin: billingData?.gstin || "05AOSPA8862Q2Z2",
        mobile: billingData?.mobileNumber || "9358001015",
        companyName: billingData?.companyName || "DHANRAJ CITY DEVELOPERS",
        address: billingData?.address || "C-19, Clement Town, Turner Road, Dehradun-248002",
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
            gstPercent: item.gst || 18
        })),
        subtotal: calculations.subtotal,
        totalGST: calculations.totalGST,
        grandTotal: calculations.grandTotal,
        cgstPercent: 9,
        sgstPercent: 9,
        cgstAmount: calculations.totalGST / 2,
        sgstAmount: calculations.totalGST / 2
    };

    const handleSaveInvoice = async () => {
        // Validate invoice data
        if (!selectedParty) {
            setSnackbar({ open: true, message: 'Please select a party', severity: 'error' });
            return;
        }

        if (items.length === 0) {
            setSnackbar({ open: true, message: 'Please add at least one item', severity: 'error' });
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
            totalGST: calculations.totalGST,
            grandTotal: calculations.grandTotal,
            notes: '',
            details: items.map(item => ({
                itemId: item.itemId,
                itemName: item.itemName,
                hsnCode: item.hsnCode,
                quantity: item.qty,
                rate: item.rate,
                amount: item.amount,
                gstPercent: item.gst || 18,
                gstAmount: (item.amount * (item.gst || 18)) / 100
            }))
        };

        setSaving(true);
        try {
            const result = await dispatch(saveInvoice(saveData)).unwrap();
            debugger;
            if (result && result.success) {
                setSnackbar({ open: true, message: 'Invoice saved successfully!', severity: 'success' });
                // Clear items after successful save
                dispatch(clearItems());
                // Navigate to invoice list or reset form
                setTimeout(() => {
                    navigate('/invoices');
                }, 2000);
            } else {
                setSnackbar({ open: true, message: 'Failed to save invoice', severity: 'error' });
            }
        } catch (error) {
            setSnackbar({ open: true, message: error?.message || 'Error saving invoice', severity: 'error' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <>
            <Box p={3}>
                <InvoiceHeader />
                <InvoiceItemsTable />

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
                        totalGST={calculations.totalGST}
                        total={calculations.grandTotal}
                        itemsCount={calculations.itemsCount}
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
                        onClick={() => navigate('/invoices')}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="outlined"
                        onClick={() => setPdfOpen(true)}
                        startIcon={<PdfIcon />}
                        size="small"
                        sx={{ fontSize: '0.7rem', textTransform: 'none' }}
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
                        disabled={saving}
                        sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                    >
                        {saving ? <CircularProgress size={20} /> : 'Save Invoice'}
                    </Button>
                </Box>

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