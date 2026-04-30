import { rolePermissions } from '@/mocks/users';
import type { UserRole } from '@/hooks/useAuth';

export type AppModule =
  | 'Dashboard'
  | 'Analytics'
  | 'AI Studio'
  | 'POS'
  | 'Inventory'
  | 'Leads'
  | 'Sales'
  | 'Payments'
  | 'Customers'
  | 'Repairs'
  | 'Warranty'
  | 'SMS'
  | 'Marketing'
  | 'Price Intel'
  | 'Trade-In'
  | 'Delivery'
  | 'Wallet'
  | 'Expenses'
  | 'Suppliers'
  | 'Reports'
  | 'Loyalty'
  | 'Calendar'
  | 'Team'
  | 'Settings'
  | 'Authentication'
  | 'Users';

export function canAccessModule(role: UserRole | null | undefined, module: AppModule) {
  if (!role) return false;
  return rolePermissions[role].includes(module);
}
