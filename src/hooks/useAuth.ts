import { useEffect, useSyncExternalStore } from 'react';
import { isSupabaseConfigured, supabase } from '@/services/supabase';

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
const RESET_REDIRECT_PATH = '/signin';
const DEFAULT_ROLE: UserRole = 'admin';

const mockUsers: (AuthUser & { password: string })[] = [
  { id: 'U001', name: 'Kwame Asante', email: 'admin@idealstechhub.com', password: 'admin123', role: 'admin', avatar: 'KA', lastLogin: 'Apr 23, 2026' },
  { id: 'U002', name: 'Kofi Mensah', email: 'kofi@idealstechhub.com', password: 'kofi123', role: 'sales_manager', avatar: 'KM', lastLogin: 'Apr 23, 2026' },
  { id: 'U003', name: 'Abena Frimpong', email: 'abena@idealstechhub.com', password: 'abena123', role: 'sales_rep', avatar: 'AF', lastLogin: 'Apr 22, 2026' },
  { id: 'U004', name: 'Ama Owusu', email: 'ama@idealstechhub.com', password: 'ama123', role: 'technician', avatar: 'AO', lastLogin: 'Apr 22, 2026' },
  { id: 'U005', name: 'Yaw Darko', email: 'yaw@idealstechhub.com', password: 'yaw123', role: 'inventory_manager', avatar: 'YD', lastLogin: 'Apr 21, 2026' },
];

interface AuthState {
  user: AuthUser | null;
  initializing: boolean;
}

type AuthResult = { success: boolean; error?: string };

const listeners = new Set<() => void>();
let authInitialized = false;
let authState: AuthState = {
  user: readStoredUser(),
  initializing: isSupabaseConfigured,
};

function readStoredUser(): AuthUser | null {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

function writeStoredUser(user: AuthUser | null) {
  try {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures and keep the in-memory session alive.
  }
}

function emitAuthChange() {
  listeners.forEach((listener) => listener());
}

function setAuthState(nextState: Partial<AuthState>) {
  authState = { ...authState, ...nextState };
  emitAuthChange();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return authState;
}

function formatLastLogin(date = new Date()) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function initialsFromIdentity(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.trim() || 'User';
  const tokens = source
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2);

  return tokens.map((token) => token[0]?.toUpperCase() ?? '').join('') || 'U';
}

function normalizeRole(role?: string | null): UserRole {
  switch (role) {
    case 'admin':
    case 'sales_manager':
    case 'sales_rep':
    case 'technician':
    case 'inventory_manager':
      return role;
    default:
      return DEFAULT_ROLE;
  }
}

async function resolveSupabaseUser(sessionUser: {
  id: string;
  email?: string | null;
  user_metadata?: Record<string, unknown>;
}): Promise<AuthUser> {
  const metadata = sessionUser.user_metadata ?? {};
  const fallbackName =
    typeof metadata.full_name === 'string' ? metadata.full_name :
    typeof metadata.name === 'string' ? metadata.name :
    sessionUser.email?.split('@')[0] ?? 'User';
  const fallbackRole = normalizeRole(typeof metadata.role === 'string' ? metadata.role : undefined);
  const fallbackUser: AuthUser = {
    id: sessionUser.id,
    name: fallbackName,
    email: sessionUser.email ?? '',
    role: fallbackRole,
    avatar: initialsFromIdentity(fallbackName, sessionUser.email),
    lastLogin: formatLastLogin(),
  };

  const { data } = await supabase
    .from('profiles')
    .select('id, email, name, role, avatar, last_login')
    .eq('id', sessionUser.id)
    .maybeSingle();

  if (data) {
    return {
      id: data.id,
      name: data.name || fallbackUser.name,
      email: data.email || fallbackUser.email,
      role: normalizeRole(data.role),
      avatar: data.avatar || initialsFromIdentity(data.name, data.email),
      lastLogin: data.last_login || fallbackUser.lastLogin,
    };
  }

  const profile = {
    id: sessionUser.id,
    email: fallbackUser.email,
    name: fallbackUser.name,
    role: fallbackUser.role,
    avatar: fallbackUser.avatar,
    last_login: fallbackUser.lastLogin,
  };

  await supabase.from('profiles').upsert(profile, { onConflict: 'id' });
  return fallbackUser;
}

async function syncSupabaseSession() {
  if (!isSupabaseConfigured) {
    setAuthState({ initializing: false });
    return;
  }

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session?.user) {
    writeStoredUser(null);
    setAuthState({ user: null, initializing: false });
    return;
  }

  const resolvedUser = await resolveSupabaseUser(data.session.user);
  writeStoredUser(resolvedUser);
  setAuthState({ user: resolvedUser, initializing: false });
}

function ensureSupabaseAuth() {
  if (!isSupabaseConfigured || authInitialized) return;

  authInitialized = true;

  supabase.auth.onAuthStateChange((_event, session) => {
    if (!session?.user) {
      writeStoredUser(null);
      setAuthState({ user: null, initializing: false });
      return;
    }

    void resolveSupabaseUser(session.user).then((resolvedUser) => {
      writeStoredUser(resolvedUser);
      setAuthState({ user: resolvedUser, initializing: false });
    });
  });
}

export function useAuth() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      if (state.initializing) setAuthState({ initializing: false });
      return;
    }

    ensureSupabaseAuth();
    void syncSupabaseSession();
  }, [state.initializing]);

  const login = async (email: string, password: string): Promise<AuthResult> => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      await syncSupabaseSession();
      return { success: true };
    }

    const found = mockUsers.find((user) => user.email === email && user.password === password);
    if (!found) return { success: false, error: 'Invalid email or password' };

    const { password: _pw, ...authUser } = found;
    writeStoredUser(authUser);
    setAuthState({ user: authUser, initializing: false });
    return { success: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }

    writeStoredUser(null);
    setAuthState({ user: null, initializing: false });
  };

  const resetPassword = async (email: string): Promise<AuthResult> => {
    if (isSupabaseConfigured) {
      const redirectTo =
        typeof window !== 'undefined'
          ? `${window.location.origin}${RESET_REDIRECT_PATH}`
          : undefined;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo });
      if (error) return { success: false, error: error.message };
      return { success: true };
    }

    const exists = mockUsers.some((user) => user.email === email);
    if (!exists) return { success: false, error: 'No account found for that email address' };
    return { success: true };
  };

  const isAdmin = state.user?.role === 'admin';

  return {
    user: state.user,
    login,
    logout,
    resetPassword,
    isAdmin,
    isAuthenticated: !!state.user,
    isLoading: state.initializing,
    isSupabaseAuth: isSupabaseConfigured,
  };
}

export { mockUsers };
