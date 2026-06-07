// components/InvoiceGrid/index.jsx
import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Paper, Typography, Grid,Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInvoices } from './../../../store/invoiceSlice';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import InvoiceGridFilters from './InvoiceGridFilters';
import InvoiceGridTable from './InvoiceGridTable';
import InvoiceGridExportMenu from './InvoiceGridExportMenu';
import { Add as AddIcon } from '@mui/icons-material';

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
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [exportAnchorEl, setExportAnchorEl] = useState(null);

    // Debounce search term
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPaginationModel(prev => ({ ...prev, page: 0 }));
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Fetch invoices when filters change
    useEffect(() => {
        const filters = {
            page: paginationModel.page + 1,
            pageSize: paginationModel.pageSize,
            search: debouncedSearch,
            startDate: startDate ? startDate.toISOString().split('T')[0] : null,
            endDate: endDate ? endDate.toISOString().split('T')[0] : null
        };
        dispatch(fetchInvoices(filters));
    }, [dispatch, paginationModel, debouncedSearch, startDate, endDate]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStartDate(null);
        setEndDate(null);
        setPaginationModel({ ...paginationModel, page: 0 });
    };

    const handleAddNewInvoice = () => {
        navigate('/invoice');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', p: 3 }}>
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        {/* Title and Add Button in one row */}
                       

                        {/* Filters row */}
                        <InvoiceGridFilters
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            startDate={startDate}
                            setStartDate={setStartDate}
                            endDate={endDate}
                            setEndDate={setEndDate}
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