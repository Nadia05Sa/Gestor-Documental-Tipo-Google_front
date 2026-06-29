import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, SlidersHorizontal, User } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { VaultCard } from '@shared/components/VaultCard';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { VaultViewPageLayout } from '@shared/components/layout/VaultViewPageLayout';
import { LoadingStatePanel } from '@shared/components/layout/LoadingStatePanel';
import { useSettings } from '../hooks/useSettings';
import { SettingsForm } from '../components/SettingsForm';

type SettingsTab = 'profile' | 'preferences';

const TABS: Array<{ id: SettingsTab; label: string; icon: typeof User }> = [
  { id: 'profile', label: 'Perfil', icon: User },
  { id: 'preferences', label: 'Preferencias', icon: SlidersHorizontal },
];

export const SettingsPage = () => {
  const { settings, loading, saveProfile, savePreferences } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<SettingsTab>('profile');
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <VaultViewPageLayout
      title="Configuración"
      subtitle="Administra tu cuenta y preferencias"
      showViewToggle={false}
    >
      <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)]">
        <VaultCard padding="p-3" className="h-fit">
          <nav className="space-y-1">
            {TABS.map((item) => {
              const active = tab === item.id;
              const TabIcon = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold transition-all ${
                    active
                      ? 'text-[var(--text-on-accent)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                  }`}
                  style={active ? { background: 'var(--gradient-primary)' } : undefined}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-4 border-t border-[var(--border-subtle)] pt-3">
            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-[var(--error)] transition-colors hover:bg-[var(--error-subtle)]"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              Cerrar sesión
            </button>
          </div>
        </VaultCard>

        {loading ? (
          <LoadingStatePanel message="Cargando configuración..." />
        ) : settings ? (
          <SettingsForm
            tab={tab}
            settings={settings}
            onSaveProfile={saveProfile}
            onSavePreferences={savePreferences}
          />
        ) : null}
      </div>

      <ConfirmModal
        isOpen={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Cerrar sesión"
        message="¿Seguro que quieres cerrar sesión?"
        confirmLabel="Sí, cerrar sesión"
        isLoading={loggingOut}
      />
    </VaultViewPageLayout>
  );
};
