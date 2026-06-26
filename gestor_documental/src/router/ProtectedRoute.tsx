import type { ReactNode } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { AppLoadingScreen } from '@shared/pages/AppLoadingScreen';
import { getHomePathByRole } from '../modules/auth/features/login/api/loginApi';

type ProtectedRouteOptions = {
  allowedRole?: 'admin' | 'user';
  guestOnly?: boolean;
  children?: ReactNode;
};

export const ProtectedRoute = ({
  allowedRole,
  guestOnly = false,
  children,
}: ProtectedRouteOptions) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <AppLoadingScreen message="Verificando sesion..." />;
  }

  if (guestOnly) {
    return user ? <Navigate to={getHomePathByRole(user.role)} replace /> : children;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const normalizedRole = String(user.role || '').toLowerCase();
  const isAdmin = normalizedRole.includes('admin');

  if (allowedRole === 'admin' && !isAdmin) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  if (allowedRole === 'user' && isAdmin) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return children ?? <Outlet />;
};
