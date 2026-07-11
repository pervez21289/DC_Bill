// assets
import { DashboardOutlined } from '@ant-design/icons';
import { LoginOutlined, ProfileOutlined, AppstoreAddOutlined, OrderedListOutlined, FileTextOutlined } from '@ant-design/icons';
// icons
const icons = {
    DashboardOutlined,
    ProfileOutlined,
    AppstoreAddOutlined,
    OrderedListOutlined,
    FileTextOutlined
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
          id: 'invoice',
          title: 'Add Invoice',
          type: 'item',
          url: '/invoice/create',
          icon: icons.AppstoreAddOutlined,
          breadcrumbs: false,
          external: true,
      },
      {
          id: 'invoices',
          title: 'Invoices',
          type: 'item',
          url: '/invoices',
          icon: icons.OrderedListOutlined,
          breadcrumbs: false,
          external: true,
      },
      {
          id: 'gst-report',
          title: 'GST Report',
          type: 'item',
          url: '/gst-report',
          icon: icons.FileTextOutlined,
          breadcrumbs: false,
          external: true,
      }
  ]
};

export default dashboard;
