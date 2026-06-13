import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// project imports
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import MonthlyBarChart from 'sections/dashboard/default/MonthlyBarChart';
import ReportAreaChart from 'sections/dashboard/default/ReportAreaChart';
import UniqueVisitorCard from 'sections/dashboard/default/UniqueVisitorCard';
import SaleReportCard from 'sections/dashboard/default/SaleReportCard';
import OrdersTable from 'sections/dashboard/default/OrdersTable';

// Redux imports
import { fetchDashboardSummary, selectDashboardStats, selectReportLoading, selectReportError, clearReportError } from 'store/reportSlice';
import { fetchRecentInvoices, selectRecentInvoices } from 'store/reportSlice';

// assets
import EllipsisOutlined from '@ant-design/icons/EllipsisOutlined';
import GiftOutlined from '@ant-design/icons/GiftOutlined';
import MessageOutlined from '@ant-design/icons/MessageOutlined';
import SettingOutlined from '@ant-design/icons/SettingOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import avatar1 from 'assets/images/users/avatar-1.png';
import avatar2 from 'assets/images/users/avatar-2.png';
import avatar3 from 'assets/images/users/avatar-3.png';
import avatar4 from 'assets/images/users/avatar-4.png';

// avatar style
const avatarSX = {
    width: 36,
    height: 36,
    fontSize: '1rem'
};

