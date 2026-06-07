// components/InvoiceGrid/InvoiceGridFilters.jsx
import { Grid, TextField, InputAdornment, IconButton, Button } from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Download as DownloadIcon, Add as AddIcon } from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const inputStyle = {
    '& .MuiInputBase-root': {
        fontSize: '0.7rem',
        height: '37px',
    },
    '& .MuiInputBase-input': {
        padding: '4px 8px',
    }
};

const datePickerStyle = {
    '& .MuiInputBase-root': {
        fontSize: '0.7rem',
        height: '32px',
    },
    '& .MuiInputBase-input': {
        padding: '8px 8px',
    },
    '& .MuiFormLabel-root': {
        fontSize: '0.7rem',
        top: '-3px',
    },
    '& .MuiInputLabel-shrink': {
        transform: 'translate(14px, -6px) scale(0.75)',
    },
    '& .MuiOutlinedInput-notchedOutline': {
        top: 0,
    },
    '& .MuiOutlinedInput-root': {
        padding: 0,
    }
};

export default function InvoiceGridFilters({
    searchTerm,
    setSearchTerm,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    onClearFilters,
    onExportClick,
    onAddNewClick
}) {
    return (
        <Grid container spacing={1} alignItems="center">
            <Grid item xs={12} md={3.5}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon sx={{ fontSize: '0.8rem' }} />
                            </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <IconButton size="small" onClick={() => setSearchTerm('')} sx={{ p: 0.3 }}>
                                    <ClearIcon sx={{ fontSize: '0.8rem' }} />
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                    sx={inputStyle}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <DatePicker
                    label="From Date"
                    value={startDate}
                    onChange={(newValue) => setStartDate(newValue)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: 'small',
                            variant: 'outlined',
                            sx: datePickerStyle
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} md={2}>
                <DatePicker
                    label="To Date"
                    value={endDate}
                    onChange={(newValue) => setEndDate(newValue)}
                    slotProps={{
                        textField: {
                            fullWidth: true,
                            size: 'small',
                            variant: 'outlined',
                            sx: datePickerStyle
                        }
                    }}
                />
            </Grid>
            <Grid item xs={12} md={1.5}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onClearFilters}
                    size="small"
                    sx={{
                        fontSize: '0.65rem',
                        height: '32px',
                        textTransform: 'none'
                    }}
                >
                    Clear
                </Button>
            </Grid>
            <Grid item xs={12} md={1.5}>
                <Button
                    fullWidth
                    variant="outlined"
                    onClick={onExportClick}
                    size="small"
                    startIcon={<DownloadIcon sx={{ fontSize: '0.8rem' }} />}
                    sx={{
                        fontSize: '0.65rem',
                        height: '32px',
                        textTransform: 'none'
                    }}
                >
                    Export
                </Button>
            </Grid>
            <Grid item xs={12} md={1.5} sx={{ ml: 'auto' }}>
                <Button
                    fullWidth
                    variant="contained"
                    onClick={onAddNewClick}
                    size="small"
                    startIcon={<AddIcon sx={{ fontSize: '0.8rem' }} />}
                    sx={{
                        fontSize: '0.65rem',
                        height: '32px',
                        textTransform: 'none',
                        whiteSpace: 'nowrap'
                    }}
                >
                    Add Invoice
                </Button>
            </Grid>
        </Grid>
    );
}