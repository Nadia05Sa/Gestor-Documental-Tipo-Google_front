import type { ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';
import { ActionButton } from '../atoms/ActionButton';
import { VaultModal } from './VaultModal';

type ConfirmModalProps = {
  isOpen?: boolean;
  open?: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: ReactNode;
  message?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  isLoading?: boolean;
  loadingLabel?: ReactNode;
  tone?: 'danger' | 'primary';
};

export const ConfirmModal = ({
  isOpen,
  open,
  onClose,
  onConfirm,
  title = 'Confirmar accion',
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isLoading = false,
  loadingLabel = 'Procesando...',
  tone = 'danger',
}: ConfirmModalProps) => {
  const resolvedOpen = Boolean(isOpen ?? open);
  const isDanger = tone === 'danger';

  return (
    <VaultModal
      open={resolvedOpen}
      onClose={onClose}
      title={title}
      description={undefined}
      size="sm"
      footer={(
        <>
          <ActionButton
            label={cancelLabel}
            onClick={onClose}
            variant="secondary"
            fullWidth={false}
            disabled={isLoading}
          />
          <ActionButton
            label={confirmLabel}
            loadingLabel={loadingLabel}
            onClick={onConfirm}
            variant={isDanger ? 'danger' : 'primary'}
            fullWidth={false}
            loading={isLoading}
            disabled={isLoading}
          />
        </>
      )}
    >
      <div className="flex gap-3">
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full"
          style={{
            backgroundColor: isDanger
              ? 'var(--danger-subtle, #fef2f2)'
              : 'var(--accent-subtle, #eff6ff)',
            color: isDanger
              ? 'var(--danger-600, #dc2626)'
              : 'var(--accent, #2563eb)',
          }}
        >
          <AlertTriangle className="h-5 w-5" />
        </span>
        <p className="text-sm leading-6 text-[var(--text-secondary,#6b7280)]">
          {message}
        </p>
      </div>
    </VaultModal>
  );
};
