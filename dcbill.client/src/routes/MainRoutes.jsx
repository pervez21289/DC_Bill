// project imports
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

// render - Dashboard
import DashboardDefault from 'pages/dashboard/default';

// render - color
import Color from 'pages/component-overview/color';
import Typography from 'pages/component-overview/typography';
import Shadow from 'pages/component-overview/shadows';

// render - sample page
import SamplePage from 'pages/extra-pages/sample-page';

// render - invoice page
import InvoicePage from '../pages/invoice/InvoicePage';
import InvoiceView from '../pages/invoice/InvoiceView';
import BillingSettings from '../pages/billingsettings/BillingSettings';
import InvoiceGrid from '../pages/invoice/InvoiceGrid';

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
    path: '/',
    element: <ProtectedRoute />,       // 🔒 Guards all children below
    children: [
        {
            element: <DashboardLayout />,
            children: [
                {
                    path: '/',
                    element: <DashboardDefault />
                },
                {
                    path: 'dashboard/default',
                    element: <DashboardDefault />
                },
                {
                    path: 'dashboard',
                    element: <InvoiceGrid />
                },
                {
                    path: 'invoices',
                    element: <InvoiceGrid />
                },
                {
                    path: 'invoice/create',
                    element: <InvoicePage />
                },
                {
                    path: 'invoice/:id',
                    element: <InvoiceView />
                },
                {
                    path: 'profile',
                    element: <BillingSettings />
                },
                {
                    path: 'color',
                    element: <Color />
                },
                {
                    path: 'shadow',
                    element: <Shadow />
                },
                {
                    path: 'sample-page',
                    element: <SamplePage />
                }
            ]
        }
    ]
};

export default MainRoutes;