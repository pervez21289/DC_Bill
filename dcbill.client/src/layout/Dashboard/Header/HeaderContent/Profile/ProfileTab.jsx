import { useNavigate } from 'react-router-dom';
import { List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import {
  EditOutlined,
  PersonOutlined,        // Instead of UserOutlined
  AccountCircleOutlined,  // Alternative for profile
  CreditCardOutlined,     // Instead of WalletOutlined
  LogoutOutlined,
} from '@mui/icons-material';

export default function ProfileTab() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
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