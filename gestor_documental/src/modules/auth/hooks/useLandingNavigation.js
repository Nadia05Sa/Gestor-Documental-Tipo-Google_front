import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { getHomePathByRole } from '../utils/authRoutes';

export const useLandingNavigation = () => {
  const navigate = useNavigate();
  const { user, restoreSession } = useAuth();
  const [pendingAction, setPendingAction] = useState(null);

  const isBusy = Boolean(pendingAction);
  const isLoginLoading = pendingAction === 'login';
  const isRegisterLoading = pendingAction === 'register';

  const goToRegister = () => {
    if (isBusy) return;
    setPendingAction('register');
    navigate('/registro');
  };

  const goToLogin = async () => {
    if (isBusy) return;

    setPendingAction('login');

    if (user) {
      navigate(getHomePathByRole(user.role));
      return;
    }

    try {
      const restoredUser = await restoreSession();
      if (restoredUser) {
        navigate(getHomePathByRole(restoredUser.role));
        return;
      }
    } catch {
      // Si falla la restauracion, se continua al login.
    }

    navigate('/login');
  };

  return {
    goToLogin,
    goToRegister,
    isBusy,
    isLoginLoading,
    isRegisterLoading,
  };
};
