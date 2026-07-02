import { Eye, RotateCcw, Trash2 } from 'lucide-react';
import { VaultBadge } from '@shared/components/atoms/VaultBadge';
import { DriveItemsTable, type DriveTableColumn } from '@shared/domain/drive/organisms/DriveItemsTable';
import { NameCell } from '@shared/domain/drive/organisms/DriveItemsTable';
import type { DriveRowAction } from '@shared/domain/drive/organisms/DriveRowActionsMenu';
import {
  formatDate,
  getDaysUntilPermanentDelete,
} from '@shared/domain/drive/utils/driveItemUtils';
import { resolveDaysLeftTone } from '@shared/components/vault-utils';
import type { DriveItem } from '../../drive/types/drive.types';

const DAYS_TONE_CLASS: Record<string, string> = {
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-red-100 text-red-700',
  neutral: 'bg-[var(--bg-surface)] text-[var(--text-secondary)]',
};

type TrashListProps = {
  items: DriveItem[];
  retentionDays: number;
  selectedIds: Set<string>;
  onToggleSelect: (id: string) => void;
  onViewDetail: (item: DriveItem) => void;
  onRestore: (item: DriveItem) => void;
  onDeletePermanent: (item: DriveItem) => void;
};

const buildTrashColumns = (retentionDays: number): DriveTableColumn[] => [
  {
    key: 'name',
    header: 'Nombre',
    render: (item) => <NameCell item={item} />,
  },
  {
    key: 'location',
    header: 'Ubicación original',
    className: 'hidden md:table-cell',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">{item.originalLocation ?? 'Mi Unidad'}</span>
    ),
  },
  {
    key: 'deletedBy',
    header: 'Eliminado por',
    className: 'hidden lg:table-cell',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">{item.deletedBy ?? 'Tú'}</span>
    ),
  },
  {
    key: 'date',
    header: 'Fecha',
    className: 'hidden sm:table-cell',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">{formatDate(item.deletedAt)}</span>
    ),
  },
  {
    key: 'daysLeft',
    header: 'Días rest.',
    className: 'hidden xl:table-cell',
    render: (item) => {
      const days = getDaysUntilPermanentDelete(item.deletedAt, retentionDays);
      const tone = resolveDaysLeftTone(days);
      return (
        <VaultBadge tone="neutral" className={DAYS_TONE_CLASS[tone] ?? DAYS_TONE_CLASS.neutral}>
          {days}d
        </VaultBadge>
      );
    },
  },
];

export const TrashList = ({
  items,
  retentionDays,
  selectedIds,
  onToggleSelect,
  onViewDetail,
  onRestore,
  onDeletePermanent,
}: TrashListProps) => {
  const columns = buildTrashColumns(retentionDays);

  const getRowActions = (item: DriveItem): DriveRowAction[] => [
    { key: 'restore', label: 'Restaurar', icon: RotateCcw, onClick: () => onRestore(item) },
    { key: 'preview', label: 'Vista previa', icon: Eye, onClick: () => onViewDetail(item) },
    {
      key: 'delete',
      label: 'Eliminar permanentemente',
      icon: Trash2,
      tone: 'danger',
      onClick: () => onDeletePermanent(item),
    },
  ];

  return (
    <DriveItemsTable
      items={items}
      columns={columns}
      selectable
      selectedIds={selectedIds}
      onToggleSelect={onToggleSelect}
      onOpenItem={onViewDetail}
      getRowActions={getRowActions}
    />
  );
};
