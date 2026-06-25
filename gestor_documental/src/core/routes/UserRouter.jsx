import { Route } from 'react-router-dom';
import { UserLayout } from '../../modules/user/layout/UserLayout.jsx';

const UserHomePage = () => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-[var(--text-primary)]">Mi almacenamiento</h1>
    <p className="mt-2 text-[var(--text-secondary)]">Bienvenido a Infinity Vault.</p>
  </div>
);

const PlaceholderPage = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-[var(--text-primary)]">{title}</h1>
    <p className="mt-2 text-[var(--text-secondary)]">Módulo en construcción.</p>
  </div>
);

export const userRoutes = (
  <Route path="/usuario" element={<UserLayout />}>
    <Route index element={<UserHomePage />} />
    <Route path="drive" element={<PlaceholderPage title="Mi Drive" />} />
    <Route path="favoritos" element={<PlaceholderPage title="Favoritos" />} />
    <Route path="ajustes" element={<PlaceholderPage title="Ajustes" />} />
  </Route>
);
