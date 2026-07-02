import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, LogOut, Menu, Search, Settings, SlidersHorizontal } from 'lucide-react';
import { useAuth } from '@context/AuthContext';
import { useDriveSearch } from '@context/DriveSearchContext';
import { InfinityVaultLogo } from '@shared/components/atoms/InfinityVaultLogo';

const getInitials = (name?: string, surname?: string, email?: string) => {
  const first = name?.trim()?.[0];
  const second = surname?.trim()?.[0];
  if (first || second) return `${first ?? ''}${second ?? ''}`.toUpperCase();
  return (email?.trim()?.[0] ?? 'U').toUpperCase();
};

type AppNavbarProps = {
  onMenuClick?: () => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchSubmit?: (value: string) => void;
  onAdvancedSearch?: () => void;
  badge?: string;
};

/**
 * Header superior VAULT: búsqueda global, notificaciones y perfil.
 */
export const AppNavbar = ({
  onMenuClick,
  showSearch = true,
  searchPlaceholder = 'Buscar en Mi Unidad...',
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onAdvancedSearch,
  badge,
}: AppNavbarProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const driveSearch = useDriveSearch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [internalSearch, setInternalSearch] = useState('');
  const menuRef = useRef<HTMLDivElement>(null);

  const search = searchValue ?? driveSearch?.searchQuery ?? internalSearch;
  const displayName = [user?.name, user?.surname].filter(Boolean).join(' ') || user?.email || 'Usuario';
  const initials = getInitials(user?.name, user?.surname, user?.email);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [menuOpen]);

  const handleSearchChange = (value: string) => {
    if (onSearchChange) onSearchChange(value);
    else if (driveSearch) driveSearch.setSearchQuery(value);
    else setInternalSearch(value);
  };

  const handleSearchSubmit = () => {
    if (location.pathname !== '/drive') {
      navigate('/drive');
    }
    onSearchSubmit?.(search);
  };

  const handleLogout = async () => {
    setMenuOpen(false);
    await logout();
    navigate('/login', { replace: true });
  };

  const goToSettings = () => {
    setMenuOpen(false);
    navigate('/settings');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-3 border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)]/95 px-4 backdrop-blur-sm sm:gap-4 sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-subtle)] text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 lg:hidden"
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 lg:hidden">
        <InfinityVaultLogo className="justify-start" />
        {badge ? (
          <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-bold uppercase text-[var(--accent)]">
            {badge}
          </span>
        ) : null}
      </div>

      {showSearch ? (
        <form
          className="relative mx-auto hidden w-full max-w-2xl flex-1 lg:flex"
          onSubmit={(event) => {
            event.preventDefault();
            handleSearchSubmit();
          }}
          role="search"
        >
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-secondary)]" />
          <input
            type="search"
            value={search}
            onChange={(event) => handleSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            aria-label="Buscar"
            className="h-11 w-full rounded-full border border-[var(--border-subtle)] bg-[var(--bg-surface)] pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-secondary)] transition-all focus:border-[var(--accent)] focus:bg-[var(--bg-elevated)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/25"
          />
          {onAdvancedSearch ? (
            <button
              type="button"
              onClick={onAdvancedSearch}
              className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-elevated)] hover:text-[var(--accent)]"
              aria-label="Búsqueda avanzada"
              title="Búsqueda avanzada"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>
          ) : null}
        </form>
      ) : (
        <div className="hidden flex-1 lg:block" />
      )}

      <div className="ml-auto flex items-center gap-1 sm:gap-2">
        {showSearch ? (
          <button
            type="button"
            onClick={() => {
              if (location.pathname !== '/drive') navigate('/drive');
            }}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 lg:hidden"
            aria-label="Buscar"
          >
            <Search className="h-5 w-5" />
          </button>
        ) : null}

        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-xl text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
          aria-label="Notificaciones"
          title="Notificaciones"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[var(--danger-600)] ring-2 ring-[var(--bg-elevated)]" />
        </button>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex items-center gap-2 rounded-full p-0.5 pr-2 transition-colors hover:bg-[var(--bg-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Menú de perfil"
          >
            <span
              className="rounded-full p-0.5"
              style={{ background: 'var(--gradient-primary)' }}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-sm font-bold text-[var(--brand-navy)]">
                {initials}
              </span>
            </span>
            <span className="hidden max-w-[10rem] truncate text-sm font-semibold text-[var(--text-primary)] md:inline">
              {displayName}
            </span>
          </button>

          {menuOpen ? (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-60 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-[var(--shadow-soft)]"
            >
              <div className="flex items-center gap-3 border-b border-[var(--border-subtle)] px-4 py-3">
                <span
                  className="rounded-full p-0.5"
                  style={{ background: 'var(--gradient-primary)' }}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--bg-elevated)] text-sm font-bold text-[var(--brand-navy)]">
                    {initials}
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[var(--text-primary)]">{displayName}</p>
                  <p className="truncate text-xs text-[var(--text-secondary)]">{user?.email}</p>
                </div>
              </div>

              <button
                type="button"
                role="menuitem"
                onClick={goToSettings}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
              >
                <Settings className="h-4 w-4 text-[var(--text-secondary)]" />
                Configuración
              </button>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 border-t border-[var(--border-subtle)] px-4 py-2.5 text-left text-sm text-[var(--error)] transition-colors hover:bg-[var(--error-subtle)]"
              >
                <LogOut className="h-4 w-4" />
                Cerrar sesión
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
