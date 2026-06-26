import { Route } from 'react-router-dom';
import { AuthLayout } from '../modules/auth/layout/AuthLayout';
import { Landing } from '../modules/auth/features/landing/pages/page';
import { Login } from '../modules/auth/features/login/pages/page';
import { Register } from '../modules/auth/features/register/pages/page';
import { ProtectedRoute } from './ProtectedRoute';

export const AuthRoutes = (
  <>
    <Route path="/" element={<Landing />} />
    <Route
      path="/login"
      element={(
        <ProtectedRoute guestOnly>
          <AuthLayout>
            <Login />
          </AuthLayout>
        </ProtectedRoute>
      )}
    />
    <Route
      path="/register"
      element={(
        <ProtectedRoute guestOnly>
          <AuthLayout>
            <Register />
          </AuthLayout>
        </ProtectedRoute>
      )}
    />
  </>
);
