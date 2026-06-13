import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// third-party
import { NumericFormat } from 'react-number-format';

// project imports
import Dot from 'components/@extended/Dot';
import { fetchRecentInvoices, selectRecentInvoices, selectReportLoading } from 'store/reportSlice';

function OrderStatus({ status }) {
    let color;
    let title;

    switch (status?.toLowerCase()) {
        case 'paid':
            color = 'success';
            title = 'Paid';
            break;
        case 'pending':
            color = 'warning';
            title = 'Pending';
            break;
        case 'cancelled':
            color = 'error';
            title = 'Cancelled';
            break;
        default:
            color = 'primary';
            title = status || 'Draft';
    }

    return (
        <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
            <Dot color={color} />
            <Typography>{title}</Typography>
        </Stack>
    );
}

export default function OrderTable() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const recentInvoices = useSelector(selectRecentInvoices);
    const loading = useSelector(selectReportLoading);

    useEffect(() => {
        dispatch(fetchRecentInvoices({ count: 10 }));
    }, [dispatch]);

    const handleRowClick = (invoiceId) => {
        navigate(`/invoice/${invoiceId}`);
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <TableContainer
                sx={{
                    width: '100%',
                    overflowX: 'auto',
                    position: 'relative',
                    display: 'block',
                    maxWidth: '100%',
                    '& td, & th': { whiteSpace: 'nowrap' }
                }}
            >
                <Table aria-labelledby="tableTitle">
                    <TableHead>
                        <TableRow>
                            <TableCell>Invoice No.</TableCell>
                            <TableCell>Customer Name</TableCell>
                            <TableCell align="right">Items</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Total Amount</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {recentInvoices.map((row, index) => (
                            <TableRow
                                hover
                                onClick={() => handleRowClick(row.id)}
                                sx={{
                                    '&:last-child td, &:last-child th': { border: 0 },
                                    cursor: 'pointer'
                                }}
                                tabIndex={-1}
                                key={row.invoiceNo}
                            >
                                <TableCell component="th" scope="row">
                                    <Link sx={{ color: 'secondary.main' }}>{row.invoiceNo}</Link>
                                </TableCell>
                                <TableCell>{row.partyName}</TableCell>
                                <TableCell align="right">{row.itemCount}</TableCell>
                                <TableCell>
                                    <OrderStatus status={row.status} />
                                </TableCell>
                                <TableCell align="right">
                                    <NumericFormat
                                        value={row.totalAmount}
                                        displayType="text"
                                        thousandSeparator
                                        prefix="₹"
                                    />
                                </TableCell>
                            </TableRow>
                        ))}
                        {recentInvoices.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                    <Typography sx={{ color: 'text.secondary' }}>No invoices found</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}