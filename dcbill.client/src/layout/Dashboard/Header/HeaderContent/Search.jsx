// components/Header/Search.jsx
import { useState, useEffect, useRef, useCallback } from 'react';
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
    CircularProgress,
    ClickAwayListener,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ReceiptIcon from '@mui/icons-material/Receipt';
import { fetchInvoices } from './../../../../store/invoiceSlice';

export default function Search() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const [hoveredIndex, setHoveredIndex] = useState(-1);
    const [isOpen, setIsOpen] = useState(false);

    const listRef = useRef(null);
    const searchInputRef = useRef(null);
    const anchorRef = useRef(null);

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
            setIsOpen(true);
            setSelectedIndex(-1); // Reset selection when results change
        } else {
            setSearchResults([]);
            setIsOpen(false);
            setSelectedIndex(-1);
        }
    }, [searchTerm, invoices]);

    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
    };

    const handleSelectInvoice = useCallback((invoiceId) => {
        setSearchTerm('');
        setIsOpen(false);
        setSelectedIndex(-1);
        setHoveredIndex(-1);
        navigate(`/invoice/${invoiceId}`);
    }, [navigate]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setSelectedIndex(-1);
        setHoveredIndex(-1);
    }, []);

    // Keyboard navigation handlers
    const handleKeyDown = useCallback((event) => {
        const resultsCount = searchResults.length;

        if (!isOpen || resultsCount === 0) {
            // If dropdown is closed and user presses Enter, trigger search
            if (event.key === 'Enter' && searchTerm.length >= 2) {
                // Navigate to search results page or first result
                if (searchResults.length > 0) {
                    handleSelectInvoice(searchResults[0].id);
                }
            }
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                setHoveredIndex(-1); // keyboard nav takes over from mouse hover
                setSelectedIndex(prev =>
                    prev < resultsCount - 1 ? prev + 1 : prev
                );
                break;

            case 'ArrowUp':
                event.preventDefault();
                setHoveredIndex(-1); // keyboard nav takes over from mouse hover
                setSelectedIndex(prev =>
                    prev > 0 ? prev - 1 : -1
                );
                break;

            case 'Enter':
                event.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < resultsCount) {
                    handleSelectInvoice(searchResults[selectedIndex].id);
                } else if (resultsCount > 0) {
                    // If no item is selected, select the first one
                    handleSelectInvoice(searchResults[0].id);
                }
                break;

            case 'Escape':
                event.preventDefault();
                setSearchTerm('');
                setIsOpen(false);
                setSelectedIndex(-1);
                setHoveredIndex(-1);
                searchInputRef.current?.blur();
                break;

            default:
                break;
        }
    }, [isOpen, searchResults, selectedIndex, handleSelectInvoice, searchTerm]);

    // Scroll selected item into view
    useEffect(() => {
        if (selectedIndex >= 0 && listRef.current) {
            const listItems = listRef.current.querySelectorAll('.MuiListItem-root');
            if (listItems[selectedIndex]) {
                listItems[selectedIndex].scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [selectedIndex]);

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

    return (
        <ClickAwayListener onClickAway={handleClose}>
            <Box sx={{ width: '100%', ml: { xs: 0, md: 1 }, position: 'relative' }}>
                <FormControl sx={{ width: { xs: '100%', md: 350 } }}>
                    <OutlinedInput
                        size="small"
                        id="header-search"
                        inputRef={searchInputRef}
                        ref={anchorRef}
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
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
                    open={isOpen && searchResults.length > 0}
                    anchorEl={anchorRef.current}
                    placement="bottom-start"
                    sx={{
                        width: anchorRef.current?.clientWidth || 350,
                        zIndex: 1300,
                        '& .MuiPaper-root': {
                            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                            borderRadius: 2,
                        }
                    }}
                >
                    <Paper sx={{ mt: 1, maxHeight: 400, overflow: 'auto' }} ref={listRef}>
                        {isLoading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress size={24} />
                            </Box>
                        ) : (
                            <List dense>
                                {searchResults.map((invoice, index) => {
                                    const isActive = (hoveredIndex >= 0 ? hoveredIndex : selectedIndex) === index;
                                    return (
                                        <ListItem
                                            key={invoice.id}
                                            onClick={() => handleSelectInvoice(invoice.id)}
                                            onMouseEnter={() => setHoveredIndex(index)}
                                            onMouseLeave={() => setHoveredIndex(-1)}
                                            sx={{
                                                cursor: 'pointer',
                                                backgroundColor: isActive ? '#e3f2fd' : 'transparent',
                                                '&:hover': { backgroundColor: isActive ? '#bbdefb' : '#f5f5f5' },
                                                borderBottom: '1px solid #f0f0f0',
                                                transition: 'background-color 0.15s ease',
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
                                    );
                                })}
                            </List>
                        )}
                    </Paper>
                </Popper>
            </Box>
        </ClickAwayListener>
    );
}