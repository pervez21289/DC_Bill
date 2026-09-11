import { Container } from '@mui/material';
import TicketForm from './TicketForm';
import TicketList from './TicketList';

function index() {
    return (
        <Container maxWidth="sm">
            <TicketForm />
            <TicketList />
        </Container>
    );
}

export default index;