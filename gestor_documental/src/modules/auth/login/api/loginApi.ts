import type { AuthAccount, AuthSessionUser, HardcodedUsers } from '../types/login.types';

const SESSION_STORAGE_KEY = 'vault_auth_user';
const REGISTERED_USERS_KEY = 'vault_registered_users';

export const HARDCODED_USERS: HardcodedUsers = {
  'usuario@gmail.com': {
    id: 1,
    email: 'usuario@gmail.com',
    password: 'User123',
    role: 'user',
  },
  'admin@gmail.com': {
    id: 2,
    email: 'admin@gmail.com',
    password: 'Admin123',
    role: 'admin',
  },
};

const readJson = <T>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const readStoredUser = () => readJson<AuthSessionUser | null>(SESSION_STORAGE_KEY, null);

export const saveSessionUser = (userData: AuthSessionUser) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
};

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const readRegisteredUsers = () => readJson<Record<string, AuthAccount>>(REGISTERED_USERS_KEY, {});

export const findAccount = (email: string) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (HARDCODED_USERS[normalizedEmail]) {
    return HARDCODED_USERS[normalizedEmail];
  }
  return readRegisteredUsers()[normalizedEmail] || null;
};

export const getHomePathByRole = (role: string) => {
  const normalizedRole = String(role || '').toLowerCase();
  return normalizedRole.includes('admin') ? '/admin/users' : '/drive';
};

export const isPrivateRoute = (pathname: string) =>
  pathname.startsWith('/admin')
  || pathname.startsWith('/drive')
  || pathname.startsWith('/favorites')
  || pathname.startsWith('/recents')
  || pathname.startsWith('/trash')
  || pathname.startsWith('/settings');

export const isGuestAuthRoute = (pathname: string) =>
  pathname === '/login' || pathname === '/register';

export const shouldBlockForAuthBootstrap = (pathname: string) =>
  isPrivateRoute(pathname) || isGuestAuthRoute(pathname);
