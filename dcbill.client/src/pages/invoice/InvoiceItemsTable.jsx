import {
    Box,
    Button,
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
} from "@mui/material";

import InvoiceItemRow from "./InvoiceItemRow";

export default function InvoiceItemsTable({
    items,
    setItems,
}) {
    const addRow = () => {
        setItems([
            ...items,
            {
                itemId: "",
                hsnCode: "",
                qty: 0,
                rate: 0,
                amount: 0,
            },
        ]);
    };

    return (
        <>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>
                            Item
                        </TableCell>
                        <TableCell>
                            HSN
                        </TableCell>
                        <TableCell>
                            Qty
                        </TableCell>
                        <TableCell>
                            Rate
                        </TableCell>
                        <TableCell>
                            Amount
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>

                <TableBody>
                    {items.map(
                        (item, index) => (
                            <InvoiceItemRow
                                key={index}
                                index={index}
                                item={item}
                                items={items}
                                setItems={setItems}
                            />
                        )
                    )}
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