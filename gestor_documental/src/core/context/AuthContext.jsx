import PropTypes from 'prop-types';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  clearSessionUser,
  findAccount,
  isPrivateRoute,
  readStoredUser,
  saveRegisteredUser,
  saveSessionUser,
} from '../../modules/auth/utils/authStorage';

const AuthContext = createContext(null);

const buildSessionUser = (account) => ({
  id: account.id,
  email: account.email,
  role: account.role,
  name: account.name,
  surname: account.surname,
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const restoreSession = useCallback(async () => {
    const storedUser = readStoredUser();
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

    if (isPrivateRoute(globalThis.location.pathname)) {
      bootstrap();
      return;
    }

    setAuthLoading(false);
    restoreSession();
  }, [restoreSession]);

  const login = useCallback(async (email, password) => {
    const account = findAccount(email);

    if (!account || account.password !== password) {
      const error = new Error('Credenciales invalidas. Verifica tu correo y contraseña.');
      error.code = 'INVALID_CREDENTIALS';
      throw error;
    }

    const userData = buildSessionUser(account);
    saveSessionUser(userData);
    setUser(userData);
    return userData;
  }, []);

  const register = useCallback(async (formData) => {
    const normalizedEmail = String(formData.email || '').trim().toLowerCase();

    if (findAccount(normalizedEmail)) {
      const error = new Error('Este correo ya esta registrado.');
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

AuthProvider.propTypes = {
  children: PropTypes.node,
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};
