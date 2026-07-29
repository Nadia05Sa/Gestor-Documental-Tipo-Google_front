import type { ReactNode } from 'react';
import { Star, Trash2, type LucideIcon } from 'lucide-react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { VaultSidePanel } from '@shared/components/organisms/VaultSidePanel';
import { DetailInfoRow } from '@shared/components/molecules/DetailInfoRow';
import { formatBytes, formatDate, getDriveItemIcon, getDriveItemTypeLabel } from '../utils/driveItemUtils';
import type { DriveItem } from '../types/drive.types';

export type DriveDetailAction = {
  icon: LucideIcon;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost' | 'default';
  onClick: (item: DriveItem) => void;
  closeAfterClick?: boolean;
};

export type DriveDetailInfoRow = {
  label: string;
  value: ReactNode;
};

export type DriveDetailProps = {
  item: DriveItem | null;
  onClose: () => void;
  subtitle?: string;
  preview?: ReactNode;
  actions?: DriveDetailAction[];
  infoRows?: DriveDetailInfoRow[];
  /** Atajos legacy: se usan si `actions` no se define. */
  onToggleStar?: (item: DriveItem) => void;
  onMoveToTrash?: (item: DriveItem) => void;
};

const buildDefaultDriveInfoRows = (item: DriveItem): DriveDetailInfoRow[] => [
  {
    label: 'Tipo',
    value: item.kind === 'folder'
      ? 'Carpeta'
      : (item.extension?.toUpperCase() ?? getDriveItemTypeLabel(item.kind, item.extension)),
  },
  { label: 'Tamaño', value: item.kind === 'folder' ? '—' : formatBytes(item.size) },
  { label: 'Creado', value: formatDate(item.createdAt) },
  { label: 'Modificado', value: formatDate(item.updatedAt) },
  ...(item.isShared ? [{ label: 'Compartido por', value: item.sharedBy ?? 'Ti' }] : []),
];

const buildLegacyDriveActions = (
  item: DriveItem,
  onToggleStar?: (item: DriveItem) => void,
  onMoveToTrash?: (item: DriveItem) => void,
): DriveDetailAction[] => {
  const actions: DriveDetailAction[] = [];

  if (onToggleStar) {
    actions.push({
      icon: Star,
      label: item.isStarred ? 'Quitar destacado' : 'Destacar',
      variant: 'secondary',
      onClick: (driveItem) => onToggleStar(driveItem),
    });
  }

  if (onMoveToTrash) {
    actions.push({
      icon: Trash2,
      label: 'Mover a papelera',
      variant: 'danger',
      onClick: (driveItem) => onMoveToTrash(driveItem),
      closeAfterClick: true,
    });
  }

  return actions;
};

const DefaultDrivePreview = ({ item }: { item: DriveItem }) => {
  const Icon = getDriveItemIcon(item.kind, item.extension);

  if (item.previewDataUrl) {
    return (
      <div
        className="mb-6 flex h-44 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border-subtle)]"
        style={{ background: 'var(--bg-surface)' }}
      >
        <img src={item.previewDataUrl} alt={item.name} className="h-full w-full object-contain" />
      </div>
    );
  }

  return (
    <div
      className="mb-6 flex h-44 items-center justify-center rounded-2xl border border-[var(--border-subtle)]"
      style={{ background: 'var(--bg-surface)' }}
    >
      <Icon className="h-20 w-20 text-[var(--accent)] opacity-80" />
    </div>
  );
};

/** Panel lateral de detalle / vista previa de un ítem drive. */
export const DriveDetail = ({
  item,
  onClose,
  subtitle,
  preview,
  actions,
  infoRows,
  onToggleStar,
  onMoveToTrash,
}: DriveDetailProps) => {
  if (!item) return null;

  const Icon = getDriveItemIcon(item.kind, item.extension);
  const resolvedSubtitle = subtitle ?? getDriveItemTypeLabel(item.kind, item.extension);
  const resolvedActions = actions ?? buildLegacyDriveActions(item, onToggleStar, onMoveToTrash);
  const resolvedInfoRows = infoRows ?? buildDefaultDriveInfoRows(item);
  const resolvedPreview = preview ?? <DefaultDrivePreview item={item} />;

  return (
    <VaultSidePanel
      open={Boolean(item)}
      onClose={onClose}
      title={item.name}
      subtitle={resolvedSubtitle}
      icon={Icon}
      size="md"
      footer={resolvedActions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {resolvedActions.map((action) => (
            <ActionButton
              key={action.label}
              icon={action.icon}
              label={action.label}
              variant={action.variant ?? 'secondary'}
              fullWidth={false}
              onClick={() => {
                action.onClick(item);
                if (action.closeAfterClick) {
                  onClose();
                }
              }}
            />
          ))}
        </div>
      ) : null}
    >
      {resolvedPreview}

      <div className="rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4">
        {resolvedInfoRows.map((row) => (
          <DetailInfoRow key={row.label} label={row.label} value={row.value} />
        ))}
      </div>
    </VaultSidePanel>
  );
};
