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
    Grid
} from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateItem, deleteItem } from './../../store/invoiceItemsSlice';  // Corrected path
import { addItem } from './../../store/itemMasterSlice';  // Corrected path

export default function InvoiceItemRow({ index }) {
    const dispatch = useDispatch();
    const item = useSelector(state => state.invoiceItems.items[index]);
    const itemMaster = useSelector(state => state.itemMaster.items);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [newItem, setNewItem] = useState({
        itemName: '',
        hsnCode: '',
        rate: 0,
        gst: 18
    });

    const handleItemSelect = (_, selectedItem) => {
        // Check if "add new" option was selected
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

    const handleAddNewItem = () => {
        // Validate required fields
        if (!newItem.itemName || !newItem.hsnCode) {
            alert('Please fill Item Name and HSN Code');
            return;
        }

        const newItemObject = {
            id: Date.now(),
            ...newItem,
            rate: Number(newItem.rate),
            gst: Number(newItem.gst)
        };

        // Add to master list
        dispatch(addItem(newItemObject));

        // Auto-select the newly added item
        dispatch(updateItem({
            index,
            data: {
                itemId: newItemObject.id,
                itemName: newItemObject.itemName,
                hsnCode: newItemObject.hsnCode,
                rate: newItemObject.rate,
                gst: newItemObject.gst
            }
        }));

        // Reset form and close dialog
        setNewItem({
            itemName: '',
            hsnCode: '',
            rate: 0,
            gst: 18
        });
        setIsDialogOpen(false);
    };

    // Create options array with "Add New" option
    const options = [...itemMaster, {
        id: 'new',
        itemName: '+ Add New Item',
        isNew: true
    }];

    if (!item) return null;

    return (
        <>
            <TableRow>
                <TableCell sx={{ minWidth: 250 }}>
                    <Autocomplete
                        options={options}
                        getOptionLabel={(option) => {
                            if (option.isNew) return option.itemName;
                            return option.itemName || '';
                        }}
                        value={
                            itemMaster.find(
                                (x) => x.id === item.itemId
                            ) || null
                        }
                        onChange={handleItemSelect}
                        renderOption={(props, option) => (
                            <li {...props} style={{
                                fontWeight: option.isNew ? 'bold' : 'normal',
                                color: option.isNew ? '#1976d2' : 'inherit',
                                backgroundColor: option.isNew ? '#f0f7ff' : 'inherit'
                            }}>
                                {option.isNew ? '➕ ' : ''}{option.itemName}
                            </li>
                        )}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                size="small"
                                placeholder="Search or add new item"
                            />
                        )}
                    />
                </TableCell>

                <TableCell>
                    <TextField
                        size="small"
                        value={item.hsnCode || ''}
                        disabled
                    />
                </TableCell>

                <TableCell>
                    <TextField
                        size="small"
                        type="number"
                        value={item.qty || ''}
                        onChange={(e) =>
                            handleChange('qty', e.target.value)
                        }
                    />
                </TableCell>

                <TableCell>
                    <TextField
                        size="small"
                        type="number"
                        value={item.rate || ''}
                        onChange={(e) =>
                            handleChange('rate', e.target.value)
                        }
                    />
                </TableCell>

                <TableCell>
                    <TextField
                        size="small"
                        value={item.amount || 0}
                        disabled
                    />
                </TableCell>

                <TableCell>
                    <TextField
                        size="small"
                        value={`${item.gst || 0}%`}
                        disabled
                        sx={{ width: 70 }}
                    />
                </TableCell>

                <TableCell>
                    <IconButton
                        color="error"
                        onClick={handleDelete}
                    >
                        ❌
                    </IconButton>
                </TableCell>
            </TableRow>

            {/* Add New Item Dialog */}
            <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add New Item</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Item Name"
                                value={newItem.itemName}
                                onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="HSN Code"
                                value={newItem.hsnCode}
                                onChange={(e) => setNewItem({ ...newItem, hsnCode: e.target.value })}
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Rate"
                                type="number"
                                value={newItem.rate}
                                onChange={(e) => setNewItem({ ...newItem, rate: e.target.value })}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="GST (%)"
                                type="number"
                                value={newItem.gst}
                                onChange={(e) => setNewItem({ ...newItem, gst: e.target.value })}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddNewItem} variant="contained" color="primary">
                        Add Item
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}