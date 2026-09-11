import { useGetTicketsQuery } from '../../services/ticketApi';
import {
    Card,
    CardContent,
    Typography,
    Stack,
    Divider,
    Box,
    useTheme,
    useMediaQuery,
} from '@mui/material';

export default function TicketList() {
    const { data: tickets = [], isLoading } = useGetTicketsQuery();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    if (isLoading) return <Typography>Loading...</Typography>;

    return (
        <Stack spacing={3} mt={4}>
            {tickets.map(ticket => (
                <Card
                    key={ticket.id}
                    sx={{
                        borderLeft: '6px solid #52c41a',
                        boxShadow: 3,
                        paddingX: 1,
                    }}
                >
                    <CardContent sx={{ paddingBottom: '16px !important' }}>
                        <Typography
                            variant={isMobile ? 'subtitle1' : 'h6'}
                            color="primary"
                            gutterBottom
                            sx={{ wordBreak: 'break-word' }}
                        >
                            Ticket #{ticket.ticketNumber}
                        </Typography>

                        <Box mb={1}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
                            >
                                Subject
                            </Typography>
                            <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                {ticket.subject}
                            </Typography>
                        </Box>

                        <Box mb={1}>
                            <Typography
                                variant="subtitle2"
                                color="textSecondary"
                                sx={{ fontSize: isMobile ? '0.85rem' : '1rem' }}
                            >
                                Description
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    whiteSpace: 'pre-line',
                                    wordBreak: 'break-word',
                                    fontSize: isMobile ? '0.9rem' : '1rem',
                                }}
                            >
                                {ticket.description}
                            </Typography>
                        </Box>

                        <Divider sx={{ my: 2 }} />

                        <Box
                            display="flex"
                            flexDirection={isMobile ? 'column' : 'row'}
                            justifyContent="space-between"
                            gap={1}
                        >
                            <Box>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Submitted By
                                </Typography>
                                <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
                                    {ticket.email}
                                </Typography>
                            </Box>

                            <Box textAlign={isMobile ? 'left' : 'right'}>
                                <Typography variant="subtitle2" color="textSecondary">
                                    Created At
                                </Typography>
                                <Typography variant="body2">
                                    {new Date(ticket.createdAt).toLocaleString()}
                                </Typography>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            ))}
        </Stack>
    );
}
