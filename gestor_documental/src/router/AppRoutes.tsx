import { Route } from 'react-router-dom';
import { UserLayout } from '../modules/user/layout/UserLayout';
import { DrivePage } from '../modules/user/features/drive/pages/page';
import { FavoritesPage } from '../modules/user/features/favorites/pages/page';
import { RecentsPage } from '../modules/user/features/recents/pages/page';
import { TrashPage } from '../modules/user/features/trash/pages/page';
import { SettingsPage } from '../modules/user/features/settings/pages/page';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = (
  <Route element={<ProtectedRoute allowedRole="user" />}>
    <Route element={<UserLayout />}>
      <Route path="/drive" element={<DrivePage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/recents" element={<RecentsPage />} />
      <Route path="/trash" element={<TrashPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
  </Route>
);
