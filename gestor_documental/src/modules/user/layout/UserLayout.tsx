import { DriveSearchProvider } from '@context/DriveSearchContext';
import { AuthenticatedLayout } from '@shared/components/layout/AuthenticatedLayout';

export const UserLayout = () => (
  <DriveSearchProvider>
    <AuthenticatedLayout />
  </DriveSearchProvider>
);
