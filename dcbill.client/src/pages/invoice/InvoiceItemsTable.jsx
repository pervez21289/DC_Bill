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
import { addItem } from './../../store/invoiceItemsSlice';  // Corrected path
import InvoiceItemRow from "./InvoiceItemRow";

export default function InvoiceItemsTable() {
    const dispatch = useDispatch();
    const items = useSelector(state => state.invoiceItems.items);

    const addRow = () => {
        dispatch(addItem({}));
    };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Item</TableCell>
                        <TableCell>HSN</TableCell>
                        <TableCell>Qty</TableCell>
                        <TableCell>Rate</TableCell>
                        <TableCell>Amount</TableCell>
                        <TableCell>GST</TableCell>
                        <TableCell />
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

            <Box mt={2}>
                <Button
                    variant="contained"
                    onClick={addRow}
                >
                    Add Item
                </Button>
            </Box>
        </>
    );
}