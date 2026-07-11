// components/GSTReport/GSTReportPrintView.jsx
//
// Print/PDF-only view of the GST report. No buttons, filters, sorting, or
// pagination — just the data, laid out for paper. Trigger a PDF by mounting
// this component and calling window.print() (see integration notes at the
// bottom of this file).
import React from 'react';
import { formatCurrency } from '../../hooks/useGSTReport';

const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

const sumBy = (rows, field) =>
    (rows || []).reduce((acc, row) => acc + (Number(row[field]) || 0), 0);

const Section = ({ title, children }) => (
    <section className="print-section">
        {title && <h2 className="print-section-title">{title}</h2>}
        {children}
    </section>
);

const GSTReportPrintView = ({
    company,
    summary,
    invoices = [],
    hsnWiseSummary = [],
    partyWiseSummary = [],
    dateRange,
}) => {
    const invoiceTotals = {
        taxableAmount: sumBy(invoices, 'taxableAmount'),
        cgstAmount: sumBy(invoices, 'cgstAmount'),
        sgstAmount: sumBy(invoices, 'sgstAmount'),
        igstAmount: sumBy(invoices, 'igstAmount'),
        totalGST: sumBy(invoices, 'totalGST'),
        totalAmount: sumBy(invoices, 'totalAmount'),
    };

    const hsnTotals = {
        taxableAmount: sumBy(hsnWiseSummary, 'taxableAmount'),
        cgstAmount: sumBy(hsnWiseSummary, 'cgstAmount'),
        sgstAmount: sumBy(hsnWiseSummary, 'sgstAmount'),
        igstAmount: sumBy(hsnWiseSummary, 'igstAmount'),
        totalGST: sumBy(hsnWiseSummary, 'totalGST'),
    };

    const partyTotals = {
        taxableAmount: sumBy(partyWiseSummary, 'taxableAmount'),
        cgstAmount: sumBy(partyWiseSummary, 'cgstAmount'),
        sgstAmount: sumBy(partyWiseSummary, 'sgstAmount'),
        igstAmount: sumBy(partyWiseSummary, 'igstAmount'),
        totalGST: sumBy(partyWiseSummary, 'totalGST'),
        totalAmount: sumBy(partyWiseSummary, 'totalAmount'),
    };

    return (
        <div className="gst-print-view">
            <style>{`
                .gst-print-view {
                    font-family: Arial, Helvetica, sans-serif;
                    color: #111;
                    background: #fff;
                    max-width: 1000px;
                    margin: 0 auto;
                    padding: 24px;
                    font-size: 12px;
                }
                .print-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    border-bottom: 2px solid #222;
                    padding-bottom: 12px;
                    margin-bottom: 16px;
                }
                .print-company-name {
                    font-size: 18px;
                    font-weight: 700;
                    margin: 0 0 2px 0;
                }
                .print-company-meta {
                    font-size: 11px;
                    color: #444;
                    margin: 1px 0;
                }
                .print-report-title {
                    text-align: right;
                }
                .print-report-title h1 {
                    font-size: 16px;
                    margin: 0 0 4px 0;
                }
                .print-report-title .period {
                    font-size: 11px;
                    color: #444;
                }
                .print-section {
                    margin-bottom: 22px;
                    break-inside: avoid;
                }
                .print-section-title {
                    font-size: 13px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                    border-bottom: 1px solid #999;
                    padding-bottom: 4px;
                    margin: 0 0 8px 0;
                }
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 8px;
                }
                .summary-cell {
                    border: 1px solid #ccc;
                    padding: 6px 8px;
                }
                .summary-cell .label {
                    font-size: 9px;
                    text-transform: uppercase;
                    color: #666;
                    letter-spacing: 0.3px;
                }
                .summary-cell .value {
                    font-size: 13px;
                    font-weight: 700;
                    margin-top: 2px;
                }
                table.print-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10.5px;
                }
                table.print-table th,
                table.print-table td {
                    border: 1px solid #ccc;
                    padding: 4px 6px;
                    text-align: left;
                    white-space: nowrap;
                }
                table.print-table th {
                    background: #f2f2f2;
                    font-weight: 700;
                    font-size: 9.5px;
                    text-transform: uppercase;
                }
                table.print-table td.num,
                table.print-table th.num {
                    text-align: right;
                }
                table.print-table tfoot td {
                    font-weight: 700;
                    background: #f7f7f7;
                }
                table.print-table tbody tr:nth-child(even) {
                    background: #fafafa;
                }
                .print-footer {
                    margin-top: 24px;
                    padding-top: 8px;
                    border-top: 1px solid #ccc;
                    font-size: 9.5px;
                    color: #666;
                    display: flex;
                    justify-content: space-between;
                }

                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 12mm;
                    }
                    .gst-print-view {
                        padding: 0;
                        max-width: none;
                    }
                    table.print-table {
                        page-break-inside: auto;
                    }
                    table.print-table tr {
                        page-break-inside: avoid;
                    }
                    table.print-table thead {
                        display: table-header-group;
                    }
                }
            `}</style>

            {/* Header */}
            <div className="print-header">
                <div>
                    <p className="print-company-name">{company?.companyName || 'Company Name'}</p>
                    {company?.address && <p className="print-company-meta">{company.address}{company?.state ? `, ${company.state}` : ''}</p>}
                    <p className="print-company-meta">GSTIN: {company?.gstin || '-'} &nbsp;|&nbsp; PAN: {company?.pan || '-'}</p>
                    {company?.email && <p className="print-company-meta">{company.email}{company?.phone ? ` | ${company.phone}` : ''}</p>}
                </div>
                <div className="print-report-title">
                    <h1>GST Report</h1>
                    {dateRange?.startDate && dateRange?.endDate && (
                        <p className="period">
                            {formatDate(dateRange.startDate)} &ndash; {formatDate(dateRange.endDate)}
                        </p>
                    )}
                </div>
            </div>

            {/* Summary */}
            {summary && (
                <Section title="Summary">
                    <div className="summary-grid">
                        <div className="summary-cell">
                            <div className="label">Total Invoices</div>
                            <div className="value">{summary.totalInvoices || 0}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">Taxable Value</div>
                            <div className="value">{formatCurrency(summary.totalTaxableAmount || 0)}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">Total Tax</div>
                            <div className="value">{formatCurrency(summary.totalGST || 0)}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">Invoice Value</div>
                            <div className="value">{formatCurrency(summary.grandTotal || 0)}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">Paid</div>
                            <div className="value">{summary.paidInvoices || 0}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">Partial Paid</div>
                            <div className="value">{summary.partialInvoices || 0}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">Unpaid</div>
                            <div className="value">{summary.unpaidInvoices || 0}</div>
                        </div>
                        <div className="summary-cell">
                            <div className="label">CGST / SGST / IGST</div>
                            <div className="value" style={{ fontSize: 11 }}>
                                {formatCurrency(summary.totalCGST || 0)} / {formatCurrency(summary.totalSGST || 0)} / {formatCurrency(summary.totalIGST || 0)}
                            </div>
                        </div>
                    </div>
                </Section>
            )}

            {/* Invoice-wise */}
            {invoices.length > 0 && (
                <Section title={`Invoice-wise Detail (${invoices.length})`}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Invoice No.</th>
                                <th>Date</th>
                                <th>Party Name</th>
                                <th>Party GSTIN</th>
                                <th>Type</th>
                                <th className="num">Taxable</th>
                                <th className="num">CGST</th>
                                <th className="num">SGST</th>
                                <th className="num">IGST</th>
                                <th className="num">Total Tax</th>
                                <th className="num">Invoice Value</th>
                                <th>Payment</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((row, i) => (
                                <tr key={row.invoiceId || i}>
                                    <td>{row.invoiceNumber}</td>
                                    <td>{formatDate(row.invoiceDate)}</td>
                                    <td>{row.partyName}</td>
                                    <td>{row.partyGstin || '-'}</td>
                                    <td>{row.invoiceType || '-'}</td>
                                    <td className="num">{formatCurrency(row.taxableAmount)}</td>
                                    <td className="num">{formatCurrency(row.cgstAmount)}</td>
                                    <td className="num">{formatCurrency(row.sgstAmount)}</td>
                                    <td className="num">{formatCurrency(row.igstAmount)}</td>
                                    <td className="num">{formatCurrency(row.totalGST)}</td>
                                    <td className="num">{formatCurrency(row.totalAmount)}</td>
                                    <td>{row.paymentStatus ?? '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5}>Grand Total</td>
                                <td className="num">{formatCurrency(invoiceTotals.taxableAmount)}</td>
                                <td className="num">{formatCurrency(invoiceTotals.cgstAmount)}</td>
                                <td className="num">{formatCurrency(invoiceTotals.sgstAmount)}</td>
                                <td className="num">{formatCurrency(invoiceTotals.igstAmount)}</td>
                                <td className="num">{formatCurrency(invoiceTotals.totalGST)}</td>
                                <td className="num">{formatCurrency(invoiceTotals.totalAmount)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </Section>
            )}

            {/* HSN-wise */}
            {hsnWiseSummary.length > 0 && (
                <Section title={`HSN-wise Summary (${hsnWiseSummary.length})`}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>HSN Code</th>
                                <th>Description</th>
                                <th className="num">Avg Rate (%)</th>
                                <th className="num">Taxable Value</th>
                                <th className="num">CGST</th>
                                <th className="num">SGST</th>
                                <th className="num">IGST</th>
                                <th className="num">Total Tax</th>
                                <th className="num">Qty</th>
                                <th className="num">Invoices</th>
                            </tr>
                        </thead>
                        <tbody>
                            {hsnWiseSummary.map((row, i) => (
                                <tr key={row.hsnCode || i}>
                                    <td>{row.hsnCode}</td>
                                    <td>{row.description || '-'}</td>
                                    <td className="num">{row.averageRate}%</td>
                                    <td className="num">{formatCurrency(row.taxableAmount)}</td>
                                    <td className="num">{formatCurrency(row.cgstAmount)}</td>
                                    <td className="num">{formatCurrency(row.sgstAmount)}</td>
                                    <td className="num">{formatCurrency(row.igstAmount)}</td>
                                    <td className="num">{formatCurrency(row.totalGST)}</td>
                                    <td className="num">{row.totalQuantity}</td>
                                    <td className="num">{row.invoiceCount}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3}>Grand Total</td>
                                <td className="num">{formatCurrency(hsnTotals.taxableAmount)}</td>
                                <td className="num">{formatCurrency(hsnTotals.cgstAmount)}</td>
                                <td className="num">{formatCurrency(hsnTotals.sgstAmount)}</td>
                                <td className="num">{formatCurrency(hsnTotals.igstAmount)}</td>
                                <td className="num">{formatCurrency(hsnTotals.totalGST)}</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </Section>
            )}

            {/* Party-wise */}
            {partyWiseSummary.length > 0 && (
                <Section title={`Party-wise Summary (${partyWiseSummary.length})`}>
                    <table className="print-table">
                        <thead>
                            <tr>
                                <th>Party Name</th>
                                <th>GSTIN</th>
                                <th>State</th>
                                <th className="num">Taxable Value</th>
                                <th className="num">CGST</th>
                                <th className="num">SGST</th>
                                <th className="num">IGST</th>
                                <th className="num">Total Tax</th>
                                <th className="num">Invoice Value</th>
                                <th className="num">Invoices</th>
                            </tr>
                        </thead>
                        <tbody>
                            {partyWiseSummary.map((row, i) => (
                                <tr key={row.partyId || i}>
                                    <td>{row.partyName}</td>
                                    <td>{row.partyGstin || '-'}</td>
                                    <td>{row.partyState || '-'}</td>
                                    <td className="num">{formatCurrency(row.taxableAmount)}</td>
                                    <td className="num">{formatCurrency(row.cgstAmount)}</td>
                                    <td className="num">{formatCurrency(row.sgstAmount)}</td>
                                    <td className="num">{formatCurrency(row.igstAmount)}</td>
                                    <td className="num">{formatCurrency(row.totalGST)}</td>
                                    <td className="num">{formatCurrency(row.totalAmount)}</td>
                                    <td className="num">{row.invoiceCount}</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={3}>Grand Total</td>
                                <td className="num">{formatCurrency(partyTotals.taxableAmount)}</td>
                                <td className="num">{formatCurrency(partyTotals.cgstAmount)}</td>
                                <td className="num">{formatCurrency(partyTotals.sgstAmount)}</td>
                                <td className="num">{formatCurrency(partyTotals.igstAmount)}</td>
                                <td className="num">{formatCurrency(partyTotals.totalGST)}</td>
                                <td className="num">{formatCurrency(partyTotals.totalAmount)}</td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </Section>
            )}

            <div className="print-footer">
                <span>Generated on {new Date().toLocaleString('en-IN')}</span>
                <span>{company?.companyName}</span>
            </div>
        </div>
    );
};

export default GSTReportPrintView;

/*
INTEGRATION NOTES
==================
This component renders plain HTML (no MUI), so it prints cleanly without
sticky headers, scroll containers, or box-shadows bleeding onto paper.

Simplest wiring — no new route needed. In GSTReportContainer (index.jsx),
render this view off-screen and drive it from the existing onPrint prop:

    import GSTReportPrintView from './GSTReportPrintView';
    const printRef = useRef(null);

    const handlePrint = useCallback(() => {
        const printContents = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
            <html>
                <head><title>GST Report</title></head>
                <body>${printContents}</body>
            </html>
        `);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
        printWindow.close();
    }, []);

    // hidden off-screen, only used as a source to clone into the print window
    <div style={{ position: 'absolute', left: -9999, top: 0 }}>
        <div ref={printRef}>
            <GSTReportPrintView
                company={companyInfo}
                summary={displayData?.summary}
                invoices={sortedInvoices}        // full list, not paginatedInvoices
                hsnWiseSummary={displayData?.hsnWiseData}
                partyWiseSummary={displayData?.partyWiseData}
                dateRange={dateRange}
            />
        </div>
    </div>

Then pass handlePrint as the onPrint prop that GSTReportExportActions
already calls. The user picks "Save as PDF" in the native print dialog —
no extra PDF library needed.

If you'd rather generate the PDF file directly (e.g. for emailing or
server-side use) instead of relying on the browser dialog, say so and I can
add a client-side render-to-PDF path (e.g. via a headless print library) or
a server-side endpoint instead.
*/
