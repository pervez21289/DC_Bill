import {
    TableRow,
    TableCell,
    TextField,
    IconButton,
    Autocomplete
} from '@mui/material';

const itemMaster = [
    {
        id: 1,
        itemName: 'Cement OPC 43',
        hsnCode: '2523',
        rate: 310,
        gst: 18
    },
    {
        id: 2,
        itemName: 'Cement PPC',
        hsnCode: '2523',
        rate: 295,
        gst: 18
    },
    {
        id: 3,
        itemName: 'TMT Steel 10mm',
        hsnCode: '7214',
        rate: 65000,
        gst: 18
    }
];

export default function InvoiceItemRow({
    item,
    index,
    items,
    setItems
}) {
    const updateItem = (updatedRow) => {
        const copy = [...items];

        const qty = Number(updatedRow.qty || 0);
        const rate = Number(updatedRow.rate || 0);

        updatedRow.amount = qty * rate;

        copy[index] = updatedRow;

        setItems(copy);
    };

    const handleItemSelect = (_, selectedItem) => {
        if (!selectedItem) return;

        updateItem({
            ...item,
            itemId: selectedItem.id,
            itemName: selectedItem.itemName,
            hsnCode: selectedItem.hsnCode,
            rate: selectedItem.rate,
            gst: selectedItem.gst
        });
    };

    const handleChange = (field, value) => {
        updateItem({
            ...item,
            [field]: value
        });
    };

    const deleteRow = () => {
        setItems(items.filter((_, i) => i !== index));
    };

    return (
        <TableRow>
            <TableCell sx={{ minWidth: 250 }}>
                <Autocomplete
                    options={itemMaster}
                    getOptionLabel={(option) =>
                        option.itemName || ''
                    }
                    value={
                        itemMaster.find(
                            (x) => x.id === item.itemId
                        ) || null
                    }
                    onChange={handleItemSelect}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            size="small"
                            placeholder="Search Item"
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
                        handleChange(
                            'qty',
                            e.target.value
                        )
                    }
                />
            </TableCell>

            <TableCell>
                <TextField
                    size="small"
                    type="number"
                    value={item.rate || ''}
                    onChange={(e) =>
                        handleChange(
                            'rate',
                            e.target.value
                        )
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
                <IconButton
                    color="error"
                    onClick={deleteRow}
                >
                    ❌
                </IconButton>
            </TableCell>
        </TableRow>
    );
}