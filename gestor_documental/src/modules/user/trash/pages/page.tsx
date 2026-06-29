import { useState } from 'react';
import { Trash2, RotateCcw, X } from 'lucide-react';
import { EmptyStatePanel } from '@shared/components/tables/EmptyStatePanel';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { ConfirmModal } from '@shared/components/ConfirmModal';
import { VaultViewPageLayout } from '@shared/components/layout/VaultViewPageLayout';
import { useTrash } from '../hooks/useTrash';
import { TrashList } from '../components/TrashList';
import { TrashDetail } from '../components/TrashDetail';
import type { DriveItem } from '../../drive/types/drive.types';

type ConfirmState =
  | { type: 'delete'; ids: string[]; message: string }
  | { type: 'empty' }
  | null;

export const TrashPage = () => {
  const trash = useTrash();
  const [detailItem, setDetailItem] = useState<DriveItem | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const selectedCount = trash.selectedIds.size;
  const selectedArray = Array.from(trash.selectedIds);

  const handleConfirm = () => {
    if (confirm?.type === 'delete') {
      trash.deletePermanent(confirm.ids);
    } else if (confirm?.type === 'empty') {
      trash.emptyTrash();
    }
    setConfirm(null);
  };

  return (
    <VaultViewPageLayout
      title="Papelera"
      subtitle={`Los archivos se eliminan permanentemente después de ${trash.retentionDays} días`}
      itemCount={trash.items.length}
      showViewToggle={false}
      actionIcon={Trash2}
      actionLabel={trash.items.length > 0 ? 'Vaciar papelera' : undefined}
      onAction={trash.items.length > 0 ? () => setConfirm({ type: 'empty' }) : undefined}
      actionVariant="danger"
    >
      {trash.items.length === 0 ? (
        <EmptyStatePanel
          icon={Trash2}
          title="La papelera está vacía"
          description="Aquí aparecerán los elementos que elimines."
        />
      ) : (
        <TrashList
          items={trash.items}
          retentionDays={trash.retentionDays}
          selectedIds={trash.selectedIds}
          onToggleSelect={trash.toggleSelect}
          onViewDetail={setDetailItem}
          onRestore={(item) => trash.restore([item.id])}
          onDeletePermanent={(item) =>
            setConfirm({
              type: 'delete',
              ids: [item.id],
              message: `¿Eliminar "${item.name}" permanentemente? Esta acción no se puede deshacer.`,
            })
          }
        />
      )}

      {selectedCount > 0 ? (
        <div
          className="fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-elevated)] px-4 py-2.5 shadow-[var(--shadow-soft)]"
        >
          <button
            type="button"
            onClick={trash.clearSelection}
            className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface)]"
            aria-label="Deseleccionar"
          >
            <X className="h-4 w-4" />
          </button>
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {selectedCount} seleccionado{selectedCount > 1 ? 's' : ''}
          </span>
          <ActionButton
            icon={RotateCcw}
            label="Restaurar"
            variant="secondary"
            size="small"
            fullWidth={false}
            onClick={() => trash.restore(selectedArray)}
          />
          <ActionButton
            icon={Trash2}
            label="Eliminar permanentemente"
            variant="danger"
            size="small"
            fullWidth={false}
            onClick={() =>
              setConfirm({
                type: 'delete',
                ids: selectedArray,
                message: `¿Eliminar ${selectedCount} elemento${selectedCount > 1 ? 's' : ''} permanentemente? Esta acción no se puede deshacer.`,
              })
            }
          />
        </div>
      ) : null}

      <TrashDetail
        item={detailItem}
        onClose={() => setDetailItem(null)}
        onRestore={(item) => trash.restore([item.id])}
        onDeletePermanent={(item) =>
          setConfirm({
            type: 'delete',
            ids: [item.id],
            message: `¿Eliminar "${item.name}" permanentemente? Esta acción no se puede deshacer.`,
          })
        }
      />

      <ConfirmModal
        isOpen={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={confirm?.type === 'empty' ? 'Vaciar papelera' : 'Eliminar permanentemente'}
        message={
          confirm?.type === 'empty'
            ? '¿Vaciar toda la papelera? Todos los elementos se eliminarán permanentemente.'
            : confirm?.type === 'delete'
              ? confirm.message
              : ''
        }
        confirmLabel="Eliminar"
      />
    </VaultViewPageLayout>
  );
};
