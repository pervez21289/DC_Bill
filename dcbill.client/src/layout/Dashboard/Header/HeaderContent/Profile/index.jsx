import PropTypes from 'prop-types';
import { useRef, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

// project imports
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';
import Avatar from 'components/@extended/Avatar';
import MainCard from 'components/MainCard';
import Transitions from 'components/@extended/Transitions';
import IconButton from 'components/@extended/IconButton';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import avatar1 from 'assets/images/users/avatar-1.png';

// store
import { fetchBillingSettings } from './../../../../../store/billingSettingsSlice';
import { logout } from './../../../../../store/authSlice';

// tab panel wrapper
function TabPanel({ children, value, index, ...other }) {
    return (
        <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `profile-tab-${index}`,
        'aria-controls': `profile-tabpanel-${index}`
    };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

export default function Profile() {
    const theme = useTheme();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const anchorRef = useRef(null);
    const [open, setOpen] = useState(false);
    const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);

    // Get billing settings from Redux store
    const { data: billingData, loading: billingLoading } = useSelector((state) => state.billingSettings);

    // Get auth user from Redux store (using your existing selectors)
    const authUser = useSelector((state) => state.auth.user);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    useEffect(() => {
        // Fetch billing settings if not already loaded
     
        if (!billingData && !billingLoading) {
            dispatch(fetchBillingSettings());
        }
    }, [dispatch]);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    const [value, setValue] = useState(1);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    // Logout handlers
    const handleLogoutClick = () => {
        setLogoutDialogOpen(true);
        setOpen(false); // Close profile dropdown
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

    // Get company name from billing settings or user from auth
    const companyName = billingData?.companyName || authUser?.companyName || 'User';
    const userRole = billingData?.state || authUser?.role || 'User';
    const displayName = authUser?.name || authUser?.username || companyName;
    const userAvatar = authUser?.avatar || avatar1;

    return (
        <>
            <Box sx={{ flexShrink: 0, ml: 'auto' }}>
                <Tooltip title="Profile" disableInteractive>
                    <ButtonBase
                        sx={(theme) => ({
                            p: 0.25,
                            borderRadius: 1,
                            '&:focus-visible': { outline: `2px solid ${theme.vars.palette.secondary.dark}`, outlineOffset: 2 }
                        })}
                        aria-label="open profile"
                        ref={anchorRef}
                        aria-controls={open ? 'profile-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}
                    >
                        <Avatar
                            alt="profile user"
                            src={userAvatar}
                            size="sm"
                            sx={{ '&:hover': { outline: '1px solid', outlineColor: 'primary.main' } }}
                        />
                    </ButtonBase>
                </Tooltip>
                <Popper
                    placement="bottom-end"
                    open={open}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                    popperOptions={{
                        modifiers: [
                            {
                                name: 'offset',
                                options: {
                                    offset: [0, 9]
                                }
                            }
                        ]
                    }}
                >
                    {({ TransitionProps }) => (
                        <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
                            <Paper sx={(theme) => ({ boxShadow: theme.vars.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } })}>
                                <ClickAwayListener onClickAway={handleClose}>
                                    <MainCard elevation={0} border={false} content={false}>
                                        <CardContent sx={{ px: 2.5, pt: 3 }}>
                                            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                                                <Stack direction="row" sx={{ gap: 1.25, alignItems: 'center' }}>
                                                    <Avatar alt="profile user" src={userAvatar} sx={{ width: 32, height: 32 }} />
                                                    <Stack>
                                                        <Typography variant="h6">{displayName}</Typography>
                                                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                            {userRole}
                                                        </Typography>
                                                    </Stack>
                                                </Stack>
                                                <Tooltip title="Logout">
                                                    <IconButton
                                                        size="large"
                                                        sx={{ color: 'text.primary' }}
                                                        onClick={handleLogoutClick}
                                                        aria-label="logout"
                                                    >
                                                        <LogoutOutlined />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </CardContent>

                                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                            <Tabs variant="fullWidth" value={value} onChange={handleChange} aria-label="profile tabs">
                                                <Tab
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'row',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        textTransform: 'capitalize',
                                                        gap: 1.25,
                                                        '& .MuiTab-icon': {
                                                            marginBottom: 0
                                                        }
                                                    }}
                                                    icon={<SettingOutlined />}
                                                    label="Setting"
                                                    {...a11yProps(1)}
                                                />
                                            </Tabs>
                                        </Box>

                                        <TabPanel value={value} index={1} dir={theme.direction}>
                                            <SettingTab />
                                        </TabPanel>
                                    </MainCard>
                                </ClickAwayListener>
                            </Paper>
                        </Transitions>
                    )}
                </Popper>
            </Box>

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

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };