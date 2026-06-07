// components/Header/Search.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    FormControl,
    InputAdornment,
    OutlinedInput,
    Box,
    Popper,
    Paper,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Typography,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { fetchInvoices } from './../../../../store/invoiceSlice';

export default function Search() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);

    const { invoices } = useSelector(state => state.invoice);

    // Fetch invoices for search on component mount
    useEffect(() => {
        dispatch(fetchInvoices({ page: 1, pageSize: 100 }));
    }, [dispatch]);

    // Filter invoices based on search term
    useEffect(() => {
        if (searchTerm.length >= 2) {
            setIsLoading(true);
            // Filter invoices locally for instant results
            const filtered = invoices.filter(invoice =>
                invoice.invoiceNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.partyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                invoice.partyGSTIN?.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setSearchResults(filtered.slice(0, 10)); // Limit to 10 results
            setIsLoading(false);
            setAnchorEl(document.getElementById('header-search'));
        } else {
            setSearchResults([]);
            setAnchorEl(null);
        }
    }, [searchTerm, invoices]);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleSelectInvoice = (invoiceId) => {
        setSearchTerm('');
        setAnchorEl(null);
        navigate(`/invoice/${invoiceId}`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount || 0);
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-GB');
    };

    const open = Boolean(anchorEl) && searchResults.length > 0;

    return (
        <Box sx={{ width: '100%', ml: { xs: 0, md: 1 }, position: 'relative' }}>
            <FormControl sx={{ width: { xs: '100%', md: 350 } }}>
                <OutlinedInput
                    size="small"
                    id="header-search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    startAdornment={
                        <InputAdornment position="start" sx={{ mr: -0.5 }}>
                            <SearchIcon />
                        </InputAdornment>
                    }
                    placeholder="Search by Invoice No, Party, GSTIN..."
                    sx={{ fontSize: '0.875rem' }}
                />
            </FormControl>

            {/* Search Results Dropdown */}
            <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-start"
                sx={{
                    width: anchorEl?.clientWidth,
                    zIndex: 1300,
                    '& .MuiPaper-root': {
                        boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                    }
                }}
            >
                <Paper sx={{ mt: 1, maxHeight: 400, overflow: 'auto' }}>
                    {isLoading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <CircularProgress size={24} />
                        </Box>
                    ) : (
                        <List dense>
                            {searchResults.map((invoice) => (
                                <ListItem
                                    key={invoice.id}
                                    onClick={() => handleSelectInvoice(invoice.id)}
                                    sx={{
                                        cursor: 'pointer',
                                        '&:hover': { backgroundColor: '#f5f5f5' },
                                        borderBottom: '1px solid #f0f0f0'
                                    }}
                                >
                                    <ListItemIcon>
                                        <ReceiptIcon sx={{ color: '#1976d2' }} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>
                                                    {invoice.invoiceNo}
                                                </Typography>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                                                    {formatDate(invoice.invoiceDate)}
                                                </Typography>
                                            </Box>
                                        }
                                        secondary={
                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 0.5 }}>
                                                <Typography variant="caption" color="textSecondary" sx={{ fontSize: '0.7rem' }}>
                                                    {invoice.partyName}
                                                </Typography>
                                                <Typography variant="caption" color="primary" sx={{ fontWeight: 'bold', fontSize: '0.7rem' }}>
                                                    {formatCurrency(invoice.grandTotal)}
                                                </Typography>
                                            </Box>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Paper>
            </Popper>
        </Box>
    );
}