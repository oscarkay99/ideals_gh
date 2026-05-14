import type { UserRole } from '@/hooks/useAuth';

export interface SystemUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'active' | 'inactive' | 'suspended';
  lastLogin: string;
  createdAt: string;
  phone: string;
  permissions: string[];
}

export const rolePermissions: Record<UserRole, string[]> = {
  admin: ['Dashboard', 'Analytics', 'Audit Logs', 'POS', 'Inventory', 'Leads', 'Sales', 'Payments', 'Customers', 'Repairs', 'Warranty', 'Marketing', 'Price Intel', 'Trade-In', 'Delivery', 'Wallet', 'Expenses', 'Suppliers', 'Reports', 'Loyalty', 'Calendar', 'Team', 'Settings', 'Authentication', 'AI Studio', 'Users'],
  sales_manager: ['Dashboard', 'Analytics', 'Audit Logs', 'POS', 'Inventory', 'Leads', 'Sales', 'Payments', 'Customers', 'Marketing', 'Reports', 'Loyalty', 'Calendar', 'Team'],
  sales_rep: ['Dashboard', 'Audit Logs', 'POS', 'Inventory', 'Leads', 'Sales', 'Customers', 'Calendar'],
  technician: ['Dashboard', 'Audit Logs', 'Repairs', 'Warranty', 'Inventory', 'Customers', 'Calendar'],
  inventory_manager: ['Dashboard', 'Analytics', 'Audit Logs', 'Inventory', 'Suppliers', 'Delivery', 'Reports'],
};

export const roleLabels: Record<UserRole, string> = {
  admin: 'Admin',
  sales_manager: 'Sales Manager',
  sales_rep: 'Sales Rep',
  technician: 'Technician',
  inventory_manager: 'Inventory Manager',
};

export const roleColors: Record<UserRole, string> = {
  admin: '#0D1F4A',
  sales_manager: '#F5A623',
  sales_rep: '#25D366',
  technician: '#E05A2B',
  inventory_manager: '#07101F',
};

export const systemUsers: SystemUser[] = [];
