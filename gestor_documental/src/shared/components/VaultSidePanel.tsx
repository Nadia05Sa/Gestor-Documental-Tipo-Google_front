import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { VaultButton } from './inputs/ActionButton';
import { renderIcon } from './vault-utils.js';

const SIZE_CLASSES = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

export function VaultSidePanel({
  open,
  onClose,
  title,
  subtitle,
  icon,
  children,
  footer,
  size = 'md',
  className = '',
}) {
  useEffect(() => {
    if (!open) return undefined;

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  const panelContent = (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        className="absolute inset-0 border-0 bg-black/40 p-0"
        onClick={onClose}
        aria-label="Cerrar panel"
      />

      <aside
        className={`relative flex h-full w-full flex-col border-l shadow-[var(--shadow-soft)] ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`}
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-subtle)',
        }}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between gap-4 border-b p-5" style={{ borderColor: 'var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            {icon ? (
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--gradient-primary)] text-[var(--text-on-accent)]">
                {renderIcon(icon, { className: 'h-5 w-5' })}
              </span>
            ) : null}
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)]">{title}</h2>
              {subtitle ? <p className="text-sm text-[var(--text-secondary)]">{subtitle}</p> : null}
            </div>
          </div>
          <VaultButton
            icon={X}
            variant="ghost"
            size="icon"
            fullWidth={false}
            onClick={onClose}
            aria-label="Cerrar"
          />
        </div>

        <div className="flex-1 overflow-y-auto p-5">{children}</div>

        {footer ? (
          <div className="border-t p-5" style={{ borderColor: 'var(--border-subtle)' }}>
            {footer}
          </div>
        ) : null}
      </aside>
    </div>
  );

  return createPortal(panelContent, document.body);
}
