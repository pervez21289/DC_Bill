import {
    Grid,
    TextField,
} from "@mui/material";

export default function InvoiceHeader() {
    return (
        <Grid
            container
            spacing={2}
            mb={3}
        >
            <Grid item xs={3}>
                <TextField
                    fullWidth
                    label="Invoice No"
                />
            </Grid>

            <Grid item xs={3}>
                <TextField
                    fullWidth
                    type="date"
                    label="Date"
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
            </Grid>
        </Grid>
    );
}
