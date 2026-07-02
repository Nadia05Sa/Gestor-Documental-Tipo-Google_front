import type { AuthAccount, AuthSessionUser, HardcodedUsers } from '../types/login.types';

const SESSION_STORAGE_KEY = 'vault_auth_user';
const SESSION_TAB_KEY = 'vault_auth_user_session';
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

export const readStoredUser = (): AuthSessionUser | null => {
  const persistent = readJson<AuthSessionUser | null>(SESSION_STORAGE_KEY, null);
  if (persistent) return persistent;

  try {
    const raw = sessionStorage.getItem(SESSION_TAB_KEY);
    return raw ? (JSON.parse(raw) as AuthSessionUser) : null;
  } catch {
    return null;
  }
};

export const hasPersistentSession = () => {
  try {
    return Boolean(localStorage.getItem(SESSION_STORAGE_KEY));
  } catch {
    return false;
  }
};

export const saveSessionUser = (userData: AuthSessionUser, rememberMe = true) => {
  const serialized = JSON.stringify(userData);

  if (rememberMe) {
    localStorage.setItem(SESSION_STORAGE_KEY, serialized);
    sessionStorage.removeItem(SESSION_TAB_KEY);
    return;
  }

  sessionStorage.setItem(SESSION_TAB_KEY, serialized);
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
  sessionStorage.removeItem(SESSION_TAB_KEY);
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
  || pathname.startsWith('/shared')
  || pathname.startsWith('/favorites')
  || pathname.startsWith('/recents')
  || pathname.startsWith('/trash')
  || pathname.startsWith('/billing')
  || pathname.startsWith('/settings');

export const isGuestAuthRoute = (pathname: string) =>
  pathname === '/login' || pathname === '/register';

export const shouldBlockForAuthBootstrap = (pathname: string) =>
  isPrivateRoute(pathname) || isGuestAuthRoute(pathname);
