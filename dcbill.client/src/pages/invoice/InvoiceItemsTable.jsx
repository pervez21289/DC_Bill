import {
    Box,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from './../../store/invoiceItemsSlice';
import InvoiceItemRow from "./InvoiceItemRow";

export default function InvoiceItemsTable() {
    const dispatch = useDispatch();
    const items = useSelector(state => state.invoiceItems.items);

    const addRow = () => {
        dispatch(addItem({}));
    };

    return (
        <>
            <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: '0.75rem', py: 0.5 } }}>
                <TableHead>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Item</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>HSN</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Qty</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Rate</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>Amount</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }}>GST</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', fontSize: '0.75rem' }} />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.map((_, index) => (
                        <InvoiceItemRow
                            key={index}
                            index={index}
                        />
                    ))}
                </TableBody>
            </Table>

            <Box mt={1}>
                <Button
                    variant="contained"
                    onClick={addRow}
                    size="small"
                    sx={{ fontSize: '0.7rem' }}
                >
                    Add Item
                </Button>
            </Box>
        </>
    );
}