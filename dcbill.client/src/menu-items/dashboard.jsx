// assets
import { DashboardOutlined } from '@ant-design/icons';
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';
// icons
const icons = {
    DashboardOutlined,
    ProfileOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    // {
    //   id: 'dashboard',
    //   title: 'Dashboard',
    //   type: 'item',
    //   url: '/',
    //   icon: icons.DashboardOutlined,
    //   breadcrumbs: false
    //   },
      {
          id: 'invocie',
          title: 'Invoices',
          type: 'item',
          url: '/invoices',
          icon: icons.ProfileOutlined,
          breadcrumbs: false,
          external: true,
      }
  ]
};

export default dashboard;
