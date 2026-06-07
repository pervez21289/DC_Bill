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

        const companyState = billingData?.state || '';
        const partyState = invoice.partyState || '';
        const isInterState = companyState !== partyState && companyState !== '' && partyState !== '';

        const gstPercent = invoice.gstPercent || 18;
        const totalGST = invoice.totalGST || (invoice.subtotal * gstPercent) / 100;

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
            cgstPercent: isInterState ? 0 : gstPercent / 2,
            sgstPercent: isInterState ? 0 : gstPercent / 2,
            igstPercent: isInterState ? gstPercent : 0,
            cgstAmount: isInterState ? 0 : totalGST / 2,
            sgstAmount: isInterState ? 0 : totalGST / 2,
            igstAmount: isInterState ? totalGST : 0
        };
    };

    // Generate PDF blob for download
    const generatePdfBlob = async (invoice) => {
        setIsLoading(true);
        try {
            const invoiceData = prepareInvoiceData(invoice);
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

    // Get PDF data for preview (for grid and view)
    const getPdfData = async (invoice) => {
        setIsLoading(true);
        try {
            const invoiceData = prepareInvoiceData(invoice);
            setPdfData(invoiceData);
            return invoiceData;
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch invoice and get PDF data (for grid)
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