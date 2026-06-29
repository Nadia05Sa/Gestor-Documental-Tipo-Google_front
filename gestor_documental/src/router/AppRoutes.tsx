import { Route } from 'react-router-dom';
import { UserLayout } from '../modules/user/layout/UserLayout';
import { DrivePage } from '../modules/user/drive/pages/page';
import { SharedPage } from '../modules/user/shared/pages/page';
import { FavoritesPage } from '../modules/user/favorites/pages/page';
import { RecentsPage } from '../modules/user/recents/pages/page';
import { TrashPage } from '../modules/user/trash/pages/page';
import { BillingPage } from '../modules/user/billing/pages/page';
import { SettingsPage } from '../modules/user/settings/pages/page';
import { ProtectedRoute } from './ProtectedRoute';

export const AppRoutes = (
  <Route element={<ProtectedRoute allowedRole="user" />}>
    <Route element={<UserLayout />}>
      <Route path="/drive" element={<DrivePage />} />
      <Route path="/shared" element={<SharedPage />} />
      <Route path="/recents" element={<RecentsPage />} />
      <Route path="/favorites" element={<FavoritesPage />} />
      <Route path="/trash" element={<TrashPage />} />
      <Route path="/billing" element={<BillingPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
  </Route>
);
