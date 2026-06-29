import { RotateCcw, Trash2 } from 'lucide-react';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { VaultSidePanel } from '@shared/components/VaultSidePanel';
import { formatBytes, formatDate, getDriveItemIcon, getDriveItemTypeLabel } from '@shared/components/drive/driveItemUtils';
import { DriveItemIcon } from '@shared/components/drive/DriveItemIcon';
import { DetailInfoRow } from '@shared/components/layout/DetailInfoRow';
import type { DriveItem } from '../../drive/types/drive.types';

type TrashDetailProps = {
  item: DriveItem | null;
  onClose: () => void;
  onRestore: (item: DriveItem) => void;
  onDeletePermanent: (item: DriveItem) => void;
};

export const TrashDetail = ({ item, onClose, onRestore, onDeletePermanent }: TrashDetailProps) => {
  if (!item) return null;
  const Icon = getDriveItemIcon(item.kind, item.extension);

  return (
    <VaultSidePanel
      open={Boolean(item)}
      onClose={onClose}
      title={item.name}
      subtitle="Elemento en la papelera"
      icon={Icon}
      size="md"
      footer={(
        <div className="flex flex-wrap gap-2">
          <ActionButton
            icon={RotateCcw}
            label="Restaurar"
            variant="secondary"
            fullWidth={false}
            onClick={() => {
              onRestore(item);
              onClose();
            }}
          />
          <ActionButton
            icon={Trash2}
            label="Eliminar permanentemente"
            variant="danger"
            fullWidth={false}
            onClick={() => {
              onDeletePermanent(item);
              onClose();
            }}
          />
        </div>
      )}
    >
      <div
        className="mb-6 flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)]"
        style={{ background: 'var(--bg-surface)' }}
      >
        <DriveItemIcon kind={item.kind} extension={item.extension} size="lg" />
        <p className="text-xs text-[var(--text-secondary)]">Vista previa no disponible en papelera</p>
      </div>

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4">
        <DetailInfoRow
          label="Tipo"
          value={
            item.kind === 'folder'
              ? 'Carpeta'
              : (item.extension?.toUpperCase() ?? getDriveItemTypeLabel(item.kind, item.extension))
          }
        />
        <DetailInfoRow label="Tamaño" value={item.kind === 'folder' ? '—' : formatBytes(item.size)} />
        <DetailInfoRow label="Ubicación original" value={item.originalLocation ?? 'Mi Unidad'} />
        <DetailInfoRow label="Eliminado por" value={item.deletedBy ?? 'Tú'} />
        <DetailInfoRow label="Eliminado" value={formatDate(item.deletedAt)} />
      </div>
    </VaultSidePanel>
  );
};
