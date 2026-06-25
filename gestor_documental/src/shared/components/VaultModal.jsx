import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { VaultButton } from './inputs/ActionButton.jsx';

const SIZE_CLASSES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
};

export function VaultModal({
  open,
  onClose,
  title,
  description,
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

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 border-0 bg-black/40 p-0"
        onClick={onClose}
        aria-label="Cerrar modal"
      />

      <div
        className={`relative w-full rounded-[var(--radius-card)] border shadow-[var(--shadow-card)] ${SIZE_CLASSES[size] || SIZE_CLASSES.md} ${className}`}
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-default)',
        }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="vault-modal-title"
      >
        <div className="flex items-start justify-between gap-4 border-b p-5" style={{ borderColor: 'var(--border-subtle)' }}>
          <div>
            <h2 id="vault-modal-title" className="text-lg font-bold text-[var(--text-primary)]">
              {title}
            </h2>
            {description ? (
              <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
            ) : null}
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

        <div className="p-5">{children}</div>

        {footer ? (
          <div
            className="flex items-center justify-end gap-3 border-t p-5"
            style={{ borderColor: 'var(--border-subtle)' }}
          >
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}

VaultModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.node,
  description: PropTypes.node,
  children: PropTypes.node,
  footer: PropTypes.node,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};
