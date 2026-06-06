import { useEffect } from "react";
import { Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';

import InvoiceHeader from "./InvoiceHeader/index";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import useInvoiceCalculation from "./useInvoiceCalculation";
import { fetchItemMaster } from "./../../store/itemMasterSlice";

export default function InvoicePage() {
    const dispatch = useDispatch();
    const items = useSelector(state => state.invoiceItems.items);
    const calculations = useInvoiceCalculation(items);

    useEffect(() => {
        dispatch(fetchItemMaster());
    }, [dispatch]);

    // Debug: Log calculations to console
    useEffect(() => {
        console.log('Calculations:', calculations);
    }, [calculations]);

    return (
        <Box p={3}>
            <InvoiceHeader />

            <InvoiceItemsTable />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                }}
            >
                <InvoiceSummary
                    subtotal={calculations.subtotal}
                    totalGST={calculations.totalGST}
                    total={calculations.grandTotal}
                    itemsCount={calculations.itemsCount}
                />
            </Box>
        </Box>
    );
}