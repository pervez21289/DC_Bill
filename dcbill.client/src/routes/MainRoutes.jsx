import { lazy } from 'react';

// project imports
import Loadable from 'components/Loadable';
import DashboardLayout from 'layout/Dashboard';

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
const BillingSettings = Loadable(lazy(() => import('../pages/billingsettings/BillingSettings')));
const InvoiceGrid = Loadable(lazy(() => import('../pages/invoice/InvoiceGrid')));
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: '/',
  element: <DashboardLayout />,
  children: [
    {
      path: '/',
          element: <InvoiceGrid />
    },
    {
      path: 'dashboard',
      children: [
        {
          path: 'default',
              element: <InvoiceGrid />
        }
      ]
      },
      {
          path: 'Invoice',
          element: <InvoicePage />
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
};

export default MainRoutes;