// action style
const actionSX = {
    mt: 0.75,
    ml: 1,
    top: 'auto',
    right: 'auto',
    alignSelf: 'flex-start',
    transform: 'none'
};

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {
    const dispatch = useDispatch();
    const dashboardStats = useSelector(selectDashboardStats);
    const recentInvoices = useSelector(selectRecentInvoices);
    const loading = useSelector(selectReportLoading);
    const error = useSelector(selectReportError);

    const [orderMenuAnchor, setOrderMenuAnchor] = useState(null);
    const [analyticsMenuAnchor, setAnalyticsMenuAnchor] = useState(null);

    useEffect(() => {
        // Fetch dashboard data on component mount
        dispatch(fetchDashboardSummary());
        dispatch(fetchRecentInvoices({ count: 10 }));

        // Clear error on unmount
        return () => {
            dispatch(clearReportError());
        };
    }, [dispatch]);

    const handleOrderMenuClick = (event) => {
        setOrderMenuAnchor(event.currentTarget);
    };
    const handleOrderMenuClose = () => {
        setOrderMenuAnchor(null);
    };

    const handleAnalyticsMenuClick = (event) => {
        setAnalyticsMenuAnchor(event.currentTarget);
    };
    const handleAnalyticsMenuClose = () => {
        setAnalyticsMenuAnchor(null);
    };

    // Calculate percentage changes (mock data - you can calculate from API if available)
    const revenueChange = 59.3;
    const usersChange = 70.5;
    const ordersChange = 27.4;
    const salesChange = 27.4;

    // Format currency
    const formatCurrency = (value) => {
        if (!value) return '₹0';
        return `₹${value.toLocaleString('en-IN')}`;
    };

    // Format number
    const formatNumber = (value) => {
        if (!value) return '0';
        return value.toLocaleString('en-IN');
    };

    if (loading && !dashboardStats.totalRevenue) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <MainCard>
                    <Typography color="error" align="center">
                        Error loading dashboard: {error}
                    </Typography>
                    <Button
                        sx={{ mt: 2, display: 'block', mx: 'auto' }}
                        variant="contained"
                        onClick={() => dispatch(fetchDashboardSummary())}
                    >
                        Retry
                    </Button>
                </MainCard>
            </Box>
        );
    }

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 - Header */}
            <Grid sx={{ mb: -2.25 }} size={12}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>

            {/* Row 1 - Statistics Cards */}
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <AnalyticEcommerce
                    title="Total Revenue"
                    count={formatCurrency(dashboardStats.totalRevenue)}
                    percentage={revenueChange}
                    extra={formatCurrency(dashboardStats.totalRevenue / 10)}
                    icon={<TrendingUpIcon sx={{ fontSize: '1.5rem' }} />}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <AnalyticEcommerce
                    title="Total Invoices"
                    count={formatNumber(dashboardStats.totalInvoices)}
                    percentage={usersChange}
                    extra={formatNumber(dashboardStats.totalInvoices / 10)}
                    icon={<PeopleIcon sx={{ fontSize: '1.5rem' }} />}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <AnalyticEcommerce
                    title="Unique Customers"
                    count={formatNumber(dashboardStats.uniqueCustomers)}
                    percentage={ordersChange}
                    isLoss
                    color="warning"
                    extra={formatNumber(dashboardStats.uniqueCustomers / 10)}
                    icon={<ShoppingCartIcon sx={{ fontSize: '1.5rem' }} />}
                />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
                <AnalyticEcommerce
                    title="Avg Invoice Value"
                    count={formatCurrency(dashboardStats.avgInvoiceValue)}
                    percentage={salesChange}
                    isLoss
                    color="warning"
                    extra={formatCurrency(dashboardStats.avgInvoiceValue / 10)}
                    icon={<AttachMoneyIcon sx={{ fontSize: '1.5rem' }} />}
                />
            </Grid>

            <Grid sx={{ display: { sm: 'none', md: 'block', lg: 'none' } }} size={{ md: 8 }} />

            {/* Row 2 - Charts */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <UniqueVisitorCard />
            </Grid>
            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                        <Typography variant="h5">Income Overview</Typography>
                    </Grid>
                    <Grid />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <Box sx={{ p: 3, pb: 0 }}>
                        <Stack sx={{ gap: 2 }}>
                            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                                Total Revenue
                            </Typography>
                            <Typography variant="h3">{formatCurrency(dashboardStats.totalRevenue)}</Typography>
                            <Typography variant="caption" sx={{ color: 'success.main' }}>
                                +{revenueChange}% from last period
                            </Typography>
                        </Stack>
                    </Box>
                    <MonthlyBarChart />
                </MainCard>
            </Grid>

            {/* Row 3 - Recent Orders & Analytics */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                        <Typography variant="h5">Recent Invoices</Typography>
                    </Grid>
                    <Grid>
                        <IconButton onClick={handleOrderMenuClick}>
                            <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
                        </IconButton>
                        <Menu
                            id="fade-menu"
                            slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
                            anchorEl={orderMenuAnchor}
                            onClose={handleOrderMenuClose}
                            open={Boolean(orderMenuAnchor)}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={handleOrderMenuClose}>Export as CSV</MenuItem>
                            <MenuItem onClick={handleOrderMenuClose}>Export as Excel</MenuItem>
                            <MenuItem onClick={handleOrderMenuClose}>Print Table</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <OrdersTable />
                </MainCard>
            </Grid>

            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                        <Typography variant="h5">Analytics Report</Typography>
                    </Grid>
                    <Grid>
                        <IconButton onClick={handleAnalyticsMenuClick}>
                            <EllipsisOutlined style={{ fontSize: '1.25rem' }} />
                        </IconButton>
                        <Menu
                            id="fade-menu"
                            slotProps={{ list: { 'aria-labelledby': 'fade-button' } }}
                            anchorEl={analyticsMenuAnchor}
                            open={Boolean(analyticsMenuAnchor)}
                            onClose={handleAnalyticsMenuClose}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                        >
                            <MenuItem onClick={handleAnalyticsMenuClose}>Weekly</MenuItem>
                            <MenuItem onClick={handleAnalyticsMenuClose}>Monthly</MenuItem>
                            <MenuItem onClick={handleAnalyticsMenuClose}>Yearly</MenuItem>
                        </Menu>
                    </Grid>
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <List sx={{ p: 0, '& .MuiListItemButton-root': { py: 2 } }}>
                        <ListItemButton divider>
                            <ListItemText primary="Total Revenue" />
                            <Typography variant="h5">{formatCurrency(dashboardStats.totalRevenue)}</Typography>
                        </ListItemButton>
                        <ListItemButton divider>
                            <ListItemText primary="Total GST Collected" />
                            <Typography variant="h5">{formatCurrency(dashboardStats.totalGSTCollected)}</Typography>
                        </ListItemButton>
                        <ListItemButton divider>
                            <ListItemText primary="Paid Invoices" />
                            <Typography variant="h5">{formatNumber(dashboardStats.paidInvoices)}</Typography>
                        </ListItemButton>
                        <ListItemButton>
                            <ListItemText primary="Pending Invoices" />
                            <Typography variant="h5">{formatNumber(dashboardStats.pendingInvoices)}</Typography>
                        </ListItemButton>
                    </List>
                    <ReportAreaChart />
                </MainCard>
            </Grid>

            {/* Row 4 - Sales Report & Transaction History */}
            <Grid size={{ xs: 12, md: 7, lg: 8 }}>
                <SaleReportCard />
            </Grid>

            <Grid size={{ xs: 12, md: 5, lg: 4 }}>
                <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Grid>
                        <Typography variant="h5">Quick Stats</Typography>
                    </Grid>
                    <Grid />
                </Grid>
                <MainCard sx={{ mt: 2 }} content={false}>
                    <List
                        component="nav"
                        sx={{
                            px: 0,
                            py: 0,
                            '& .MuiListItemButton-root': {
                                py: 1.5,
                                px: 2,
                                '& .MuiAvatar-root': avatarSX,
                                '& .MuiListItemSecondaryAction-root': { ...actionSX, position: 'relative' }
                            }
                        }}
                    >
                        <ListItem
                            component={ListItemButton}
                            divider
                            secondaryAction={
                                <Stack sx={{ alignItems: 'flex-end' }}>
                                    <Typography variant="subtitle1" noWrap>
                                        {formatCurrency(dashboardStats.totalRevenue)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'success.main' }} noWrap>
                                        Total Revenue
                                    </Typography>
                                </Stack>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ color: 'success.main', bgcolor: 'success.lighter' }}>
                                    <GiftOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Revenue</Typography>} secondary="All time" />
                        </ListItem>
                        <ListItem
                            component={ListItemButton}
                            divider
                            secondaryAction={
                                <Stack sx={{ alignItems: 'flex-end' }}>
                                    <Typography variant="subtitle1" noWrap>
                                        {formatNumber(dashboardStats.totalInvoices)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'primary.main' }} noWrap>
                                        Total Invoices
                                    </Typography>
                                </Stack>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ color: 'primary.main', bgcolor: 'primary.lighter' }}>
                                    <MessageOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Invoices</Typography>} secondary="Generated" />
                        </ListItem>
                        <ListItem
                            component={ListItemButton}
                            secondaryAction={
                                <Stack sx={{ alignItems: 'flex-end' }}>
                                    <Typography variant="subtitle1" noWrap>
                                        {formatNumber(dashboardStats.uniqueCustomers)}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: 'warning.main' }} noWrap>
                                        Customers
                                    </Typography>
                                </Stack>
                            }
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ color: 'error.main', bgcolor: 'error.lighter' }}>
                                    <SettingOutlined />
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText primary={<Typography variant="subtitle1">Customers</Typography>} secondary="Unique" />
                        </ListItem>
                    </List>
                </MainCard>

                <MainCard sx={{ mt: 2 }}>
                    <Stack sx={{ gap: 3 }}>
                        <Grid container sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Grid>
                                <Stack>
                                    <Typography variant="h5" noWrap>
                                        Invoice Summary
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: 'secondary.main' }} noWrap>
                                        Paid vs Pending
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="h6" color="success.main">
                                        Paid: {formatNumber(dashboardStats.paidInvoices)}
                                    </Typography>
                                    <Typography variant="caption" color="warning.main">
                                        Pending: {formatNumber(dashboardStats.pendingInvoices)}
                                    </Typography>
                                </Box>
                            </Grid>
                        </Grid>
                        <Button
                            size="small"
                            variant="contained"
                            sx={{ textTransform: 'capitalize' }}
                            onClick={() => window.location.href = '/invoices'}
                        >
                            View All Invoices
                        </Button>
                    </Stack>
                </MainCard>
            </Grid>
        </Grid>
    );
}