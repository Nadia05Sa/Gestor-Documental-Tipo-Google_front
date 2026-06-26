import { Link, useLocation } from 'react-router-dom';
import { FileText, Folder, Heart, Settings } from 'lucide-react';
import { useAuth } from '../../../core/context/AuthContext';

// Componente de barra lateral para navegación principal, adaptada según el rol del usuario (admin o usuario regular).
/**
 * Sidebar principal de navegacion.
 */
export const Sidebar = ({ collapsed = false, className = '', onNavigate }) => {
  const location = useLocation();
  const { user } = useAuth();

  const menuItemsUser = [
    { icon: Folder, label: 'Mi Drive', path: '/drive' },
    { icon: Heart, label: 'Favoritos', path: '/favorites' },
    { icon: Settings, label: 'Ajustes', path: '/settings' },
  ];

  const menuItemsAdmin = [
    { icon: FileText, label: 'Reportes', path: '/admin/reports' },
  ];

  const menuItems = user?.role === 'admin' ? menuItemsAdmin : menuItemsUser;

  const isItemActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <aside
      className={`h-full border-r border-[var(--border-subtle)] bg-[var(--bg-base)] ${collapsed ? 'w-20' : 'w-72'} ${className}`}
    >
      <nav className="p-3">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = isItemActive(item.path);

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  onClick={() => onNavigate?.()}
                  className={`flex items-center ${collapsed ? 'justify-center' : 'justify-start'} gap-3 px-3 py-2.5 rounded-lg transition-colors border ${
                    isActive
                      ? 'bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--border-strong)]'
                      : 'text-[var(--text-primary)] border-transparent hover:bg-[var(--bg-elevated)] hover:border-[var(--border-subtle)]'
                  }`}
                  title={collapsed ? item.label : undefined}
                  aria-label={item.label}
                >
                  <Icon className="w-5 h-5" />
                  {!collapsed && <span className="truncate text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};
