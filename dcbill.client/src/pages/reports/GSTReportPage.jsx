import React from 'react';
import { Box } from '@mui/material';
import GSTReportContainer from 'components/reports';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { selectGSTReport } from 'store/reportSlice';

// ==============================|| GST REPORT PAGE ||============================== //

export default function GSTReportPage() {
    const gstReport = useSelector(selectGSTReport);

    // Export to Excel
    const handleExportExcel = () => {
        if (!gstReport?.invoices?.length) return;

        const data = gstReport.invoices.map((invoice, index) => ({
            'S.No': index + 1,
            'Invoice No': invoice.invoiceNumber,
            'Date': format(new Date(invoice.invoiceDate), 'dd/MM/yyyy'),
            'Party': invoice.partyName,
            'GSTIN': invoice.partyGstin || '-',
            'State': invoice.partyState || '-',
            'Taxable Value': invoice.taxableAmount?.toFixed(2) || '0.00',
            'CGST': invoice.cgstAmount?.toFixed(2) || '0.00',
            'SGST': invoice.sgstAmount?.toFixed(2) || '0.00',
            'IGST': invoice.igstAmount?.toFixed(2) || '0.00',
            'Total GST': ((invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.igstAmount || 0)).toFixed(2),
            'Total Amount': invoice.totalAmount?.toFixed(2) || '0.00',
            'Payment Status': invoice.paymentStatus === 1 ? 'Paid' : invoice.paymentStatus === 2 ? 'Partial' : 'Not Paid'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'GST Report');
        XLSX.writeFile(wb, `GST_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.xlsx`);
    };

    // Export to PDF
    const handleExportPDF = () => {
        if (!gstReport?.invoices?.length) return;

        const doc = new jsPDF('landscape', 'mm', 'a4');

        // Title
        doc.setFontSize(18);
        doc.setFont(undefined, 'bold');
        doc.text('GST Report', 14, 15);

        // Date range
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`Generated on: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 14, 22);

        // Company info
        if (gstReport?.companyName) {
            doc.setFontSize(9);
            doc.text(`Company: ${gstReport.companyName}`, 14, 28);
            doc.text(`GSTIN: ${gstReport.companyGSTIN || 'N/A'}`, 14, 33);
        }

        // Summary
        if (gstReport?.summary) {
            doc.setFontSize(10);
            doc.setFont(undefined, 'bold');
            doc.text('Summary', 14, 40);
            doc.setFont(undefined, 'normal');
            doc.setFontSize(9);
            doc.text(`Total Invoices: ${gstReport.summary.totalInvoices}`, 14, 46);
            doc.text(`Total Taxable: ₹${gstReport.summary.totalTaxableAmount?.toFixed(2) || '0.00'}`, 14, 51);
            doc.text(`Total CGST: ₹${gstReport.summary.totalCGST?.toFixed(2) || '0.00'}`, 14, 56);
            doc.text(`Total SGST: ₹${gstReport.summary.totalSGST?.toFixed(2) || '0.00'}`, 14, 61);
            doc.text(`Total IGST: ₹${gstReport.summary.totalIGST?.toFixed(2) || '0.00'}`, 14, 66);
            doc.text(`Total GST: ₹${gstReport.summary.totalGST?.toFixed(2) || '0.00'}`, 14, 71);
            doc.text(`Grand Total: ₹${gstReport.summary.grandTotal?.toFixed(2) || '0.00'}`, 14, 76);
        }

        // Table
        const tableData = gstReport.invoices.map((invoice, index) => [
            index + 1,
            invoice.invoiceNumber,
            format(new Date(invoice.invoiceDate), 'dd/MM/yyyy'),
            invoice.partyName,
            invoice.partyGstin || '-',
            invoice.partyState || '-',
            invoice.taxableAmount?.toFixed(2) || '0.00',
            invoice.cgstAmount?.toFixed(2) || '0.00',
            invoice.sgstAmount?.toFixed(2) || '0.00',
            invoice.igstAmount?.toFixed(2) || '0.00',
            ((invoice.cgstAmount || 0) + (invoice.sgstAmount || 0) + (invoice.igstAmount || 0)).toFixed(2),
            invoice.totalAmount?.toFixed(2) || '0.00'
        ]);

        doc.autoTable({
            head: [['S.No', 'Invoice No', 'Date', 'Party', 'GSTIN', 'State', 'Taxable', 'CGST', 'SGST', 'IGST', 'Total GST', 'Total Amount']],
            body: tableData,
            startY: 85,
            margin: { left: 10, right: 10 },
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold', fontSize: 8 },
            bodyStyles: { fontSize: 7 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save(`GST_Report_${format(new Date(), 'yyyyMMdd_HHmmss')}.pdf`);
    };

    // Print handler
    const handlePrint = () => {
        window.print();
    };

    return (
        <Box>
            <GSTReportContainer 
                onExportExcel={handleExportExcel}
                onExportPDF={handleExportPDF}
                onPrint={handlePrint}
            />

        </Box>
    );
}
