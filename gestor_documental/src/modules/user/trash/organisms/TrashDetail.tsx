import { RotateCcw, Trash2 } from 'lucide-react';
import { DriveDetail } from '@shared/domain/drive/organisms/DriveDetail';
import { DriveItemIcon } from '@shared/domain/drive/atoms/DriveItemIcon';
import { formatBytes, formatDate } from '@shared/domain/drive/utils/driveItemUtils';
import type { DriveDetailAction, DriveDetailInfoRow } from '@shared/domain/drive/organisms/DriveDetail';
import type { DriveItem } from '../../drive/types/drive.types';

type TrashDetailProps = {
  item: DriveItem | null;
  onClose: () => void;
  onRestore: (item: DriveItem) => void;
  onDeletePermanent: (item: DriveItem) => void;
};

export const TrashDetail = ({ item, onClose, onRestore, onDeletePermanent }: TrashDetailProps) => {
  if (!item) return null;

  const actions: DriveDetailAction[] = [
    {
      icon: RotateCcw,
      label: 'Restaurar',
      variant: 'secondary',
      onClick: (driveItem) => onRestore(driveItem),
      closeAfterClick: true,
    },
    {
      icon: Trash2,
      label: 'Eliminar permanentemente',
      variant: 'danger',
      onClick: (driveItem) => onDeletePermanent(driveItem),
      closeAfterClick: true,
    },
  ];

  const infoRows: DriveDetailInfoRow[] = [
    {
      label: 'Tipo',
      value: item.kind === 'folder' ? 'Carpeta' : (item.extension?.toUpperCase() ?? 'Archivo'),
    },
    { label: 'Tamaño', value: item.kind === 'folder' ? '—' : formatBytes(item.size) },
    { label: 'Ubicación original', value: item.originalLocation ?? 'Mi Unidad' },
    { label: 'Eliminado por', value: item.deletedBy ?? 'Tú' },
    { label: 'Eliminado', value: formatDate(item.deletedAt) },
  ];

  return (
    <DriveDetail
      item={item}
      onClose={onClose}
      subtitle="Elemento en la papelera"
      actions={actions}
      infoRows={infoRows}
      preview={(
        <div
          className="mb-6 flex h-36 flex-col items-center justify-center gap-2 rounded-2xl border border-[var(--border-subtle)]"
          style={{ background: 'var(--bg-surface)' }}
        >
          <DriveItemIcon kind={item.kind} extension={item.extension} size="lg" />
          <p className="text-xs text-[var(--text-secondary)]">Vista previa no disponible en papelera</p>
        </div>
      )}
    />
  );
};
