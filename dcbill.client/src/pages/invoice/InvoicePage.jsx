import { useState } from "react";
import { Box } from "@mui/material";

import InvoiceHeader from "./InvoiceHeader";
import InvoiceItemsTable from "./InvoiceItemsTable";
import InvoiceSummary from "./InvoiceSummary";
import useInvoiceCalculation from "./useInvoiceCalculation";

export default function InvoicePage() {
    const [items, setItems] = useState([]);

    const calculations = useInvoiceCalculation(items);

    return (
        <Box p={3}>
            <InvoiceHeader />

            <InvoiceItemsTable
                items={items}
                setItems={setItems}
            />

            <Box
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    mt: 3,
                }}
            >
                <InvoiceSummary {...calculations} />
            </Box>
        </Box>
    );
}