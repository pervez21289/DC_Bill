import { useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { fetchGSTReport, selectGSTReport, clearReportError } from '../store/reportSlice';
import { reportService } from '../services/reportService';

export const useGSTReport = () => {
  const dispatch = useDispatch();
  const { gstReport, loading, error } = useSelector(selectGSTReport);
  
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date(),
  });
  
  const [activeTab, setActiveTab] = useState(0);
  const [sortConfig, setSortConfig] = useState({ key: 'invoiceDate', direction: 'desc' });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expandedRows, setExpandedRows] = useState(new Set());

  const fetchReport = useCallback(async () => {
    if (dateRange.startDate && dateRange.endDate) {
      const startDate = format(dateRange.startDate, 'yyyy-MM-dd');
      const endDate = format(dateRange.endDate, 'yyyy-MM-dd');
      await dispatch(fetchGSTReport({ startDate, endDate })).unwrap();
    }
  }, [dateRange, dispatch]);

  const handleDateRangeChange = useCallback((newRange) => {
    setDateRange(newRange);
    setPage(0);
  }, []);

  const handleSort = useCallback((key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    setPage(0);
  }, [sortConfig]);

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

  const handleChangePage = useCallback((_, newPage) => {
    setPage(newPage);
  }, []);

  const handleChangeRowsPerPage = useCallback((event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  }, []);

  const handleTabChange = useCallback((_, newValue) => {
    setActiveTab(newValue);
    setPage(0);
  }, []);

  const clearError = useCallback(() => {
    dispatch(clearReportError());
  }, [dispatch]);

  const invoices = gstReport?.invoices || [];
  const sortedInvoices = getSortedData(invoices);
  const paginatedInvoices = sortedInvoices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const summary = gstReport?.summary;
  const hsnWiseSummary = gstReport?.summary?.hsnWiseSummary || [];
  const partyWiseSummary = gstReport?.summary?.partyWiseSummary || [];
  const company = gstReport ? {
    companyName: gstReport.companyName,
    gstin: gstReport.companyGSTIN,
    state: gstReport.companyState,
    stateCode: gstReport.companyStateCode,
    address: gstReport.companyAddress,
    pan: gstReport.companyPAN,
    email: gstReport.companyEmail,
    phone: gstReport.companyPhone,
  } : null;

  return {
    // State
    dateRange,
    activeTab,
    sortConfig,
    page,
    rowsPerPage,
    expandedRows,
    loading,
    error,
    gstReport,
    
    // Computed
    invoices,
    sortedInvoices,
    paginatedInvoices,
    summary,
    hsnWiseSummary,
    partyWiseSummary,
    company,
    
    // Actions
    fetchReport,
    handleDateRangeChange,
    handleSort,
    handleRowToggle,
    handleChangePage,
    handleChangeRowsPerPage,
    handleTabChange,
    clearError,
    setDateRange,
  };
};

export const formatCurrency = (value) => {
  if (value === null || value === undefined) return '0.00';
  return Number(value).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const getPaymentStatusChip = (status) => {
  switch (status) {
    case 1:
      return { label: 'Paid', color: 'success', icon: 'check' };
    case 2:
      return { label: 'Partial', color: 'warning', icon: 'warning' };
    default:
      return { label: 'Not Paid', color: 'error', icon: 'error' };
  }
};

export const getInvoiceTypeChip = (type) => {
  switch (type) {
    case 'B2B':
      return { label: 'B2B', color: 'primary' };
    case 'B2C':
      return { label: 'B2C', color: 'secondary' };
    case 'Export':
      return { label: 'Export', color: 'success' };
    default:
      return { label: 'N/A', color: 'default' };
  }
};