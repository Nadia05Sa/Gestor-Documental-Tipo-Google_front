import { Star, Trash2 } from 'lucide-react';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { VaultSidePanel } from '@shared/components/VaultSidePanel';
import { formatBytes, formatDate, getDriveItemIcon, getDriveItemTypeLabel } from '@shared/components/drive/driveItemUtils';
import { DetailInfoRow } from '@shared/components/layout/DetailInfoRow';
import type { DriveItem } from '../types/drive.types';

type DriveDetailProps = {
  item: DriveItem | null;
  onClose: () => void;
  onToggleStar?: (item: DriveItem) => void;
  onMoveToTrash?: (item: DriveItem) => void;
};

/** Panel lateral derecho de detalle / vista previa (según Figma VAULT). */
export const DriveDetail = ({ item, onClose, onToggleStar, onMoveToTrash }: DriveDetailProps) => {
  if (!item) return null;
  const Icon = getDriveItemIcon(item.kind, item.extension);

  return (
    <VaultSidePanel
      open={Boolean(item)}
      onClose={onClose}
      title={item.name}
      subtitle={getDriveItemTypeLabel(item.kind, item.extension)}
      icon={Icon}
      size="md"
      footer={(
        <div className="flex flex-wrap gap-2">
          {onToggleStar ? (
            <ActionButton
              icon={Star}
              label={item.isStarred ? 'Quitar destacado' : 'Destacar'}
              variant="secondary"
              fullWidth={false}
              onClick={() => onToggleStar(item)}
            />
          ) : null}
          {onMoveToTrash ? (
            <ActionButton
              icon={Trash2}
              label="Mover a papelera"
              variant="danger"
              fullWidth={false}
              onClick={() => {
                onMoveToTrash(item);
                onClose();
              }}
            />
          ) : null}
        </div>
      )}
    >
      <div
        className="mb-6 flex h-44 items-center justify-center rounded-2xl border border-[var(--border-subtle)]"
        style={{ background: 'var(--bg-surface)' }}
      >
        <Icon className="h-20 w-20 text-[var(--accent)] opacity-80" />
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
        <DetailInfoRow label="Creado" value={formatDate(item.createdAt)} />
        <DetailInfoRow label="Modificado" value={formatDate(item.updatedAt)} />
        {item.isShared ? <DetailInfoRow label="Compartido por" value={item.sharedBy ?? 'Ti'} /> : null}
      </div>
    </VaultSidePanel>
  );
};
