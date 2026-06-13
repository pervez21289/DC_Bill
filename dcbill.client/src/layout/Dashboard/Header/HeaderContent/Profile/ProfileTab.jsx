import { useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  EditOutlined,
  PersonOutlined,        // Instead of UserOutlined
  AccountCircleOutlined,  // Alternative for profile
  CreditCardOutlined,     // Instead of WalletOutlined
  LogoutOutlined,
} from '@mui/icons-material';

// project imports
import { logout, selectAuthUser } from 'store/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export default function ProfileTab() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector(selectAuthUser);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login', { replace: true });
    };


  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton onClick={() => navigate('/edit-profile')}>
        <ListItemIcon>
          <EditOutlined />
        </ListItemIcon>
        <ListItemText primary="Edit Profile" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate('/profile')}>
        <ListItemIcon>
          <PersonOutlined />
        </ListItemIcon>
        <ListItemText primary="View Profile" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate('/social-profile')}>
        <ListItemIcon>
          <AccountCircleOutlined />
        </ListItemIcon>
        <ListItemText primary="Social Profile" />
      </ListItemButton>

      <ListItemButton onClick={() => navigate('/billing-settings')}>
        <ListItemIcon>
          <CreditCardOutlined />
        </ListItemIcon>
        <ListItemText primary="Billing" />
      </ListItemButton>

      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
}