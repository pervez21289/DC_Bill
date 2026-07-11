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
import GSTReportCompanyInfo from './GSTReportCompanyInfo';
import GSTReportFilters from './GSTReportFilters';
import GSTReportSummaryCards from './GSTReportSummaryCards';
import GSTReportInvoiceTable from './GSTReportInvoiceTable';
import GSTReportHSNTable from './GSTReportHSNTable';
import GSTReportPartyTable from './GSTReportPartyTable';
import GSTReportExportActions from './GSTReportExportActions';

const GSTReportContainer = ({ onExportExcel, onExportPDF, onPrint }) => {
    const dispatch = useDispatch();
    const gstReport = useSelector(selectGSTReport);
    const loading = useSelector(selectReportLoading);
    const error = useSelector(selectReportError);

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

    // Calculate payment status counts from invoices
    const calculatePaymentStatus = useCallback((invoices) => {
        if (!invoices || !invoices.length) {
            return { paidInvoices: 0, partialInvoices: 0, unpaidInvoices: 0 };
        }

        let paid = 0;
        let partial = 0;
        let unpaid = 0;

        invoices.forEach(invoice => {
            // Safely get payment status as string
            let status = '';
            if (invoice.paymentStatus) {
                status = String(invoice.paymentStatus).toLowerCase();
            }

            // Check if it's a string before using toLowerCase
            if (typeof invoice.paymentStatus === 'string') {
                status = invoice.paymentStatus.toLowerCase();
            } else if (invoice.paymentStatus && typeof invoice.paymentStatus === 'object') {
                // If it's an object, try to get a string representation
                status = String(invoice.paymentStatus).toLowerCase();
            } else {
                status = String(invoice.paymentStatus || '').toLowerCase();
            }

            // Now check the status
            if (status === 'paid' || status === 'completed' || status === 'fully paid' || status === 'full') {
                paid++;
            } else if (status === 'partial' || status === 'partially paid' || status === 'partial paid') {
                partial++;
            } else if (status === 'unpaid' || status === 'pending' || status === 'overdue' || status === '') {
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

    const handleClearFilters = useCallback(() => {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        const newDateRange = { startDate: firstDay, endDate: today };
        setDateRange(newDateRange);
        setTimeout(() => {
            setShouldFetch(true);
        }, 50);
    }, []);

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {error && (
                <Alert severity="error" onClose={() => dispatch(clearReportError())} sx={{ mb: 3, borderRadius: 2 }}>
                    {error}
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

            {!loading && displayData && (
                <>
                    <Box sx={{ mt: 4, mb: 4 }}>
                        <GSTReportCompanyInfo
                            key={`company-${fetchKey}`}
                            company={displayData}
                        />
                    </Box>

                    {displayData?.summary && (
                        <Box sx={{ mt: 4, mb: 4 }}>
                            <GSTReportSummaryCards
                                key={`summary-${fetchKey}`}
                                summary={displayData.summary}
                                company={displayData.companyName}
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
                                onPrint={onPrint}
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
        </Container>
    );
};

export default GSTReportContainer;