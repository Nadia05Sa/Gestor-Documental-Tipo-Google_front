import PropTypes from 'prop-types';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { AppLoadingScreen } from '@shared/pages/AppLoadingScreen';
import { AppNotFoundScreen } from '@shared/pages/AppNotFoundScreen';
import { getHomePathByRole } from '../utils/authRoutes';

export const RequireAuth = () => {
  const { user, authLoading } = useAuth();

  if (authLoading) return <AppLoadingScreen message="Cargando..." />;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};

export const RequireRole = ({ role }) => {
  const { user } = useAuth();
  const normalizedRole = String(user?.role || '').toLowerCase();
  const isAdmin = normalizedRole.includes('admin');

  if (role === 'admin' && !isAdmin) {
    return <Navigate to={getHomePathByRole(user?.role)} replace />;
  }

  if (role === 'user' && isAdmin) {
    return <Navigate to={getHomePathByRole(user?.role)} replace />;
  }

  return <Outlet />;
};

RequireRole.propTypes = {
  role: PropTypes.oneOf(['admin', 'user']).isRequired,
};

export const RequireGuest = ({ children }) => {
  const { user, authLoading } = useAuth();

  if (authLoading) {
    return <AppLoadingScreen message="Verificando sesion..." />;
  }

  if (user) {
    return <Navigate to={getHomePathByRole(user.role)} replace />;
  }

  return children;
};

RequireGuest.propTypes = {
  children: PropTypes.node,
};

export const NotFoundRoute = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const destination = user ? getHomePathByRole(user?.role) : '/';

  return (
    <AppNotFoundScreen
      buttonLabel={user ? 'Ir a mi inicio' : 'Ir al inicio'}
      onButtonClick={() => navigate(destination, { replace: true })}
    />
  );
};
