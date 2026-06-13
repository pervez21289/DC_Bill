import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';
import ProtectedRoute from './ProtectedRoute';

// render- Dashboard
const DashboardDefault = Loadable(lazy(() => import('pages/dashboard/default')));

// render - color
const Color = Loadable(lazy(() => import('pages/component-overview/color')));
const Typography = Loadable(lazy(() => import('pages/component-overview/typography')));
const Shadow = Loadable(lazy(() => import('pages/component-overview/shadows')));

// render - sample page
const SamplePage = Loadable(lazy(() => import('pages/extra-pages/sample-page')));

// render - invoice page
const InvoicePage = Loadable(lazy(() => import('../pages/invoice/InvoicePage')));
const InvoiceView = Loadable(lazy(() => import('../pages/invoice/InvoiceView')));
const BillingSettings = Loadable(lazy(() => import('../pages/billingsettings/BillingSettings')));
const InvoiceGrid = Loadable(lazy(() => import('../pages/invoice/InvoiceGrid')));

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
