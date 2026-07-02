import { useEffect, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X, type LucideIcon } from 'lucide-react';

type SideDrawerSize = 'sm' | 'md' | 'lg' | 'full';

type SideDrawerProps = {
  isOpen: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  size?: SideDrawerSize;
  showCloseButton?: boolean;
  headerIcon?: LucideIcon;
  headerBadge?: ReactNode;
  headerLayout?: 'default' | 'closeOnly';
  panelClassName?: string;
  bodyClassName?: string;
};

/**
 * SideDrawer
 *
 * Componente de panel lateral deslizable reutilizable.
 */
export const SideDrawer = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  headerIcon: HeaderIcon,
  headerBadge,
  headerLayout = 'default',
  panelClassName = '',
  bodyClassName,
}: SideDrawerProps) => {
  const sizeConfig: Record<SideDrawerSize, string> = {
    sm: 'max-w-xs',  // ~35%
    md: 'max-w-md',  // ~50%
    lg: 'max-w-2xl', // ~65%
    full: 'max-w-full',
  };

  const maxWidthClass = sizeConfig[size] || sizeConfig.md;
  const isFull = size === 'full';
  const closeOnlyHeader = headerLayout === 'closeOnly';
  const defaultBodyClass = isFull
    ? 'relative flex-1 overflow-y-auto min-h-0 px-4 py-4 sm:px-6 lg:px-8'
    : 'relative flex-1 overflow-y-auto min-h-0 px-4 py-4 sm:px-5';
  const resolvedBodyClass = bodyClassName != null && String(bodyClassName).trim() !== ''
    ? bodyClassName
    : defaultBodyClass;
  const panelContainerClass = isFull
    ? 'pointer-events-none fixed inset-0 flex max-w-full'
    : 'pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16';
  const panelBaseClass = isFull
    ? 'pointer-events-auto relative h-full w-full max-w-full transform transition duration-300 ease-in-out data-closed:translate-x-full'
    : `pointer-events-auto relative ${maxWidthClass} w-screen transform transition duration-300 ease-in-out data-closed:translate-x-full`;
  const dialogPanelClassName = `${panelBaseClass} ${panelClassName}`.trim();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="relative z-50" role="dialog" aria-modal="true" aria-labelledby="side-drawer-title">
      <button
        type="button"
        className="fixed inset-0 border-0 p-0 transition-opacity duration-300 ease-in-out"
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }}
        onClick={onClose}
        aria-label="Cerrar panel"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className={panelContainerClass}>
            <div
              className={dialogPanelClassName}
              style={
                panelClassName.trim()
                  ? undefined
                  : { backgroundColor: 'var(--bg-elevated, #ffffff)' }
              }
            >
              <div className="relative flex h-full min-h-0 flex-col overflow-hidden">
                {closeOnlyHeader ? (
                  <div
                    className="flex shrink-0 items-center justify-end border-b px-3 py-2.5 sm:px-4"
                    style={{
                      borderColor: 'var(--border-default, #d1d5db)',
                      backgroundColor: 'var(--bg-surface, #f3f4f6)',
                    }}
                  >
                    <h2 id="side-drawer-title" className="sr-only">Panel lateral</h2>
                    {showCloseButton ? (
                      <button
                        type="button"
                        onClick={onClose}
                        className="h-8 w-10 rounded-xl border transition-colors flex items-center justify-center"
                        style={{
                          borderColor: 'var(--border-default, #d1d5db)',
                          color: 'var(--text-secondary, #6b7280)',
                          backgroundColor: 'var(--bg-elevated, #ffffff)',
                        }}
                        aria-label="Cerrar panel"
                      >
                        <span className="sr-only">Cerrar panel</span>
                        <X size={16} />
                      </button>
                    ) : null}
                  </div>
                ) : null}

                {!closeOnlyHeader && title ? (
                  <div
                    className="border-b px-4 py-3 sm:px-5 shrink-0"
                    style={{
                      borderColor: 'var(--border-default, #d1d5db)',
                    }}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        {HeaderIcon ? (
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: 'var(--primary-100, rgba(37, 99, 235, 0.12))' }}
                          >
                            <HeaderIcon size={16} style={{ color: 'var(--accent, #2563eb)' }} />
                          </div>
                        ) : null}

                        <div className="min-w-0">
                          <h2
                            id="side-drawer-title"
                            className="text-base font-semibold truncate"
                            style={{ color: 'var(--text-primary, #111827)' }}
                          >
                            {title}
                          </h2>
                        </div>

                        {headerBadge ? (
                          <span
                            className="px-2 py-0.5 text-xs font-semibold rounded-full"
                            style={{
                              color: 'var(--text-primary, #111827)',
                              backgroundColor: 'var(--accent-subtle, #dbeafe)',
                            }}
                          >
                            {headerBadge}
                          </span>
                        ) : null}
                      </div>

                      {showCloseButton && (
                        <button
                          type="button"
                          onClick={onClose}
                          className="h-8 w-10 rounded-xl border transition-colors flex items-center justify-center"
                          style={{
                            borderColor: 'var(--border-default, #d1d5db)',
                            color: 'var(--text-secondary, #6b7280)',
                            backgroundColor: 'var(--bg-elevated, #ffffff)',
                          }}
                          aria-label="Cerrar panel"
                        >
                          <span className="sr-only">Cerrar panel</span>
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ) : null}

                <div className={resolvedBodyClass}>
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};
