import type { AppModule } from '@/utils/access';

export interface NavItem {
  label: string;
  icon: string;
  path: string;
  module?: AppModule;
  group?: string;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
  {
    label: 'Core',
    items: [
      { label: 'Dashboard', icon: 'ri-dashboard-3-line', path: '/', module: 'Dashboard' },
      { label: 'Analytics', icon: 'ri-bar-chart-2-line', path: '/analytics', module: 'Analytics' },
      { label: 'AI Studio', icon: 'ri-sparkling-2-line', path: '/ai-studio', module: 'AI Studio' },
    ],
  },
  {
    label: 'Commerce',
    items: [
      { label: 'POS', icon: 'ri-store-3-line', path: '/pos', module: 'POS' },
      { label: 'Inventory', icon: 'ri-archive-line', path: '/inventory', module: 'Inventory' },
      { label: 'Leads', icon: 'ri-user-star-line', path: '/leads', module: 'Leads' },
      { label: 'Sales', icon: 'ri-shopping-bag-3-line', path: '/sales', module: 'Sales' },
      { label: 'Payments', icon: 'ri-bank-card-line', path: '/payments', module: 'Payments' },
      { label: 'Customers', icon: 'ri-group-line', path: '/customers', module: 'Customers' },
      { label: 'Repairs', icon: 'ri-tools-line', path: '/repairs', module: 'Repairs' },
      { label: 'Warranty', icon: 'ri-shield-check-line', path: '/warranty', module: 'Warranty' },
    ],
  },
  {
    label: 'Intelligence',
    items: [
      { label: 'Price Intel', icon: 'ri-line-chart-line', path: '/price-intel', module: 'Price Intel' },
      { label: 'Trade-In', icon: 'ri-exchange-line', path: '/trade-in', module: 'Trade-In' },
      { label: 'Delivery', icon: 'ri-truck-line', path: '/delivery', module: 'Delivery' },
    ],
  },
  {
    label: 'Finance',
    items: [
      { label: 'Wallet', icon: 'ri-wallet-3-line', path: '/wallet', module: 'Wallet' },
      { label: 'Expenses', icon: 'ri-calculator-line', path: '/expenses', module: 'Expenses' },
      { label: 'Suppliers', icon: 'ri-store-2-line', path: '/suppliers', module: 'Suppliers' },
      { label: 'Reports', icon: 'ri-file-chart-line', path: '/reports', module: 'Reports' },
      { label: 'Marketing', icon: 'ri-megaphone-line', path: '/marketing', module: 'Marketing' },
    ],
  },
  {
    label: 'Growth',
    items: [
      { label: 'Loyalty', icon: 'ri-vip-crown-line', path: '/loyalty', module: 'Loyalty' },
      { label: 'Calendar', icon: 'ri-calendar-event-line', path: '/calendar', module: 'Calendar' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Authentication', icon: 'ri-shield-check-line', path: '/authentication', module: 'Authentication' },
      { label: 'Team', icon: 'ri-team-line', path: '/team', module: 'Team' },
      { label: 'Users', icon: 'ri-user-settings-line', path: '/users', module: 'Users' },
      { label: 'Settings', icon: 'ri-settings-4-line', path: '/settings', module: 'Settings' },
    ],
  },
];

export const publicItems: NavItem[] = [
  { label: 'Storefront', icon: 'ri-store-2-line', path: '/store', group: 'Public' },
];

