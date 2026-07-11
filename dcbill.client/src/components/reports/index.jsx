import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    Alert,
    CircularProgress,
    Container,
} from '@mui/material';
import { format } from 'date-fns';
import { fetchGSTReport, selectGSTReport, selectReportLoading, selectReportError, clearReportError } from '../../store/reportSlice';
import { fetchBillingSettings } from '../../store/billingSettingsSlice';
import GSTReportCompanyInfo from './GSTReportCompanyInfo';
import GSTReportFilters from './GSTReportFilters';
import GSTReportSummaryCards from './GSTReportSummaryCards';
import GSTReportInvoiceTable from './GSTReportInvoiceTable';
import GSTReportHSNTable from './GSTReportHSNTable';
import GSTReportPartyTable from './GSTReportPartyTable';
import GSTReportExportActions from './GSTReportExportActions';
import GSTReportPrintView from './GSTReportPrintView';

const GSTReportContainer = ({ onExportExcel, onExportPDF, onPrint }) => {
    const dispatch = useDispatch();
    const gstReport = useSelector(selectGSTReport);
    const loading = useSelector(selectReportLoading);
    const error = useSelector(selectReportError);

    // Get billing settings from Redux store
    const billingSettings = useSelector((state) => state.billingSettings?.data);
    const billingLoading = useSelector((state) => state.billingSettings?.loading);
    const billingError = useSelector((state) => state.billingSettings?.error);

    const [dateRange, setDateRange] = useState({
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        endDate: new Date()
    });
    const [activeTab, setActiveTab] = useState(0);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({ key: 'invoiceDate', direction: 'desc' });
    const [expandedRows, setExpandedRows] = useState(new Set());
    const [fetchKey, setFetchKey] = useState(0);
    const [reportData, setReportData] = useState(null);
    const [showHSN, setShowHSN] = useState(true);
    const [showParty, setShowParty] = useState(true);
    const [shouldFetch, setShouldFetch] = useState(false);

    const initialFetchDone = useRef(false);
    const isFetchingRef = useRef(false);

    // Fetch billing settings on mount
    useEffect(() => {
        if (!billingSettings && !billingLoading) {
            dispatch(fetchBillingSettings());
        }
    }, [dispatch, billingSettings, billingLoading]);

    // Calculate payment status counts from invoices
    const calculatePaymentStatus = useCallback((invoices) => {
        if (!invoices || !invoices.length) {
            return { paidInvoices: 0, partialInvoices: 0, unpaidInvoices: 0 };
        }

        let paid = 0;
        let partial = 0;
        let unpaid = 0;

        invoices.forEach(invoice => {
            const status = invoice.paymentStatus;

            // Payment status: 1 = Paid, 2 = Partial Paid, 3 = Unpaid
            if (status === 1 || status === '1' || status === 'paid' || status === 'Paid' || status === 'PAID') {
                paid++;
            } else if (status === 2 || status === '2' || status === 'partial' || status === 'Partial' || status === 'PARTIAL' || status === 'partially paid' || status === 'Partial Paid') {
                partial++;
            } else if (status === 3 || status === '3' || status === 'unpaid' || status === 'Unpaid' || status === 'UNPAID' || status === 'pending' || status === 'Pending') {
                unpaid++;
            } else {
                // Default to unpaid if status is unknown
                unpaid++;
            }
        });

        return { paidInvoices: paid, partialInvoices: partial, unpaidInvoices: unpaid };
    }, []);

    // Enhance the report data with payment status counts
    const enhanceReportData = useCallback((data) => {
        if (!data) return null;

        const enhancedData = { ...data };

        if (data.invoices && data.invoices.length > 0) {
            const paymentStats = calculatePaymentStatus(data.invoices);
            enhancedData.summary = {
                ...data.summary,
                totalInvoices: data.invoices.length,
                ...paymentStats,
            };
        } else if (data.summary) {
            // If no invoices, set to 0
            enhancedData.summary = {
                ...data.summary,
                paidInvoices: 0,
                partialInvoices: 0,
                unpaidInvoices: 0,
            };
        }

        return enhancedData;
    }, [calculatePaymentStatus]);

    // Update local state when Redux state changes
    useEffect(() => {
        if (gstReport) {
            console.log('GST Report updated in Redux:', gstReport);
            // Enhance the report data with payment status counts
            const enhancedData = enhanceReportData(gstReport);
            setReportData(enhancedData);
            setFetchKey(prev => prev + 1);
        }
    }, [gstReport, enhanceReportData]);

    // Fetch GST report
    const executeFetch = useCallback(() => {
        if (isFetchingRef.current) return;
        if (dateRange.startDate && dateRange.endDate) {
            const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
            const endDate = format(dateRange.endDate, 'yyyy-MM-dd');
            console.log('Fetching report with:', { startDate, endDate });

            isFetchingRef.current = true;
            dispatch(fetchGSTReport({ startDate, endDate }))
                .finally(() => {
                    isFetchingRef.current = false;
                    setShouldFetch(false);
                });
        }
    }, [dateRange.startDate, dateRange.endDate, dispatch]);

    // Watch for shouldFetch flag and execute fetch
    useEffect(() => {
        if (shouldFetch && !isFetchingRef.current) {
            executeFetch();
        }
    }, [shouldFetch, executeFetch]);

    // Initial fetch on mount
    useEffect(() => {
        if (!initialFetchDone.current && !loading && !isFetchingRef.current) {
            setShouldFetch(true);
            initialFetchDone.current = true;
        }
    }, [loading]);

    // Clear error on unmount
    useEffect(() => {
        return () => {
            dispatch(clearReportError());
        };
    }, [dispatch]);

    // Auto-clear error after 5 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                dispatch(clearReportError());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [error, dispatch]);

    // Handle date range change from filters
    const handleDateRangeChange = useCallback((newDateRange) => {
        console.log('Date range changed:', newDateRange);
        setDateRange(newDateRange);
        setTimeout(() => {
            setShouldFetch(true);
        }, 50);
    }, []);

    // Manual fetch for Refresh button
    const handleRefresh = useCallback(() => {
        if (!isFetchingRef.current) {
            setShouldFetch(true);
        }
    }, []);

    // Handle show/hide HSN
    const handleShowHSNChange = useCallback((value) => {
        setShowHSN(value);
    }, []);

    // Handle show/hide Party
    const handleShowPartyChange = useCallback((value) => {
        setShowParty(value);
    }, []);

    // Sorting handler
    const handleSort = useCallback((key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    // Get sorted data
    const getSortedData = useCallback((data) => {
        if (!data || !data.length) return [];
        return [...data].sort((a, b) => {
            const aVal = a[sortConfig.key];
            const bVal = b[sortConfig.key];
            if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
            if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
            return 0;
        });
    }, [sortConfig]);

    // Pagination handlers
    const handleChangePage = useCallback((event, newPage) => {
        setPage(newPage);
    }, []);

    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    }, []);

    // Toggle row expansion
    const handleRowToggle = useCallback((index) => {
        setExpandedRows(prev => {
            const next = new Set(prev);
            if (next.has(index)) {
                next.delete(index);
            } else {
                next.add(index);
            }
            return next;
        });
    }, []);

    // Use reportData for display (local state) or fallback to gstReport
    const displayData = reportData || gstReport;

    // Prepare sorted invoices
    const sortedInvoices = useMemo(() => {
        return displayData?.invoices ? getSortedData(displayData.invoices) : [];
    }, [displayData, getSortedData]);

    const paginatedInvoices = useMemo(() => {
        return sortedInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
    }, [sortedInvoices, page, rowsPerPage]);

    // Print / PDF handling — renders GSTReportPrintView off-screen, then
    // clones its markup into a new window and triggers the native print dialog.
    const printRef = useRef(null);

    const handlePrint = useCallback(() => {
        if (!printRef.current) return;

        const printContents = printRef.current.innerHTML;
        const printWindow = window.open('', '_blank', 'width=1200,height=800');

        if (!printWindow) {
            // Popup blocked
            alert('Please allow pop-ups for this site to print the report.');
            return;
        }

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>GST Report</title>
                    <meta charset="utf-8" />
                </head>
                <body>${printContents}</body>
            </html>
        `);
        printWindow.document.close();

        // Wait for content (and any fonts) to be ready before printing
        printWindow.onload = () => {
            printWindow.focus();
            printWindow.print();
            printWindow.close();
        };
    }, []);

    const handleClearFilters = useCallback(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const newDateRange = { startDate: firstDay, endDate: today };
        setDateRange(newDateRange);
        setTimeout(() => {
            setShouldFetch(true);
        }, 50);
    }, []);

    // Build company object from billing settings
    const companyInfo = useMemo(() => {
        if (!billingSettings) return null;

        return {
            companyName: billingSettings.companyName || billingSettings.businessName || 'N/A',
            gstin: billingSettings.gstin || billingSettings.GSTIN || 'N/A',
            pan: billingSettings.pan || billingSettings.PAN || 'N/A',
            state: billingSettings.state || 'N/A',
            stateCode: billingSettings.stateCode || billingSettings.state_code || 'N/A',
            address: billingSettings.address || billingSettings.businessAddress || 'N/A',
            email: billingSettings.upi || 'N/A',
            phone: billingSettings.mobileNumber || billingSettings.mobileNumber || 'N/A',
        };
    }, [billingSettings]);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {error && (
                <Alert severity="error" onClose={() => dispatch(clearReportError())} sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
                </Alert>
            )}

            {billingError && (
                <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                    Could not load company information: {billingError}
                </Alert>
            )}

            <GSTReportFilters
                dateRange={dateRange}
                handleDateRangeChange={handleDateRangeChange}
                fetchReport={handleRefresh}
                loading={loading}
                error={error}
                clearError={() => dispatch(clearReportError())}
                company={displayData?.companyName}
                showHSN={showHSN}
                showParty={showParty}
                onShowHSNChange={handleShowHSNChange}
                onShowPartyChange={handleShowPartyChange}
            />

            {loading && (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
                    <CircularProgress />
                </Box>
            )}

            {!loading && (
                <>
                    {/* Company Info Section - Always show if billing settings available */}
                    {companyInfo && (
                        <Box sx={{ mt: 4, mb: 4 }}>
                            <GSTReportCompanyInfo
                                key={`company-${fetchKey}`}
                                company={companyInfo}
                            />
                        </Box>
                    )}

                    {/* Report Data Section */}
                    {displayData && (
                        <>
                            {displayData?.summary && (
                                <Box sx={{ mt: 4, mb: 4 }}>
                                    <GSTReportSummaryCards
                                        key={`summary-${fetchKey}`}
                                        summary={displayData.summary}
                                        company={companyInfo}
                                    />
                                </Box>
                            )}

                            <Box sx={{ mt: 4 }}>
                                <Box sx={{ mb: 3 }}>
                                    <GSTReportExportActions
                                        key={`export-${fetchKey}`}
                                        gstReport={displayData}
                                        activeTab={activeTab}
                                        onExportExcel={onExportExcel}
                                        onExportPDF={onExportPDF}
                                        onPrint={handlePrint}
                                        onClearFilters={handleClearFilters}
                                        loading={loading}
                                    />
                                </Box>

                                <Grid container spacing={4}>
                                    <Grid item xs={12}>
                                        <GSTReportInvoiceTable
                                            key={`invoice-${fetchKey}`}
                                            invoices={paginatedInvoices}
                                            sortConfig={sortConfig}
                                            handleSort={handleSort}
                                            page={page}
                                            rowsPerPage={rowsPerPage}
                                            handleChangePage={handleChangePage}
                                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                                            expandedRows={expandedRows}
                                            handleRowToggle={handleRowToggle}
                                            loading={loading}
                                        />
                                    </Grid>

                                    {showHSN && displayData?.hsnWiseData && (
                                        <Grid item xs={12}>
                                            <GSTReportHSNTable
                                                key={`hsn-${fetchKey}`}
                                                hsnWiseSummary={displayData.hsnWiseData}
                                                sortConfig={sortConfig}
                                                handleSort={handleSort}
                                                page={page}
                                                rowsPerPage={rowsPerPage}
                                                handleChangePage={handleChangePage}
                                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                                loading={loading}
                                            />
                                        </Grid>
                                    )}

                                    {showParty && displayData?.partyWiseData && (
                                        <Grid item xs={12}>
                                            <GSTReportPartyTable
                                                key={`party-${fetchKey}`}
                                                partyWiseSummary={displayData.partyWiseData}
                                                sortConfig={sortConfig}
                                                handleSort={handleSort}
                                                page={page}
                                                rowsPerPage={rowsPerPage}
                                                handleChangePage={handleChangePage}
                                                handleChangeRowsPerPage={handleChangeRowsPerPage}
                                                loading={loading}
                                            />
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </>
                    )}
                </>
            )}

            {/* Off-screen print view — source markup for handlePrint. Uses the
                full sorted invoice list (not the paginated slice) so the
                printed/PDF report always contains every row. */}
            {displayData && (
                <div style={{ position: 'absolute', left: -9999, top: 0, width: 0, height: 0, overflow: 'hidden' }}>
                    <div ref={printRef}>
                        <GSTReportPrintView
                            company={companyInfo}
                            summary={displayData?.summary}
                            invoices={sortedInvoices}
                            hsnWiseSummary={displayData?.hsnWiseData}
                            partyWiseSummary={displayData?.partyWiseData}
                            dateRange={dateRange}
                        />
                    </div>
                </div>
            )}
        </Container>
    );
};

export default GSTReportContainer;