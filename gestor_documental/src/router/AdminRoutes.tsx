import { Navigate, Route } from 'react-router-dom';
import { AdminLayout } from '../modules/admin/layout/AdminLayout';
import { UsersPage } from '../modules/admin/features/user-management/pages/page';
import { ReportsPage } from '../modules/admin/features/moderation/pages/page';
import { ProtectedRoute } from './ProtectedRoute';

export const AdminRoutes = (
  <Route element={<ProtectedRoute allowedRole="admin" />}>
    <Route path="/admin" element={<AdminLayout />}>
      <Route index element={<Navigate to="/admin/users" replace />} />
      <Route path="users" element={<UsersPage />} />
      <Route path="reports" element={<ReportsPage />} />
      <Route path="*" element={<Navigate to="/admin/users" replace />} />
    </Route>
  </Route>
);
