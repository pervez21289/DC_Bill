// components/GSTReport/GSTReportPrintView.jsx
//
// Print/PDF-only view of the GST report. No buttons, filters, sorting, or
// pagination — just the data, laid out for paper. Trigger a PDF by mounting
// this component and calling window.print() (see integration notes at the
// bottom of this file).
import React from 'react';
import { formatCurrency } from '../../hooks/useGSTReport';

// Palette mirrors the app's MUI theme defaults so the printed report feels
// consistent with the on-screen dashboard, while staying light enough to
// print well on plain paper / render cleanly as PDF.
const COLORS = {
    primary: '#1976d2',
    primaryDark: '#0d47a1',
    primaryTint: '#e8f1fb',
    success: '#2e7d32',
    successTint: '#eaf6ec',
    warning: '#ed6c02',
    warningTint: '#fdf1e6',
    error: '#d32f2f',
    errorTint: '#fbeaea',
    info: '#0288d1',
    infoTint: '#e6f5fb',
    ink: '#1a1f27',
    subtle: '#5f6b7a',
    border: '#dde3ea',
    borderStrong: '#c3cbd6',
    rowAlt: '#f8fafc',
};

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

const Section = ({ title, count, children }) => (
    <section className="print-section">
        {title && (
            <div className="print-section-head">
                <span className="print-section-bar" />
                <h2 className="print-section-title">{title}</h2>
                {typeof count === 'number' && <span className="print-section-count">{count}</span>}
            </div>
        )}
        {children}
    </section>
);

const StatCard = ({ label, value, accent, subtitle }) => (
    <div className="stat-card" style={{ borderLeftColor: accent }}>
        <div className="stat-label">{label}</div>
        <div className="stat-value" style={{ color: accent }}>{value}</div>
        {subtitle && <div className="stat-subtitle">{subtitle}</div>}
    </div>
);

