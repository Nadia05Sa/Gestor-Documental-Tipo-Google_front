import { Navigate, Route } from 'react-router-dom';
import { AdminLayout } from '../../modules/admin/layout/AdminLayout.jsx';

const AdminHomePage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Panel de administración</h1>
    <p className="mt-2 text-[var(--text-secondary)]">Bienvenido al área de administración de Infinity Vault.</p>
  </div>
);

export const adminRoutes = (
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminHomePage />} />
    <Route path="usuarios" element={<AdminHomePage />} />
    <Route path="moderacion" element={<AdminHomePage />} />
    <Route path="*" element={<Navigate to="/admin" replace />} />
  </Route>
);
