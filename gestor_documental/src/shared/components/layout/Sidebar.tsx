import { Link, useLocation } from 'react-router-dom';
import {
  Clock,
  CreditCard,
  HardDrive,
  Settings,
  Share2,
  Star,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import type { ComponentType } from 'react';
import { useAuth } from '@context/AuthContext';
import { InfinityVaultLogo } from '@shared/components/auth/InfinityVaultLogo';
import { SidebarNewButton } from '@shared/components/layout/SidebarNewButton';
import { SidebarStorageFooter } from '@shared/components/layout/SidebarStorageFooter';

export type SidebarItem = {
  type?: 'item';
  icon: ComponentType<{ className?: string }>;
  label: string;
  path: string;
};

export type SidebarEntry =
  | { type: 'divider' }
  | SidebarItem;

export const USER_MENU: SidebarEntry[] = [
  { type: 'item', icon: HardDrive, label: 'Mi Unidad', path: '/drive' },
  { type: 'item', icon: Share2, label: 'Compartidos', path: '/shared' },
  { type: 'item', icon: Clock, label: 'Recientes', path: '/recents' },
  { type: 'item', icon: Star, label: 'Destacados', path: '/favorites' },
  { type: 'divider' },
  { type: 'item', icon: Trash2, label: 'Papelera', path: '/trash' },
  { type: 'item', icon: CreditCard, label: 'Plan y facturación', path: '/billing' },
  { type: 'item', icon: Settings, label: 'Configuración', path: '/settings' },
];

export const ADMIN_MENU: SidebarEntry[] = [
  { type: 'item', icon: Users, label: 'Usuarios', path: '/admin/users' },
];

type SidebarProps = {
  items?: SidebarEntry[];
  collapsed?: boolean;
  className?: string;
  onNavigate?: () => void;
  showLogo?: boolean;
  badge?: string;
  showStorageFooter?: boolean;
  showNewButton?: boolean;
  onCloseDrawer?: () => void;
};

const isItemEntry = (entry: SidebarEntry): entry is SidebarItem =>
  !('type' in entry) || entry.type === 'item';

/** Barra lateral VAULT según Figma: logo, + Nuevo, navegación y almacenamiento. */
export const Sidebar = ({
  items,
  collapsed = false,
  className = '',
  onNavigate,
  showLogo = false,
  badge,
  showStorageFooter = false,
  showNewButton = false,
  onCloseDrawer,
}: SidebarProps) => {
  const location = useLocation();
  const { user } = useAuth();

  const isAdmin = String(user?.role || '').toLowerCase().includes('admin');
  const menu = items ?? (isAdmin ? ADMIN_MENU : USER_MENU);

  const isItemActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(`${path}/`);

  return (
    <aside
      className={`flex h-full flex-col border-r border-[var(--border-subtle)] bg-[var(--bg-elevated)] ${collapsed ? 'w-20' : 'w-[260px]'} ${className}`}
    >
      {showLogo ? (
        <div className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[var(--border-subtle)] px-5">
          <div className="flex min-w-0 items-center gap-2">
            <InfinityVaultLogo className="justify-start" />
            {badge ? (
              <span className="rounded-full bg-[var(--accent-subtle)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[var(--accent)]">
                {badge}
              </span>
            ) : null}
          </div>
          {onCloseDrawer ? (
            <button
              type="button"
              onClick={onCloseDrawer}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" />
            </button>
          ) : null}
        </div>
      ) : null}

      {showNewButton ? <SidebarNewButton collapsed={collapsed} /> : null}

      <nav className="flex-1 overflow-y-auto px-3 py-2">
        <ul className="space-y-1">
          {menu.map((entry, index) => {
            if (entry.type === 'divider') {
              return (
                <li key={`divider-${index}`} className="py-2">
                  <hr className="border-[var(--border-subtle)]" />
                </li>
              );
            }

            if (!isItemEntry(entry)) return null;

            const Icon = entry.icon;
            const active = isItemActive(entry.path);

            return (
              <li key={entry.path}>
                <Link
                  to={entry.path}
                  onClick={() => onNavigate?.()}
                  aria-current={active ? 'page' : undefined}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/40 ${
                    active
                      ? 'text-[var(--text-on-accent)] shadow-sm'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface)] hover:text-[var(--text-primary)]'
                  }`}
                  style={active ? { background: 'var(--gradient-primary)' } : undefined}
                  title={collapsed ? entry.label : undefined}
                  aria-label={entry.label}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span className="truncate">{entry.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {showStorageFooter && !collapsed ? <SidebarStorageFooter /> : null}
    </aside>
  );
};
