import React, { useState } from 'react';
import { useCreateTicketMutation } from '../../services/ticketApi';
import {
    TextField,
    Button,
    Stack,
    Typography,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
} from '@mui/material';

export default function TicketForm() {
    const [ticket, setTicket] = useState({ subject: '', description: '', email: '' });
    const [createTicket, { isLoading }] = useCreateTicketMutation();
    const [ticketNumber, setTicketNumber] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const handleChange = (e) => {
        setTicket({ ...ticket, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const result = await createTicket(ticket).unwrap();
            setTicketNumber(result.ticketNumber);
            setOpenDialog(true);
            setTicket({ subject: '', description: '', email: '' });
        } catch (err) {
            console.error('Failed to submit ticket:', err);
        }
    };

    const handleClose = () => setOpenDialog(false);

    return (
        <>
            <form onSubmit={handleSubmit}>
                <Stack spacing={2}>
                    <Typography variant="h5">Submit a Support Ticket</Typography>
                    <TextField
                        label="Subject"
                        name="subject"
                        fullWidth
                        required
                        value={ticket.subject}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Description"
                        name="description"
                        fullWidth
                        multiline
                        rows={4}
                        required
                        value={ticket.description}
                        onChange={handleChange}
                    />
                    <TextField
                        label="Email"
                        name="email"
                        fullWidth
                        required
                        value={ticket.email}
                        onChange={handleChange}
                    />
                    <Button variant="contained" type="submit" disabled={isLoading}>
                        Submit
                    </Button>
                </Stack>
            </form>
            <Dialog open={openDialog} onClose={handleClose}>
                <DialogTitle
                    sx={{
                        backgroundColor: '#52c41a',
                        color: '#ffffff',
                    }}
                >
                    Ticket Submitted
                </DialogTitle>

                <DialogContent
                    sx={{
                        backgroundColor: '#e8f8e4', // light tint of #52c41a
                    }}
                >
                    <DialogContentText sx={{ color: '#2a7a0b' }}>
                        Your support ticket has been submitted successfully.
                        <br />
                        <strong>Ticket Number:</strong> {ticketNumber}
                    </DialogContentText>
                </DialogContent>

                <DialogActions
                    sx={{
                        backgroundColor: '#e8f8e4',
                    }}
                >
                    <Button
                        onClick={handleClose}
                        autoFocus
                        variant="contained"
                        sx={{
                            backgroundColor: '#52c41a',
                            '&:hover': { backgroundColor: '#3da40e' },
                        }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>


        </>
    );
}
