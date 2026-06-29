import { AuthenticatedLayout } from '@shared/components/layout/AuthenticatedLayout';

export const AdminLayout = () => <AuthenticatedLayout badge="Admin" showSearch={false} />;
