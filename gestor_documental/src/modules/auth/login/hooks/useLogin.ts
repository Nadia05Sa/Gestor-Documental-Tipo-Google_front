import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { getHomePathByRole } from '../api/loginApi';

export const useLogin = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const loginUser = async (email: string, password: string, rememberMe = true) => {
    setError('');
    setLoading(true);
    const fallbackMessage = 'No se pudo iniciar sesion. Intenta nuevamente.';

    try {
      const userData = await login(email, password, rememberMe);
      if (!userData) {
        setError(fallbackMessage);
        return { success: false };
      }

      const redirectTo = getHomePathByRole(userData.role);
      navigate(redirectTo);
      return { success: true, data: userData };
    } catch (loginError) {
      const message = loginError instanceof Error ? loginError.message : fallbackMessage;
      setError(message);
      return { success: false };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    loginUser,
  };
};
