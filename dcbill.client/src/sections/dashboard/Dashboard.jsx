// pages/dashboard/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Grid, Box, Typography, Card, CardContent, Skeleton } from '@mui/material';
import { TrendingUp, Receipt, Inventory, People } from '@mui/icons-material';

// Project imports
import MainCard from 'components/MainCard';
import UniqueVisitorCard from './UniqueVisitorCard';
import MonthlyBarChart from './MonthlyBarChart';
import OrderTable from './OrderTable';
import ReportAreaChart from './ReportAreaChart';
import SaleReportCard from './SaleReportCard';
import { fetchDashboardSummary, selectDashboardStats, selectReportLoading } from 'store/reportSlice';

export default function Dashboard() {
    const dispatch = useDispatch();
    const stats = useSelector(selectDashboardStats);
    const loading = useSelector(selectReportLoading);

    useEffect(() => {
        dispatch(fetchDashboardSummary());
    }, [dispatch]);

    const summaryCards = [
        {
            title: 'Total Revenue',
            value: `₹${stats.totalRevenue?.toLocaleString() || 0}`,
            icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
            color: '#2563eb'
        },
        {
            title: 'Total Invoices',
            value: stats.totalInvoices || 0,
            icon: <Receipt sx={{ fontSize: 40, color: 'success.main' }} />,
            color: '#16a34a'
        },
        {
            title: 'Unique Customers',
            value: stats.uniqueCustomers || 0,
            icon: <People sx={{ fontSize: 40, color: 'warning.main' }} />,
            color: '#f59e0b'
        },
        {
            title: 'Avg Invoice Value',
            value: `₹${stats.avgInvoiceValue?.toLocaleString() || 0}`,
            icon: <Inventory sx={{ fontSize: 40, color: 'info.main' }} />,
            color: '#06b6d4'
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {summaryCards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Card sx={{ height: '100%' }}>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <Box>
                                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                            {card.title}
                                        </Typography>
                                        {loading ? (
                                            <Skeleton variant="text" width={100} height={40} />
                                        ) : (
                                            <Typography variant="h4">{card.value}</Typography>
                                        )}
                                    </Box>
                                    <Box sx={{ opacity: 0.7 }}>{card.icon}</Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <UniqueVisitorCard />
                </Grid>
                <Grid item xs={12} md={4}>
                    <MainCard title="Monthly Revenue">
                        <MonthlyBarChart />
                    </MainCard>
                </Grid>
                <Grid item xs={12} md={6}>
                    <SaleReportCard />
                </Grid>
                <Grid item xs={12} md={6}>
                    <MainCard title="Last 7 Days Revenue">
                        <ReportAreaChart />
                    </MainCard>
                </Grid>
                <Grid item xs={12}>
                    <MainCard title="Recent Invoices">
                        <OrderTable />
                    </MainCard>
                </Grid>
            </Grid>
        </Box>
    );
}