const StatusBadge = ({ label, value, tint, color }) => (
    <div className="status-badge" style={{ background: tint, color, borderColor: color + '55' }}>
        <span className="status-badge-value">{value}</span>
        <span className="status-badge-label">{label}</span>
    </div>
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
                * { box-sizing: border-box; }
                .gst-print-view {
                    font-family: 'Segoe UI', Arial, Helvetica, sans-serif;
                    color: ${COLORS.ink};
                    background: #fff;
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 0 0 32px 0;
                    font-size: 12px;
                    line-height: 1.4;
                }

                /* Top accent bar */
                .print-topbar {
                    height: 6px;
                    background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.primaryDark});
                    margin-bottom: 22px;
                }

                /* Header */
                .print-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    padding: 0 28px 16px 28px;
                    border-bottom: 2px solid ${COLORS.ink};
                    margin-bottom: 20px;
                }
                .print-company-name {
                    font-size: 20px;
                    font-weight: 800;
                    letter-spacing: 0.2px;
                    margin: 0 0 4px 0;
                    color: ${COLORS.ink};
                }
                .print-company-meta {
                    font-size: 11px;
                    color: ${COLORS.subtle};
                    margin: 2px 0;
                }
                .print-company-meta b { color: ${COLORS.ink}; font-weight: 600; }
                .print-report-title {
                    text-align: right;
                    flex-shrink: 0;
                    padding-left: 24px;
                }
                .print-report-title .eyebrow {
                    font-size: 9.5px;
                    font-weight: 700;
                    letter-spacing: 1.4px;
                    color: ${COLORS.primary};
                    text-transform: uppercase;
                }
                .print-report-title h1 {
                    font-size: 22px;
                    font-weight: 800;
                    margin: 2px 0 8px 0;
                    color: ${COLORS.ink};
                }
                .print-report-title .period {
                    display: inline-block;
                    font-size: 11px;
                    font-weight: 600;
                    color: ${COLORS.primaryDark};
                    background: ${COLORS.primaryTint};
                    border: 1px solid ${COLORS.primary}33;
                    border-radius: 20px;
                    padding: 4px 12px;
                }

                .print-body { padding: 0 28px; }

                .print-section {
                    margin-bottom: 26px;
                    break-inside: avoid;
                }
                .print-section-head {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    margin: 0 0 10px 0;
                }
                .print-section-bar {
                    width: 4px;
                    height: 16px;
                    background: ${COLORS.primary};
                    border-radius: 2px;
                    display: inline-block;
                }
                .print-section-title {
                    font-size: 13.5px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.6px;
                    margin: 0;
                    color: ${COLORS.ink};
                }
                .print-section-count {
                    font-size: 10px;
                    font-weight: 700;
                    color: ${COLORS.primaryDark};
                    background: ${COLORS.primaryTint};
                    border-radius: 20px;
                    padding: 2px 9px;
                    margin-left: 2px;
                }

                /* Summary stat cards */
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 10px;
                    margin-bottom: 12px;
                }
                .stat-card {
                    border: 1px solid ${COLORS.border};
                    border-left: 3px solid ${COLORS.primary};
                    border-radius: 6px;
                    padding: 9px 12px;
                    background: #fff;
                }
                .stat-label {
                    font-size: 9px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: ${COLORS.subtle};
                }
                .stat-value {
                    font-size: 16px;
                    font-weight: 800;
                    margin-top: 3px;
                }
                .stat-subtitle {
                    font-size: 9px;
                    color: ${COLORS.subtle};
                    margin-top: 1px;
                }

                /* Payment status badges */
                .status-row {
                    display: flex;
                    gap: 10px;
                    margin-bottom: 4px;
                }
                .status-badge {
                    flex: 1;
                    border: 1px solid;
                    border-radius: 6px;
                    padding: 8px 12px;
                    display: flex;
                    align-items: baseline;
                    gap: 8px;
                }
                .status-badge-value {
                    font-size: 16px;
                    font-weight: 800;
                }
                .status-badge-label {
                    font-size: 10px;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 0.4px;
                }

                /* Tables */
                .table-wrap {
                    border: 1px solid ${COLORS.border};
                    border-radius: 8px;
                    overflow: hidden;
                }
                table.print-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 10.5px;
                }
                table.print-table th,
                table.print-table td {
                    padding: 6px 10px;
                    text-align: left;
                    white-space: nowrap;
                    border-bottom: 1px solid ${COLORS.border};
                }
                table.print-table th {
                    background: ${COLORS.primaryTint};
                    color: ${COLORS.primaryDark};
                    font-weight: 700;
                    font-size: 9.5px;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                    border-bottom: 1.5px solid ${COLORS.primary}55;
                }
                table.print-table td.num,
                table.print-table th.num {
                    text-align: right;
                    font-variant-numeric: tabular-nums;
                }
                table.print-table tbody tr:nth-child(even) {
                    background: ${COLORS.rowAlt};
                }
                table.print-table tbody tr:last-child td {
                    border-bottom: none;
                }
                table.print-table tfoot td {
                    font-weight: 700;
                    background: ${COLORS.primaryTint};
                    color: ${COLORS.primaryDark};
                    border-top: 1.5px solid ${COLORS.primary}55;
                    border-bottom: none;
                }
                .cell-primary { font-weight: 600; color: ${COLORS.ink}; }
                .cell-muted { color: ${COLORS.subtle}; }
                .mono { font-family: 'Consolas', 'Courier New', monospace; font-size: 10px; }

                .chip {
                    display: inline-block;
                    font-size: 9px;
                    font-weight: 700;
                    padding: 2px 8px;
                    border-radius: 20px;
                    border: 1px solid;
                    text-transform: uppercase;
                    letter-spacing: 0.3px;
                }

                .print-footer {
                    margin: 28px 28px 0 28px;
                    padding-top: 10px;
                    border-top: 1px solid ${COLORS.border};
                    font-size: 9.5px;
                    color: ${COLORS.subtle};
                    display: flex;
                    justify-content: space-between;
                }

                @media print {
                    @page {
                        size: A4 landscape;
                        margin: 10mm 12mm;
                    }
                    .gst-print-view { padding-bottom: 0; }
                    .print-topbar { margin-bottom: 18px; }
                    .table-wrap { border-radius: 0; }
                    table.print-table { page-break-inside: auto; }
                    table.print-table tr { page-break-inside: avoid; }
                    table.print-table thead { display: table-header-group; }
                    .print-section { break-inside: avoid; }
                    .stat-card, .status-badge { break-inside: avoid; }
                }
            `}</style>

            <div className="print-topbar" />

            {/* Header */}
            <div className="print-header">
                <div>
                    <p className="print-company-name">{company?.companyName || 'Company Name'}</p>
                    {company?.address && (
                        <p className="print-company-meta">{company.address}{company?.state ? `, ${company.state}` : ''}</p>
                    )}
                    <p className="print-company-meta"><b>GSTIN</b> {company?.gstin || '-'} &nbsp;&nbsp; <b>PAN</b> {company?.pan || '-'}</p>
                    {(company?.email || company?.phone) && (
                        <p className="print-company-meta">{company?.email}{company?.email && company?.phone ? '  •  ' : ''}{company?.phone}</p>
                    )}
                </div>
                <div className="print-report-title">
                    <div className="eyebrow">Tax Report</div>
                    <h1>GST Summary</h1>
                    {dateRange?.startDate && dateRange?.endDate && (
                        <span className="period">{formatDate(dateRange.startDate)} &ndash; {formatDate(dateRange.endDate)}</span>
                    )}
                </div>
            </div>

            <div className="print-body">
                {/* Summary */}
                {summary && (
                    <Section title="Summary">
                        <div className="summary-grid">
                            <StatCard label="Total Invoices" value={summary.totalInvoices || 0} accent={COLORS.primary} subtitle="Invoices processed" />
                            <StatCard label="Taxable Value" value={formatCurrency(summary.totalTaxableAmount || 0)} accent={COLORS.success} subtitle="Net taxable amount" />
                            <StatCard label="Total Tax" value={formatCurrency(summary.totalGST || 0)} accent={COLORS.warning} subtitle="CGST + SGST + IGST" />
                            <StatCard label="Invoice Value" value={formatCurrency(summary.grandTotal || 0)} accent={COLORS.info} subtitle="Total including tax" />
                        </div>

                        <div className="status-row">
                            <StatusBadge label="Paid" value={summary.paidInvoices || 0} tint={COLORS.successTint} color={COLORS.success} />
                            <StatusBadge label="Partial Paid" value={summary.partialInvoices || 0} tint={COLORS.warningTint} color={COLORS.warning} />
                            <StatusBadge label="Unpaid" value={summary.unpaidInvoices || 0} tint={COLORS.errorTint} color={COLORS.error} />
                            <StatusBadge label="CGST" value={formatCurrency(summary.totalCGST || 0)} tint={COLORS.infoTint} color={COLORS.info} />
                            <StatusBadge label="SGST" value={formatCurrency(summary.totalSGST || 0)} tint={COLORS.successTint} color={COLORS.success} />
                            <StatusBadge label="IGST" value={formatCurrency(summary.totalIGST || 0)} tint={COLORS.warningTint} color={COLORS.warning} />
                        </div>
                    </Section>
                )}

                {/* Invoice-wise */}
                {invoices.length > 0 && (
                    <Section title="Invoice-wise Detail" count={invoices.length}>
                        <div className="table-wrap">
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
                                            <td className="cell-primary">{row.invoiceNumber}</td>
                                            <td className="cell-muted">{formatDate(row.invoiceDate)}</td>
                                            <td>{row.partyName}</td>
                                            <td className="mono cell-muted">{row.partyGstin || '-'}</td>
                                            <td>{row.invoiceType || '-'}</td>
                                            <td className="num">{formatCurrency(row.taxableAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.cgstAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.sgstAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.igstAmount)}</td>
                                            <td className="num cell-primary">{formatCurrency(row.totalGST)}</td>
                                            <td className="num cell-primary">{formatCurrency(row.totalAmount)}</td>
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
                        </div>
                    </Section>
                )}

                {/* HSN-wise */}
                {hsnWiseSummary.length > 0 && (
                    <Section title="HSN-wise Summary" count={hsnWiseSummary.length}>
                        <div className="table-wrap">
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
                                            <td className="cell-primary mono">{row.hsnCode}</td>
                                            <td>{row.description || '-'}</td>
                                            <td className="num">{row.averageRate}%</td>
                                            <td className="num">{formatCurrency(row.taxableAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.cgstAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.sgstAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.igstAmount)}</td>
                                            <td className="num cell-primary">{formatCurrency(row.totalGST)}</td>
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
                        </div>
                    </Section>
                )}

                {/* Party-wise */}
                {partyWiseSummary.length > 0 && (
                    <Section title="Party-wise Summary" count={partyWiseSummary.length}>
                        <div className="table-wrap">
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
                                            <td className="cell-primary">{row.partyName}</td>
                                            <td className="mono cell-muted">{row.partyGstin || '-'}</td>
                                            <td>{row.partyState || '-'}</td>
                                            <td className="num">{formatCurrency(row.taxableAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.cgstAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.sgstAmount)}</td>
                                            <td className="num cell-muted">{formatCurrency(row.igstAmount)}</td>
                                            <td className="num cell-primary">{formatCurrency(row.totalGST)}</td>
                                            <td className="num cell-primary">{formatCurrency(row.totalAmount)}</td>
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
                        </div>
                    </Section>
                )}
            </div>

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

Already wired into index.jsx via:
  - a `printRef` on a hidden off-screen <div> holding <GSTReportPrintView />
  - a `handlePrint` callback that clones printRef's innerHTML into a new
    window and calls window.print()
  - `onPrint={handlePrint}` passed to GSTReportExportActions

If you'd rather generate the PDF file directly (e.g. for emailing or
server-side use) instead of relying on the browser dialog, say so and I can
add a client-side render-to-PDF path (e.g. via a headless print library) or
a server-side endpoint instead.
*/
