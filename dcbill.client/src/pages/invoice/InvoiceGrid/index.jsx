// components/InvoiceGrid/index.jsx
import { useEffect, useState, useRef, useCallback } from 'react';
import { Box, Card, CardContent, Paper } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInvoices } from './../../../store/invoiceSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InvoiceGridFilters from './InvoiceGridFilters';
import InvoiceGridTable from './InvoiceGridTable';
import InvoiceGridExportMenu from './InvoiceGridExportMenu';

export default function InvoiceGrid() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { invoices, loading, totalCount } = useSelector(state => state.invoice);

    const [paginationModel, setPaginationModel] = useState({
        page: 0,
        pageSize: 10,
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportAnchorEl, setExportAnchorEl] = useState(null);

    const filtersRef = useRef({});

    // Create a function to fetch invoices
    const fetchInvoicesData = useCallback(() => {
        const filters = {
            page: paginationModel.page + 1,
            pageSize: paginationModel.pageSize,
            search: searchTerm,
            startDate: startDate ? startDate.toISOString().split('T')[0] : null,
            endDate: endDate ? endDate.toISOString().split('T')[0] : null
        };

        // Only fetch if filters changed
        const filtersStr = JSON.stringify(filters);
        if (filtersStr !== filtersRef.current) {
            filtersRef.current = filtersStr;
            dispatch(fetchInvoices(filters));
        }
    }, [dispatch, paginationModel.page, paginationModel.pageSize, searchTerm, startDate, endDate]);

    // Fetch when dependencies change
    useEffect(() => {
        fetchInvoicesData();
    }, [fetchInvoicesData]);

    // Handle search with debounce
    const handleSearchChange = (value) => {
        setSearchTerm(value);
        // Reset page after debounce
        setTimeout(() => {
            setPaginationModel(prev => ({ ...prev, page: 0 }));
        }, 500);
    };

    const handleStartDateChange = (date) => {
        setStartDate(date);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };

    const handleEndDateChange = (date) => {
        setEndDate(date);
        setPaginationModel(prev => ({ ...prev, page: 0 }));
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setStartDate(null);
        setEndDate(null);
        setPaginationModel({ ...paginationModel, page: 0 });
    };

    const handleAddNewInvoice = () => {
        navigate('/invoice/create');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ height: 'calc(100vh - 100px)', width: '100%', p: 3 }}>
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <InvoiceGridFilters
                            searchTerm={searchTerm}
                            setSearchTerm={handleSearchChange}
                            startDate={startDate}
                            setStartDate={handleStartDateChange}
                            endDate={endDate}
                            setEndDate={handleEndDateChange}
                            onClearFilters={handleClearFilters}
                            onExportClick={(e) => setExportAnchorEl(e.currentTarget)}
                            onAddNewClick={handleAddNewInvoice}
                        />
                    </CardContent>
                </Card>

                <Paper sx={{ height: 'calc(100% - 100px)', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                    <InvoiceGridTable
                        invoices={invoices}
                        loading={loading}
                        paginationModel={paginationModel}
                        setPaginationModel={setPaginationModel}
                        totalCount={totalCount}
                    />
                </Paper>

                <InvoiceGridExportMenu
                    exportAnchorEl={exportAnchorEl}
                    setExportAnchorEl={setExportAnchorEl}
                    invoices={invoices}
                />
            </Box>
        </LocalizationProvider>
    );
}