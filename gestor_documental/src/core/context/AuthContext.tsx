import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSessionUser,
  findAccount,
  readStoredUser,
  saveSessionUser,
  shouldBlockForAuthBootstrap,
} from '../../modules/auth/login/api/loginApi';
import { saveRegisteredUser } from '../../modules/auth/register/api/registerApi';

type AuthRole = 'admin' | 'user' | string;

export type AuthUser = {
  id: number | string;
  email: string;
  role: AuthRole;
  name?: string;
  surname?: string;
  selected_university?: {
    name?: string;
    short_name?: string;
  };
};

type AuthAccount = AuthUser & {
  password: string;
};

type RegisterFormData = {
  email?: string;
  password: string;
  name?: string;
  surname?: string;
};

type AuthError = Error & {
  code?: string;
  fieldErrors?: Record<string, string>;
};

type AuthContextValue = {
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<AuthUser>;
  logout: () => Promise<void>;
  register: (formData: RegisterFormData) => Promise<AuthUser>;
  authLoading: boolean;
  restoreSession: () => Promise<AuthUser | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

const buildSessionUser = (account: AuthAccount): AuthUser => ({
  id: account.id,
  email: account.email,
  role: account.role,
  name: account.name,
  surname: account.surname,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [authLoading, setAuthLoading] = useState(() =>
    shouldBlockForAuthBootstrap(globalThis.location.pathname),
  );

  const restoreSession = useCallback(async () => {
    const storedUser = readStoredUser() as AuthUser | null;
    if (storedUser) {
      setUser(storedUser);
      return storedUser;
    }
    setUser(null);
    return null;
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await restoreSession();
      } finally {
        setAuthLoading(false);
      }
    };

    if (shouldBlockForAuthBootstrap(globalThis.location.pathname)) {
      bootstrap();
      return;
    }

    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (email: string, password: string) => {
    const account = findAccount(email) as AuthAccount | null;

    if (!account || account.password !== password) {
      const error = new Error('Credenciales invalidas. Verifica tu correo y contraseña.') as AuthError;
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const userData = buildSessionUser(account);
    saveSessionUser(userData);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData: RegisterFormData) => {
    const normalizedEmail = String(formData.email || '').trim().toLowerCase();

    if (findAccount(normalizedEmail)) {
      const error = new Error('Este correo ya esta registrado.') as AuthError;
      error.fieldErrors = { email: 'Este correo ya esta registrado.' };
      throw error;
    }

    const newAccount = {
      id: Date.now(),
      email: normalizedEmail,
      password: formData.password,
      role: 'user',
      name: formData.name?.trim(),
      surname: formData.surname?.trim(),
    };

    saveRegisteredUser(normalizedEmail, newAccount);
    return buildSessionUser(newAccount);
  }, []);

  const logout = useCallback(async () => {
    clearSessionUser();
    setUser(null);
  }, []);

  const contextValue = useMemo(
    () => ({ user, login, logout, register, authLoading, restoreSession }),
    [user, login, logout, register, authLoading, restoreSession],
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
