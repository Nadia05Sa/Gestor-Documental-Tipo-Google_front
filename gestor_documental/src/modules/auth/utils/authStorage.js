import { HARDCODED_USERS } from '../constants/credentials';

const SESSION_STORAGE_KEY = 'vault_auth_user';
const REGISTERED_USERS_KEY = 'vault_registered_users';

const readJson = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const readStoredUser = () => readJson(SESSION_STORAGE_KEY, null);

export const saveSessionUser = (userData) => {
  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(userData));
};

export const clearSessionUser = () => {
  localStorage.removeItem(SESSION_STORAGE_KEY);
};

export const readRegisteredUsers = () => readJson(REGISTERED_USERS_KEY, {});

export const saveRegisteredUser = (email, account) => {
  const registeredUsers = readRegisteredUsers();
  registeredUsers[email] = account;
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(registeredUsers));
};

export const findAccount = (email) => {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  if (HARDCODED_USERS[normalizedEmail]) {
    return HARDCODED_USERS[normalizedEmail];
  }
  return readRegisteredUsers()[normalizedEmail] || null;
};

export const isPrivateRoute = (pathname) =>
  pathname.startsWith('/admin') || pathname.startsWith('/usuario');
