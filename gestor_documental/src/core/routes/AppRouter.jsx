import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Login } from '../../modules/auth/features/login/pages/Login';
import { Register } from '../../modules/auth/features/register/pages/Register';
import { Landing } from '../../modules/auth/features/landing/pages/Landing';
import {
  NotFoundRoute,
  RequireAuth,
  RequireGuest,
  RequireRole,
} from '../../modules/auth/routing/AuthGuards';
import { adminRoutes } from './AdminRouter';
import { userRoutes } from './UserRouter';

export const AppRouter = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Landing />} />

      <Route
        path="/login"
        element={(
          <RequireGuest>
            <Login />
          </RequireGuest>
        )}
      />

      <Route
        path="/registro"
        element={(
          <RequireGuest>
            <Register />
          </RequireGuest>
        )}
      />

      <Route element={<RequireAuth />}>
        <Route element={<RequireRole role="admin" />}>{adminRoutes}</Route>
        <Route element={<RequireRole role="user" />}>{userRoutes}</Route>
      </Route>

      <Route path="*" element={<NotFoundRoute />} />
    </Routes>
  </BrowserRouter>
);
