import {
    Paper,
    Typography,
    Divider,
    Box,
} from "@mui/material";

export default function InvoiceSummary({
    taxableAmount,
    cgst,
    sgst,
    grandTotal,
}) {
    return (
        <Paper
            elevation={3}
            sx={{
                width: 350,
                p: 2,
            }}
        >
            <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
            >
                <Typography>
                    Taxable Amount
                </Typography>

                <Typography>
                    ₹ {taxableAmount.toFixed(2)}
                </Typography>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
            >
                <Typography>
                    CGST (9%)
                </Typography>

                <Typography>
                    ₹ {cgst.toFixed(2)}
                </Typography>
            </Box>

            <Box
                display="flex"
                justifyContent="space-between"
                mb={1}
            >
                <Typography>
                    SGST (9%)
                </Typography>

                <Typography>
                    ₹ {sgst.toFixed(2)}
                </Typography>
            </Box>

            <Divider sx={{ my: 1 }} />

            <Box
                display="flex"
                justifyContent="space-between"
            >
                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    Grand Total
                </Typography>

                <Typography
                    variant="h6"
                    fontWeight="bold"
                >
                    ₹ {grandTotal.toFixed(2)}
                </Typography>
            </Box>
        </Paper>
    );
}