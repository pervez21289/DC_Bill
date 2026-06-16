// components/ActivityLogReport.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Box,
    Grid,
    TextField,
    MenuItem,
    Button,
    Stack,
    Chip,
    Typography,
    FormControl,
    InputLabel,
    Select,
    IconButton,
    Tooltip,
    Paper,
    Alert,
    Snackbar,
} from '@mui/material';
import {
    DataGrid,
    GridToolbarContainer,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import {
    Refresh as RefreshIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
    fetchActivityLogs,
    fetchFilterOptions,
    setFilters,
    clearFilters,
    setPage,
    setPageSize,
    setSortModel,
    selectActivityLogs,
    selectTotalRecords,
    selectCurrentPage,
    selectPageSize,
    selectFilters,
    selectFilterOptions,
    selectSortModel,
    selectLoading,
    selectError,
    selectSuccess,
    selectFilterCount,
    clearError,
    clearSuccess,
} from 'store/activityLogSlice';

// Custom Toolbar (No Export)
function CustomToolbar({ onRefresh, filterCount }) {
    return (
        <GridToolbarContainer sx={{ p: 1, justifyContent: 'space-between' }}>
            <Box>
                <GridToolbarFilterButton />
                <GridToolbarDensitySelector />
            </Box>
            <Box>
                {filterCount > 0 && (
                    <Chip
                        label={`${filterCount} filters applied`}
                        size="small"
                        color="primary"
                        sx={{ mr: 1 }}
                    />
                )}
                <Tooltip title="Refresh">
                    <IconButton onClick={onRefresh} size="small">
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
            </Box>
        </GridToolbarContainer>
    );
}

export default function ActivityLogReport() {
    const dispatch = useDispatch();

    // Redux state
    const logs = useSelector(selectActivityLogs);
    const totalRecords = useSelector(selectTotalRecords);
    const currentPage = useSelector(selectCurrentPage);
    const pageSize = useSelector(selectPageSize);
    const filters = useSelector(selectFilters);
    const filterOptions = useSelector(selectFilterOptions);
    const sortModel = useSelector(selectSortModel);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);
    const success = useSelector(selectSuccess);
    const filterCount = useSelector(selectFilterCount);

    const [localFilters, setLocalFilters] = useState(filters);

    // Load filter options on mount
    useEffect(() => {
        dispatch(fetchFilterOptions());
    }, [dispatch]);

    // Load data on page/filter/sort change
    useEffect(() => {
        dispatch(fetchActivityLogs());
    }, [
        dispatch,
        currentPage,
        pageSize,
        sortModel,
        filters.action,
        filters.entity,
        filters.userId,
        filters.fromDate,
        filters.toDate,
    ]);

    const handleFilterChange = (field, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const applyFilters = () => {
        dispatch(setFilters(localFilters));
    };

    const handleClearFilters = () => {
        dispatch(clearFilters());
        setLocalFilters({
            action: '',
            entity: '',
            userId: '',
            fromDate: null,
            toDate: null,
        });
    };

    const handleRefresh = () => {
        dispatch(fetchActivityLogs());
    };

    const handleCloseSnackbar = () => {
        dispatch(clearError());
        dispatch(clearSuccess());
    };

    // Column definitions
    const columns = [
        {
            field: 'id',
            headerName: 'ID',
            width: 80,
            sortable: true,
        },
        {
            field: 'userName',
            headerName: 'User',
            width: 150,
            sortable: true,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" noWrap>
                        {params.value || 'System'}
                    </Typography>
                </Box>
            ),
        },
        {
            field: 'action',
            headerName: 'Action',
            width: 130,
            sortable: true,
            renderCell: (params) => {
                const colorMap = {
                    Create: 'success',
                    Update: 'warning',
                    Delete: 'error',
                    View: 'info',
                    Login: 'primary',
                    Logout: 'secondary',
                };
                return (
                    <Chip
                        label={params.value}
                        color={colorMap[params.value] || 'default'}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'entity',
            headerName: 'Entity',
            width: 130,
            sortable: true,
        },
        {
            field: 'method',
            headerName: 'Method',
            width: 90,
            sortable: true,
            renderCell: (params) => {
                const colorMap = {
                    GET: 'info',
                    POST: 'success',
                    PUT: 'warning',
                    DELETE: 'error',
                };
                return (
                    <Chip
                        label={params.value || 'N/A'}
                        color={colorMap[params.value] || 'default'}
                        size="small"
                        variant="outlined"
                    />
                );
            },
        },
        {
            field: 'responseStatus',
            headerName: 'Status',
            width: 90,
            sortable: true,
            renderCell: (params) => {
                const status = params.value;
                const isSuccess = status && status.startsWith('2');
                return (
                    <Chip
                        label={status || 'N/A'}
                        color={isSuccess ? 'success' : 'error'}
                        size="small"
                    />
                );
            },
        },
        {
            field: 'oldValuesShort',
            headerName: 'Old Values',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title={params.row.oldValues || 'No changes'}>
                    <Typography variant="body2" noWrap sx={{ fontSize: '0.8rem' }}>
                        {params.value || '-'}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: 'newValuesShort',
            headerName: 'New Values',
            width: 200,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title={params.row.newValues || 'No changes'}>
                    <Typography variant="body2" noWrap sx={{ fontSize: '0.8rem' }}>
                        {params.value || '-'}
                    </Typography>
                </Tooltip>
            ),
        },
        {
            field: 'ipAddress',
            headerName: 'IP',
            width: 130,
            sortable: false,
        },
        {
            field: 'executionTimeMs',
            headerName: 'Duration (ms)',
            width: 110,
            sortable: true,
            renderCell: (params) => {
                const value = params.value;
                if (!value) return '-';
                const color = value > 1000 ? 'error' : value > 500 ? 'warning' : 'success';
                return <Chip label={`${value}ms`} color={color} size="small" />;
            },
        },
        {
            field: 'createdAt',
            headerName: 'Date & Time',
            width: 180,
            sortable: true,
            renderCell: (params) => {
                const date = new Date(params.value);
                return date.toLocaleString();
            },
        },
    ];

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                {/* Snackbar for notifications */}
                <Snackbar
                    open={!!error || !!success}
                    autoHideDuration={3000}
                    onClose={handleCloseSnackbar}
                >
                    <Alert severity={error ? 'error' : 'success'}>
                        {error || success}
                    </Alert>
                </Snackbar>

                {/* Filter Section */}
                <Paper sx={{ p: 2, mb: 2 }}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid item xs={12}>
                            <Typography variant="h5" fontWeight="bold">
                                Activity Log Report
                            </Typography>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Action</InputLabel>
                                <Select
                                    value={localFilters.action}
                                    label="Action"
                                    onChange={(e) => handleFilterChange('action', e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {filterOptions.actions?.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Entity</InputLabel>
                                <Select
                                    value={localFilters.entity}
                                    label="Entity"
                                    onChange={(e) => handleFilterChange('entity', e.target.value)}
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {filterOptions.entities?.map((item) => (
                                        <MenuItem key={item.value} value={item.value}>
                                            {item.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <TextField
                                fullWidth
                                size="small"
                                label="User ID"
                                type="number"
                                value={localFilters.userId}
                                onChange={(e) => handleFilterChange('userId', e.target.value)}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <DateTimePicker
                                label="From Date"
                                value={localFilters.fromDate}
                                onChange={(newValue) => handleFilterChange('fromDate', newValue)}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <DateTimePicker
                                label="To Date"
                                value={localFilters.toDate}
                                onChange={(newValue) => handleFilterChange('toDate', newValue)}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />
                        </Grid>
                        <Grid item xs={12} md={2}>
                            <Stack direction="row" spacing={1}>
                                <Button
                                    variant="contained"
                                    onClick={applyFilters}
                                    disabled={loading}
                                    fullWidth
                                >
                                    Apply
                                </Button>
                                <Button
                                    variant="outlined"
                                    onClick={handleClearFilters}
                                    disabled={loading}
                                    fullWidth
                                >
                                    Clear
                                </Button>
                            </Stack>
                        </Grid>
                    </Grid>
                </Paper>

                {/* DataGrid */}
                {/* Modern DataGrid */}
                <Paper
                    elevation={0}
                    sx={{
                        height: 700,
                        width: '100%',
                        borderRadius: 3,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                    }}
                >
                    <DataGrid
                        rows={logs}
                        columns={columns}
                        rowCount={totalRecords}
                        paginationMode="server"
                        sortingMode="server"
                        paginationModel={{
                            page: currentPage,
                            pageSize: pageSize,
                        }}
                        onPaginationModelChange={(model) => {
                            dispatch(setPage(model.page));
                            dispatch(setPageSize(model.pageSize));
                        }}
                        sortModel={sortModel}
                        onSortModelChange={(model) => dispatch(setSortModel(model))}
                        loading={loading}
                        disableRowSelectionOnClick
                        pageSizeOptions={[10, 25, 50, 100]}
                        slots={{
                            toolbar: () => (
                                <GridToolbarContainer
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        p: 2,
                                        borderBottom: '1px solid #eaeaea',
                                        backgroundColor: '#fff',
                                    }}
                                >
                                    <Stack direction="row" spacing={1}>
                                        <GridToolbarFilterButton />
                                        <GridToolbarDensitySelector />

                                        {filterCount > 0 && (
                                            <Chip
                                                label={`${filterCount} Active Filters`}
                                                color="primary"
                                                size="small"
                                            />
                                        )}
                                    </Stack>

                                    <Tooltip title="Refresh Data">
                                        <IconButton
                                            onClick={handleRefresh}
                                            sx={{
                                                bgcolor: 'primary.main',
                                                color: '#fff',
                                                '&:hover': {
                                                    bgcolor: 'primary.dark',
                                                },
                                            }}
                                        >
                                            <RefreshIcon />
                                        </IconButton>
                                    </Tooltip>
                                </GridToolbarContainer>
                            ),

                            noRowsOverlay: () => (
                                <Box
                                    sx={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        height: '100%',
                                        gap: 1,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        color="text.secondary"
                                    >
                                        No Activity Logs Found
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        color="text.secondary"
                                    >
                                        Try changing filters or refreshing data
                                    </Typography>
                                </Box>
                            ),
                        }}
                        sx={{
                            border: 0,

                            '& .MuiDataGrid-columnHeaders': {
                                background:
                                    'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                                color: '#fff',
                                borderBottom: 'none',
                                minHeight: '56px !important',
                            },

                            '& .MuiDataGrid-columnHeader': {
                                fontWeight: 700,
                                fontSize: '0.95rem',
                            },

                            '& .MuiDataGrid-columnHeaderTitle': {
                                fontWeight: 700,
                            },

                            '& .MuiDataGrid-columnSeparator': {
                                display: 'none',
                            },

                            '& .MuiDataGrid-row': {
                                transition: 'all .2s ease',
                                borderBottom: '1px solid #f3f3f3',
                            },

                            '& .MuiDataGrid-row:nth-of-type(even)': {
                                backgroundColor: '#fafafa',
                            },

                            '& .MuiDataGrid-row:hover': {
                                backgroundColor: '#e3f2fd',
                                boxShadow:
                                    '0px 2px 10px rgba(25,118,210,0.12)',
                            },

                            '& .MuiDataGrid-cell': {
                                borderBottom: '1px solid #f5f5f5',
                                fontSize: '0.875rem',
                                alignItems: 'center',
                            },

                            '& .MuiDataGrid-footerContainer': {
                                borderTop: '1px solid #e0e0e0',
                                backgroundColor: '#fafafa',
                            },

                            '& .MuiTablePagination-root': {
                                fontWeight: 600,
                            },

                            '& .MuiDataGrid-virtualScroller': {
                                backgroundColor: '#fff',
                            },

                            '& .MuiDataGrid-selectedRowCount': {
                                visibility: 'hidden',
                            },

                            '& .MuiChip-root': {
                                fontWeight: 600,
                            },

                            '& .MuiDataGrid-cell:focus': {
                                outline: 'none',
                            },

                            '& .MuiDataGrid-columnHeader:focus': {
                                outline: 'none',
                            },
                        }}
                    />
                </Paper>
            </Box>
        </LocalizationProvider>
    );
}