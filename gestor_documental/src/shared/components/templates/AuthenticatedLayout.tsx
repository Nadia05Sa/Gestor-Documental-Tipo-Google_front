import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppNavbar } from '@shared/components/layout/AppNavbar';
import { Sidebar } from '@shared/components/layout/Sidebar';
import { ToastHost } from '@shared/components/Toast';
import { setupAppTheme } from '@shared/utils/appTheme';

type AuthenticatedLayoutProps = {
  /** Etiqueta opcional junto a la marca (p. ej. "Admin"). */
  badge?: string;
  /** Muestra la barra de búsqueda global en el navbar. */
  showSearch?: boolean;
};

export function AuthenticatedLayout({ badge, showSearch = true }: AuthenticatedLayoutProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isAdmin = Boolean(badge);

  useEffect(() => {
    setupAppTheme();
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg-app)]">
      <div className="hidden shrink-0 lg:block">
        <Sidebar
          showLogo
          badge={badge}
          showStorageFooter={!isAdmin}
          showNewButton={!isAdmin}
          className="sticky top-0 min-h-screen"
        />
      </div>

      {drawerOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 border-0 bg-black/40 p-0"
            aria-label="Cerrar menú"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full shadow-xl">
            <Sidebar
              showLogo
              badge={badge}
              showStorageFooter={!isAdmin}
              showNewButton={!isAdmin}
              className="min-h-full"
              onNavigate={() => setDrawerOpen(false)}
              onCloseDrawer={() => setDrawerOpen(false)}
            />
          </div>
        </div>
      ) : null}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppNavbar
          onMenuClick={() => setDrawerOpen(true)}
          showSearch={showSearch}
          badge={badge}
        />

        <main className="flex-1 overflow-auto bg-[var(--bg-app)]">
          <Outlet />
        </main>
      </div>

      <ToastHost />
    </div>
  );
}
