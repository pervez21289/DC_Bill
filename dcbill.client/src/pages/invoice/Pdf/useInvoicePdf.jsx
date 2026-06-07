// hooks/useInvoicePdf.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { pdf } from '@react-pdf/renderer';
import { fetchInvoiceById } from './../../../store/invoiceSlice';
import { InvoicePDF } from './InvoicePDF';

export const useInvoicePdf = (billingData) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [pdfData, setPdfData] = useState(null);

    // Prepare invoice data for PDF
    const prepareInvoiceData = (invoice) => {
        if (!invoice) return null;

        // Debug: Log billingData to see what's coming
        console.log('billingData in useInvoicePdf:', billingData);

        const gstPercent = invoice.gstPercent || 18;
        const totalGST = invoice.totalGST || (invoice.subtotal * gstPercent) / 100;

        // Get values with fallbacks
        const gstin = billingData?.gstin || '';
        const mobile = billingData?.mobileNumber || '';
        const companyName = billingData?.companyName || '';
        const address = billingData?.address || '';

        console.log('GSTIN being passed:', gstin);
        console.log('Mobile being passed:', mobile);

        return {
            // Company Details
            gstin: gstin,
            mobile: mobile,
            companyName: companyName,
            address: address,
            city: billingData?.city || "",
            pinCode: billingData?.pinCode || "",
            state: billingData?.state || "",

            // Invoice Details
            invoiceDate: invoice.invoiceDate,
            invoiceNo: invoice.invoiceNo,

            // Party Details
            partyName: invoice.partyName,
            partyAddress: invoice.partyAddress || "",
            partyCity: invoice.partyCity || "",
            partyPinCode: invoice.partyPinCode || "",
            partyState: invoice.partyState || "",
            partyGstin: invoice.partyGSTIN || "",

            // Items
            items: invoice.details?.map(item => ({
                itemName: item.itemName,
                hsnCode: item.hsnCode,
                quantity: item.quantity,
                rate: item.rate,
                amount: item.amount,
                gstPercent: gstPercent
            })) || [],

            // Financials
            subtotal: invoice.subtotal,
            totalGST: totalGST,
            grandTotal: invoice.grandTotal,
            gstPercent: gstPercent,

            // Always show CGST and SGST
            cgstPercent: gstPercent / 2,
            sgstPercent: gstPercent / 2,
            cgstAmount: totalGST / 2,
            sgstAmount: totalGST / 2
        };
    };

    // Generate PDF blob for download
    const generatePdfBlob = async (invoice) => {
        setIsLoading(true);
        try {
            const invoiceData = prepareInvoiceData(invoice);
            if (!invoiceData) return null;

            // Debug: Log final PDF data
            console.log('Final PDF Data:', invoiceData);

            const blob = await pdf(<InvoicePDF invoiceData={invoiceData} />).toBlob();
            return blob;
        } catch (error) {
            console.error('Error generating PDF:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Download PDF directly
    const downloadPdf = async (invoice, fileName = `Invoice_${invoice.invoiceNo}.pdf`) => {
        const blob = await generatePdfBlob(invoice);
        if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            return true;
        }
        return false;
    };

    // Fetch invoice and download PDF (for grid usage)
    const downloadInvoicePdf = async (invoiceId, invoiceNo) => {
        setIsLoading(true);
        try {
            const result = await dispatch(fetchInvoiceById(invoiceId)).unwrap();
            if (result && result.success) {
                const invoice = result.data || result;
                const success = await downloadPdf(invoice, `Invoice_${invoiceNo}.pdf`);
                return success;
            }
            return false;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // Get PDF data for preview
    const getPdfData = async (invoice) => {
        setIsLoading(true);
        try {
            const invoiceData = prepareInvoiceData(invoice);
            setPdfData(invoiceData);
            return invoiceData;
        } catch (error) {
            console.error('Error preparing PDF data:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch invoice and get PDF data
    const fetchAndGetPdfData = async (invoiceId) => {
        setIsLoading(true);
        try {
            const result = await dispatch(fetchInvoiceById(invoiceId)).unwrap();
            if (result && result.success) {
                const invoice = result.data || result;
                const invoiceData = prepareInvoiceData(invoice);
                setPdfData(invoiceData);
                return invoiceData;
            }
            return null;
        } catch (error) {
            console.error('Error fetching invoice:', error);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        pdfData,
        downloadPdf,
        downloadInvoicePdf,
        getPdfData,
        fetchAndGetPdfData,
        prepareInvoiceData
    };
};