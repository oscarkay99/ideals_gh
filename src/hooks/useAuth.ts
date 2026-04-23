import { useState, useEffect } from 'react';

export type UserRole = 'admin' | 'sales_manager' | 'sales_rep' | 'technician' | 'inventory_manager';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  lastLogin: string;
}

const STORAGE_KEY = 'ideals_auth_user';

const mockUsers: (AuthUser & { password: string })[] = [
  { id: 'U001', name: 'Kwame Asante', email: 'admin@idealstechhub.com', password: 'admin123', role: 'admin', avatar: 'KA', lastLogin: 'Apr 23, 2026' },
  { id: 'U002', name: 'Kofi Mensah', email: 'kofi@idealstechhub.com', password: 'kofi123', role: 'sales_manager', avatar: 'KM', lastLogin: 'Apr 23, 2026' },
  { id: 'U003', name: 'Abena Frimpong', email: 'abena@idealstechhub.com', password: 'abena123', role: 'sales_rep', avatar: 'AF', lastLogin: 'Apr 22, 2026' },
  { id: 'U004', name: 'Ama Owusu', email: 'ama@idealstechhub.com', password: 'ama123', role: 'technician', avatar: 'AO', lastLogin: 'Apr 22, 2026' },
  { id: 'U005', name: 'Yaw Darko', email: 'yaw@idealstechhub.com', password: 'yaw123', role: 'inventory_manager', avatar: 'YD', lastLogin: 'Apr 21, 2026' },
];

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (email: string, password: string): { success: boolean; error?: string } => {
    const found = mockUsers.find(u => u.email === email && u.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };
    const { password: _pw, ...authUser } = found;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(authUser));
    setUser(authUser);
    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return { user, login, logout, isAdmin, isAuthenticated: !!user };
}

export { mockUsers };