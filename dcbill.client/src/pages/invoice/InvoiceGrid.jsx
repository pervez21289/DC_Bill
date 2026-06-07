import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    TextField,
    InputAdornment,
    IconButton,
    Typography,
    Chip,
    Card,
    CardContent,
    Grid,
    Button,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText
} from '@mui/material';
import {
    Search as SearchIcon,
    Clear as ClearIcon,
    Visibility as ViewIcon,
    PictureAsPdf as PdfIcon,
    Print as PrintIcon,
    Add as AddIcon,
    Download as DownloadIcon
} from '@mui/icons-material';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchInvoices } from './../../store/invoiceSlice';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import * as XLSX from 'xlsx';

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
    const exportOpen = Boolean(exportAnchorEl);

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

    useEffect(() => {
        console.log('Invoices from state:', invoices);
        console.log('Total count:', totalCount);
    }, [invoices, totalCount]);

    const handleClearFilters = () => {
        setSearchTerm('');
        setStartDate(null);
        setEndDate(null);
        setPaginationModel({ ...paginationModel, page: 0 });
    };

    const handleAddNewInvoice = () => {
        navigate('/invoice');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 2
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-GB');
    };

    const handleExportToExcel = () => {
        const exportData = invoices.map((invoice, index) => ({
            'S.No': index + 1,
            'Invoice No': invoice.invoiceNo,
            'Invoice Date': formatDate(invoice.invoiceDate),
            'Party Name': invoice.partyName,
            'Party GSTIN': invoice.partyGSTIN || '—',
            'Subtotal': invoice.subtotal,
            'GST Amount': invoice.totalGST,
            'Grand Total': invoice.grandTotal,
            'Status': 'Paid'
        }));

        const ws = XLSX.utils.json_to_sheet(exportData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
        XLSX.writeFile(wb, `Invoices_${new Date().toISOString().split('T')[0]}.xlsx`);
        setExportAnchorEl(null);
    };

    const handleExportToPDF = () => {
        window.print();
        setExportAnchorEl(null);
    };

    // Define columns for DataGrid
    const columns = [
        {
            field: 'sno',
            headerName: 'S.No',
            width: 70,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => params.api.getAllRowIds().indexOf(params.id) + 1
        },
        {
            field: 'invoiceNo',
            headerName: 'Invoice No',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'invoiceDate',
            headerName: 'Date',
            width: 110,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {formatDate(params.value)}
                </Typography>
            )
        },
        {
            field: 'partyName',
            headerName: 'Party Name',
            width: 250,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'partyGSTIN',
            headerName: 'Party GSTIN',
            width: 150,
            headerAlign: 'center',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {params.value || '—'}
                </Typography>
            )
        },
        {
            field: 'subtotal',
            headerName: 'Subtotal',
            width: 120,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'totalGST',
            headerName: 'GST',
            width: 100,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem' }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'grandTotal',
            headerName: 'Grand Total',
            width: 130,
            headerAlign: 'right',
            align: 'right',
            renderCell: (params) => (
                <Typography sx={{ fontSize: '0.75rem', fontWeight: 'bold' }}>
                    {formatCurrency(params.value)}
                </Typography>
            )
        },
        {
            field: 'status',
            headerName: 'Status',
            width: 100,
            headerAlign: 'center',
            align: 'center',
            renderCell: () => (
                <Chip
                    label="Paid"
                    size="small"
                    sx={{ fontSize: '0.7rem', bgcolor: '#e8f5e9', color: '#2e7d32' }}
                />
            )
        },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 120,
            headerAlign: 'center',
            align: 'center',
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <Box>
                    <IconButton
                        size="small"
                        onClick={() => navigate(`/invoice/${params.row.id}`)}
                        sx={{ padding: 0.5 }}
                        title="View Invoice"
                    >
                        <ViewIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ padding: 0.5 }}
                        title="Download PDF"
                    >
                        <PdfIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                    <IconButton
                        size="small"
                        sx={{ padding: 0.5 }}
                        title="Print"
                    >
                        <PrintIcon sx={{ fontSize: '1rem' }} />
                    </IconButton>
                </Box>
            )
        }
    ];

    // Custom toolbar component
    const CustomToolbar = () => {
        return (
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            size="small"
                            placeholder="Search by Invoice No, Party, GSTIN..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{ fontSize: '1rem' }} />
                                    </InputAdornment>
                                ),
                                endAdornment: searchTerm && (
                                    <InputAdornment position="end">
                                        <IconButton size="small" onClick={() => setSearchTerm('')}>
                                            <ClearIcon sx={{ fontSize: '1rem' }} />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                            sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            label="From Date"
                            value={startDate}
                            onChange={(newValue) => setStartDate(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={3}>
                        <DatePicker
                            label="To Date"
                            value={endDate}
                            onChange={(newValue) => setEndDate(newValue)}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    fullWidth
                                    size="small"
                                    sx={{ '& .MuiInputBase-root': { fontSize: '0.75rem' } }}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={12} md={2}>
                        <Button
                            fullWidth
                            variant="outlined"
                            onClick={handleClearFilters}
                            size="small"
                            startIcon={<ClearIcon sx={{ fontSize: '1rem' }} />}
                            sx={{ fontSize: '0.7rem' }}
                        >
                            Clear Filters
                        </Button>
                    </Grid>
                </Grid>
            </Box>
        );
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ height: 'calc(100vh - 200px)', width: '100%', p: 3 }}>
                <Card sx={{ mb: 3, borderRadius: 2 }}>
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
                                Invoice Management
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAddNewInvoice}
                                size="small"
                                sx={{ fontSize: '0.75rem', textTransform: 'none' }}
                            >
                                Add New Invoice
                            </Button>
                        </Box>
                        <CustomToolbar />
                    </CardContent>
                </Card>

                <Paper sx={{ height: 'calc(100% - 120px)', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                    <DataGrid
                        rows={invoices}
                        columns={columns}
                        loading={loading}
                        paginationModel={paginationModel}
                        onPaginationModelChange={setPaginationModel}
                        pageSizeOptions={[5, 10, 25, 50, 100]}
                        rowCount={totalCount}
                        paginationMode="server"
                        filterMode="server"
                        sortingMode="server"
                        checkboxSelection={false}
                        disableRowSelectionOnClick
                        getRowId={(row) => row.id}
                        sx={{
                            [`& .${gridClasses.cell}`]: {
                                fontSize: '0.75rem',
                                borderBottom: '1px solid #f0f0f0',
                            },
                            [`& .${gridClasses.columnHeader}`]: {
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                backgroundColor: '#f5f5f5',
                                borderBottom: '2px solid #e0e0e0',
                            },
                            [`& .${gridClasses.columnHeaderTitle}`]: {
                                fontWeight: 'bold',
                            },
                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#f9f9f9',
                            },
                            border: 'none',
                        }}
                    />
                </Paper>
            </Box>

            {/* Export Menu */}
            <Menu
                anchorEl={exportAnchorEl}
                open={exportOpen}
                onClose={() => setExportAnchorEl(null)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MenuItem onClick={handleExportToExcel}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export to Excel</ListItemText>
                </MenuItem>
                <MenuItem onClick={handleExportToPDF}>
                    <ListItemIcon>
                        <PdfIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Export to PDF</ListItemText>
                </MenuItem>
            </Menu>
        </LocalizationProvider>
    );
}