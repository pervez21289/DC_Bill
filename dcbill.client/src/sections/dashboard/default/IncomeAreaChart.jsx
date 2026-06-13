import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// material-ui
import { useTheme } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { axisClasses, chartsGridClasses, lineClasses } from '@mui/x-charts';
import { LineChart } from '@mui/x-charts/LineChart';

// project imports
import { withAlpha } from 'utils/colorUtils';
import { fetchRevenueTrend, selectRevenueTrend, selectReportLoading } from 'store/reportSlice';

function Legend({ items, onToggle }) {
    return (
        <Stack direction="row" sx={{ gap: 2, alignItems: 'center', justifyContent: 'center', mt: 2.5, mb: 1.5 }}>
            {items.map((item) => (
                <Stack
                    key={item.label}
                    direction="row"
                    sx={{ gap: 1.25, alignItems: 'center', cursor: 'pointer' }}
                    onClick={() => onToggle(item.label)}
                >
                    <Box sx={{ width: 12, height: 12, bgcolor: item.visible ? item.color : 'text.secondary', borderRadius: '50%' }} />
                    <Typography variant="body2" sx={{ color: 'text.primary' }}>
                        {item.label}
                    </Typography>
                </Stack>
            ))}
        </Stack>
    );
}

export default function IncomeAreaChart({ view = 'monthly' }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const revenueTrend = useSelector(selectRevenueTrend);
    const loading = useSelector(selectReportLoading);

    const [visibility, setVisibility] = useState({
        Revenue: true,
        Invoices: true
    });

    useEffect(() => {
        let trendType = 'daily';
        if (view === 'monthly') trendType = 'monthly';
        else if (view === 'weekly') trendType = 'weekly';

        dispatch(fetchRevenueTrend({ trendType }));
    }, [dispatch, view]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 450 }}>
                <CircularProgress />
            </Box>
        );
    }

    const labels = revenueTrend.map(item => item.periodLabel);
    const revenueData = revenueTrend.map(item => item.revenue / 1000);
    const invoiceCountData = revenueTrend.map(item => item.invoiceCount);

    const line = theme.vars.palette.divider;

    const toggleVisibility = (label) => {
        setVisibility((prev) => ({ ...prev, [label]: !prev[label] }));
    };

    const visibleSeries = [
        {
            data: revenueData,
            label: 'Revenue (₹K)',
            showMark: false,
            area: true,
            id: 'revenue',
            color: theme.vars.palette.primary.main || '#2563eb',
            visible: visibility['Revenue']
        },
        {
            data: invoiceCountData,
            label: 'Invoices Count',
            showMark: false,
            area: true,
            id: 'invoices',
            color: theme.vars.palette.secondary.main || '#f59e0b',
            visible: visibility['Invoices']
        }
    ];

    return (
        <>
            <LineChart
                hideLegend
                grid={{ horizontal: true, vertical: false }}
                xAxis={[{ scaleType: 'point', data: labels, tickSize: 7, disableLine: true }]}
                yAxis={[{ tickSize: 7, disableLine: true }]}
                height={450}
                margin={{ top: 40, bottom: -5, right: 20, left: 5 }}
                series={visibleSeries
                    .filter((series) => series.visible)
                    .map((series) => ({
                        type: 'line',
                        data: series.data,
                        label: series.label,
                        showMark: series.showMark,
                        area: series.area,
                        id: series.id,
                        color: series.color,
                        stroke: series.color,
                        strokeWidth: 2
                    }))}
                sx={{
                    [`& .${chartsGridClasses.line}`]: { strokeDasharray: '4 4', stroke: line },
                    [`& .${lineClasses.area}`]: {
                        '&[data-series-id="revenue"]': { fill: "url('#revenueGradient')", strokeWidth: 2, opacity: 0.8 },
                        '&[data-series-id="invoices"]': { fill: "url('#invoiceGradient')", strokeWidth: 2, opacity: 0.8 }
                    },
                    [`& .${axisClasses.root}.${axisClasses.directionX} .${axisClasses.tick}`]: { stroke: 'transparent' },
                    [`& .${axisClasses.root}.${axisClasses.directionY} .${axisClasses.tick}`]: { stroke: 'transparent' }
                }}
            >
                <defs>
                    <linearGradient id="revenueGradient" gradientTransform="rotate(90)">
                        <stop offset="10%" stopColor={withAlpha(theme.vars.palette.primary.main, 0.4)} />
                        <stop offset="90%" stopColor={withAlpha(theme.vars.palette.background.default, 0.1)} />
                    </linearGradient>
                    <linearGradient id="invoiceGradient" gradientTransform="rotate(90)">
                        <stop offset="10%" stopColor={withAlpha(theme.vars.palette.secondary.main, 0.4)} />
                        <stop offset="90%" stopColor={withAlpha(theme.vars.palette.background.default, 0.1)} />
                    </linearGradient>
                </defs>
            </LineChart>
            <Legend items={visibleSeries} onToggle={toggleVisibility} />
        </>
    );
}

IncomeAreaChart.propTypes = { view: PropTypes.oneOf(['monthly', 'weekly', 'daily']) };