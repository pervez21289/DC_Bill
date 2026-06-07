import {
    TableRow,
    TableCell,
    TextField,
    IconButton,
    Autocomplete,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Grid,
    CircularProgress
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, deleteItem } from './../../store/invoiceItemsSlice';
import { addItemToMaster, fetchItemMaster } from './../../store/itemMasterSlice';

export default function InvoiceItemRow({ index }) {
    const dispatch = useDispatch();
    const item = useSelector(state => state.invoiceItems.items[index]);
    const itemMaster = useSelector(state => state.itemMaster.items || []); // Ensure it's always an array
    const { loading } = useSelector(state => state.itemMaster);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: '',
        hsnCode: '',
        rate: 0,
        gst: 18
    });
    const [errors, setErrors] = useState({
        itemName: '',
        hsnCode: ''
    });

    const handleItemSelect = (_, selectedItem) => {
        if (selectedItem?.isNew) {
            setIsDialogOpen(true);
            return;
        }

        if (!selectedItem) return;

        dispatch(updateItem({
            index,
            data: {
                itemId: selectedItem.id,
                itemName: selectedItem.itemName,
                hsnCode: selectedItem.hsnCode,
                rate: selectedItem.rate,
                gst: selectedItem.gst
            }
        }));
    };

    const handleChange = (field, value) => {
        dispatch(updateItem({
            index,
            data: { [field]: value }
        }));
    };

    const handleDelete = () => {
        dispatch(deleteItem(index));
    };

    const validateForm = () => {
        let isValid = true;
        const newErrors = { itemName: '', hsnCode: '' };

        if (!newItem.itemName.trim()) {
            newErrors.itemName = 'Item Name is required';
            isValid = false;
        }

        if (!newItem.hsnCode.trim()) {
            newErrors.hsnCode = 'HSN Code is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleAddNewItem = async () => {
        if (!validateForm()) {
            return;
        }

        setSaving(true);

        try {
            const itemData = {
                itemName: newItem.itemName,
                hsnCode: newItem.hsnCode,
                rate: Number(newItem.rate),
                gst: Number(newItem.gst)
            };

            const result = await dispatch(addItemToMaster(itemData)).unwrap();

            // Handle API response
            let newItemId = null;
            if (result && typeof result === 'object') {
                if (result.data && typeof result.data === 'number') {
                    newItemId = result.data;
                } else if (result.id) {
                    newItemId = result.id;
                } else if (typeof result === 'number') {
                    newItemId = result;
                }
            }

            if (newItemId && newItemId > 0) {
                const savedItem = {
                    id: newItemId,
                    itemName: newItem.itemName,
                    hsnCode: newItem.hsnCode,
                    rate: Number(newItem.rate),
                    gst: Number(newItem.gst)
                };

                dispatch(updateItem({
                    index,
                    data: {
                        itemId: savedItem.id,
                        itemName: savedItem.itemName,
                        hsnCode: savedItem.hsnCode,
                        rate: savedItem.rate,
                        gst: savedItem.gst
                    }
                }));

                dispatch(fetchItemMaster());

                setNewItem({
                    itemName: '',
                    hsnCode: '',
                    rate: 0,
                    gst: 18
                });
                setErrors({ itemName: '', hsnCode: '' });
                setIsDialogOpen(false);
            } else {
                alert(result?.message || 'Failed to add item. Please try again.');
            }
        } catch (error) {
            console.error('Error adding item:', error);
            alert('Error adding item: ' + (error?.message || 'Please try again'));
        } finally {
            setSaving(false);
        }
    };

    // Create options array with safety check
    const options = Array.isArray(itemMaster) ? [...itemMaster, {
        id: 'new',
        itemName: '+ Add New Item',
        isNew: true
    }] : [{
        id: 'new',
        itemName: '+ Add New Item',
        isNew: true
    }];

    if (!item) return null;

    const textFieldStyles = {
        '& .MuiInputBase-root': {
            fontSize: '0.75rem',
            minHeight: '32px'
        },
        '& .MuiInputBase-input': {
            py: 0.5,
            px: 1
        }
    };

    return (
        <>
            <TableRow sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                <TableCell sx={{ py: 0.5, px: 1 }}>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => {
                            if (option?.isNew) return option.itemName;
                            return option?.itemName || '';
                        }}
                        value={
                            Array.isArray(itemMaster)
                                ? itemMaster.find((x) => x?.id === item?.itemId) || null
                                : null
                        }
                        onChange={handleItemSelect}
                        size="small"
                        loading={loading}
                        renderOption={(props, option) => (
                            <li {...props} style={{
                                fontWeight: option?.isNew ? 'bold' : 'normal',
                                color: option?.isNew ? '#1976d2' : 'inherit',
                                backgroundColor: option?.isNew ? '#f0f7ff' : 'inherit',
                                fontSize: '0.75rem'
                            }}>
                                {option?.isNew ? '➕ ' : ''}{option?.itemName || ''}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                placeholder="Search or add new item"
                                sx={textFieldStyles}
                            />
                        )}
                    />
                </TableCell>

                <TableCell sx={{ py: 0.5, px: 1 }}>
                    <TextField
                        size="small"
                        value={item?.hsnCode || ''}
                        disabled
                        sx={textFieldStyles}
                        InputProps={{
                            sx: { fontSize: '0.75rem' }
                        }}
                    />
                </TableCell>

                <TableCell sx={{ py: 0.5, px: 1 }}>
                    <TextField
                        size="small"
                        type="number"
                        value={item?.qty || ''}
                        onChange={(e) =>
                            handleChange('qty', e.target.value)
                        }
                        sx={textFieldStyles}
                        InputProps={{
                            sx: { fontSize: '0.75rem' }
                        }}
                        inputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                </TableCell>

                <TableCell sx={{ py: 0.5, px: 1 }}>
                    <TextField
                        size="small"
                        type="number"
                        value={item?.rate || ''}
                        onChange={(e) =>
                            handleChange('rate', e.target.value)
                        }
                        sx={textFieldStyles}
                        InputProps={{
                            sx: { fontSize: '0.75rem' }
                        }}
                        inputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                </TableCell>

                <TableCell sx={{ py: 0.5, px: 1 }}>
                    <TextField
                        size="small"
                        value={item?.amount || 0}
                        disabled
                        sx={textFieldStyles}
                        InputProps={{
                            sx: { fontSize: '0.75rem', fontWeight: 'bold' }
                        }}
                        inputProps={{
                            style: { textAlign: 'right' }
                        }}
                    />
                </TableCell>

                <TableCell sx={{ py: 0.5, px: 1 }}>
                    <TextField
                        size="small"
                        value={`${item?.gst || 0}%`}
                        disabled
                        sx={{
                            width: 60,
                            '& .MuiInputBase-root': {
                                fontSize: '0.75rem',
                                minHeight: '32px'
                            }
                        }}
                        InputProps={{
                            sx: { fontSize: '0.75rem', textAlign: 'center' }
                        }}
                        inputProps={{
                            style: { textAlign: 'center' }
                        }}
                    />
                </TableCell>

                <TableCell sx={{ py: 0.5, px: 0.5 }}>
                    <IconButton
                        color="error"
                        onClick={handleDelete}
                        size="small"
                        sx={{ padding: 0.5 }}
                    >
                        ❌
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* Add New Item Dialog */}
            <Dialog
                open={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 1,
                        minWidth: 400
                    }
                }}
            >
                <DialogTitle sx={{ fontSize: '1rem', py: 1.5 }}>
                    Add New Item
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 0.5 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                size="small"
                                value={newItem.itemName}
                                onChange={(e) => {
                                    setNewItem({ ...newItem, itemName: e.target.value });
                                    setErrors({ ...errors, itemName: '' });
                                }}
                                required
                                error={!!errors.itemName}
                                helperText={errors.itemName}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="HSN Code"
                                size="small"
                                value={newItem.hsnCode}
                                onChange={(e) => {
                                    setNewItem({ ...newItem, hsnCode: e.target.value });
                                    setErrors({ ...errors, hsnCode: '' });
                                }}
                                required
                                error={!!errors.hsnCode}
                                helperText={errors.hsnCode}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Rate"
                                type="number"
                                size="small"
                                value={newItem.rate}
                                onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="GST (%)"
                                type="number"
                                size="small"
                                value={newItem.gst}
                                onChange={(e) => setNewItem({ ...newItem, gst: e.target.value })}
                                sx={{
                                    '& .MuiInputLabel-root': { fontSize: '0.75rem' },
                                    '& .MuiInputBase-root': { fontSize: '0.75rem' }
                                }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => {
                            setIsDialogOpen(false);
                            setNewItem({
                                itemName: '',
                                hsnCode: '',
                                rate: 0,
                                gst: 18
                            });
                            setErrors({ itemName: '', hsnCode: '' });
                        }}
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                        disabled={saving}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleAddNewItem}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ fontSize: '0.7rem' }}
                        disabled={saving}
                    >
                        {saving ? <CircularProgress size={20} /> : 'Add Item'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}