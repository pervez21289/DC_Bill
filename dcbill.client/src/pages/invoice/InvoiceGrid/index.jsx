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

    const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 10 });
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [exportAnchorEl, setExportAnchorEl] = useState(null);

    const debounceRef = useRef(null);
    const filtersRef = useRef({});
    const isSearching = useRef(false); // add this

    const toLocalDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const fetchInvoicesData = useCallback((search, page, pageSize, start, end) => {
   
        const filters = {
            page: page + 1,
            pageSize,
            search,
            startDate: start ? toLocalDateString(start) : null,
            endDate: end ? toLocalDateString(end) : null
        };

        const filtersStr = JSON.stringify(filters);
        if (filtersStr !== filtersRef.current) {
            filtersRef.current = filtersStr;
            dispatch(fetchInvoices(filters));
        }
    }, [dispatch]);

    // Fetch on pagination/date changes — skip if triggered by search
    useEffect(() => {
        if (isSearching.current) {
            isSearching.current = false;
            return;
        }
        fetchInvoicesData(searchTerm, paginationModel.page, paginationModel.pageSize, startDate, endDate);
    }, [paginationModel, startDate, endDate]);

    const handleSearchChange = (value) => {
        setSearchTerm(value);

        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (value === '') {
            isSearching.current = true;
            setPaginationModel(prev => ({ ...prev, page: 0 }));
            fetchInvoicesData('', 0, paginationModel.pageSize, startDate, endDate);
            return;
        }

        if (value.length <= 1) return;

        debounceRef.current = setTimeout(() => {
            isSearching.current = true;
            setPaginationModel(prev => ({ ...prev, page: 0 }));
            fetchInvoicesData(value, 0, paginationModel.pageSize, startDate, endDate);
        }, 400);
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
        if (debounceRef.current) clearTimeout(debounceRef.current);
        setSearchTerm('');
        setStartDate(null);
        setEndDate(null);
        setPaginationModel({ page: 0, pageSize: 10 });
        fetchInvoicesData('', 0, 10, null, null);
    };

    const handleAddNewInvoice = () => {
        navigate('/invoice/create');
    };

    // rest of JSX unchanged...

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