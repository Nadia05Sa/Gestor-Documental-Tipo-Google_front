import { DriveSearchProvider } from '@context/DriveSearchContext';
import { AuthenticatedLayout } from '@shared/components/templates/AuthenticatedLayout';

export const UserLayout = () => (
  <DriveSearchProvider>
    <AuthenticatedLayout />
  </DriveSearchProvider>
);
