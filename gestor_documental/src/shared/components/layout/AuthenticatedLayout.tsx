import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@context/AuthContext';
import { ActionButton } from '@shared/components/inputs/ActionButton';

export function AuthenticatedLayout({ eyebrow = 'Infinity Vault' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[var(--bg-base,#ffffff)]">
      <header className="flex items-center justify-between border-b border-[var(--border-subtle,#e5e7eb)] px-6 py-4">
        <div>
          <p className="text-sm text-[var(--text-secondary,#6b7280)]">{eyebrow}</p>
          <p className="font-medium text-[var(--text-primary,#111827)]">{user?.email}</p>
        </div>
        <ActionButton
          label="Cerrar sesión"
          onClick={handleLogout}
          variant="outline"
          colorVariant="default"
          fullWidth={false}
          className="!w-auto"
        />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
