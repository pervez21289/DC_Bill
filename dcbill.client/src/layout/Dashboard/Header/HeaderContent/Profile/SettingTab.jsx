import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

// assets
import CommentOutlined from '@ant-design/icons/CommentOutlined';
import LockOutlined from '@ant-design/icons/LockOutlined';
import QuestionCircleOutlined from '@ant-design/icons/QuestionCircleOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';
import UnorderedListOutlined from '@ant-design/icons/UnorderedListOutlined';
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';

// store
import { logout } from './../../../../../store/authSlice';

// ==============================|| HEADER PROFILE - SETTING TAB ||============================== //

export default function SettingTab() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        // Dispatch the logout action from your auth slice
        dispatch(logout());

        // Close dialog
        setLogoutDialogOpen(false);

        // Navigate to login page
        navigate('/login', { replace: true });
    };

    const handleLogoutCancel = () => {
        setLogoutDialogOpen(false);
    };

    return (
        <>
            <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
            
                <ListItemButton onClick={(event) => navigate('/support')}>
                        <ListItemIcon>
                            <QuestionCircleOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Support" />
                    </ListItemButton>
               
                <ListItemButton onClick={() => navigate('/profile')}>
                    <ListItemIcon>
                        <UserOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Account Settings" />
                </ListItemButton>
                <ListItemButton>
                    <ListItemIcon>
                        <LockOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Privacy Center" />
                </ListItemButton>
                <Link underline="none" style={{ color: 'inherit' }} target="_blank" href="https://nexbillpos.com/support/">
                    <ListItemButton>
                        <ListItemIcon>
                            <CommentOutlined />
                        </ListItemIcon>
                        <ListItemText primary="Feedback" />
                    </ListItemButton>
                </Link>
                <ListItemButton onClick={() => navigate('/history')}>
                    <ListItemIcon>
                        <UnorderedListOutlined />
                    </ListItemIcon>
                    <ListItemText primary="History" />
                </ListItemButton>
                <ListItemButton onClick={handleLogoutClick}>
                    <ListItemIcon>
                        <LogoutOutlined />
                    </ListItemIcon>
                    <ListItemText primary="Logout" />
                </ListItemButton>
            </List>

            {/* Logout Confirmation Dialog */}
            <Dialog
                open={logoutDialogOpen}
                onClose={handleLogoutCancel}
                aria-labelledby="logout-dialog-title"
                aria-describedby="logout-dialog-description"
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        minWidth: { xs: '90%', sm: 400 }
                    }
                }}
            >
                <DialogTitle id="logout-dialog-title" sx={{ pb: 1 }}>
                    Confirm Logout
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="logout-dialog-description" sx={{ color: 'text.secondary' }}>
                        Are you sure you want to logout? You will need to login again to access your account.
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ pb: 2, px: 3 }}>
                    <Button
                        onClick={handleLogoutCancel}
                        variant="outlined"
                        color="secondary"
                        sx={{ textTransform: 'none' }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleLogoutConfirm}
                        variant="contained"
                        color="error"
                        sx={{ textTransform: 'none' }}
                        autoFocus
                    >
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}