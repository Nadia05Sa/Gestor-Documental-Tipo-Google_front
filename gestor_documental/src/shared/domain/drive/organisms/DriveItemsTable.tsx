import type { ReactNode } from 'react';
import { Share2 } from 'lucide-react';
import { Checkbox } from '@shared/components/atoms/Checkbox';
import { VaultCard } from '@shared/components/atoms/VaultCard';
import { DriveRowActionsMenu, type DriveRowAction } from './DriveRowActionsMenu';
import { formatBytes, formatDate } from '../utils/driveItemUtils';
import { DriveItemIcon } from '../atoms/DriveItemIcon';
import type { DriveItem } from '../types/drive.types';

export type DriveTableColumn<T = DriveItem> = {
  key: string;
  header: string;
  className?: string;
  render: (item: T) => ReactNode;
};

type DriveItemsTableProps = {
  items: DriveItem[];
  /** Preset de columnas. Ignorado si se pasa `columns`. */
  variant?: 'default' | 'shared';
  columns?: DriveTableColumn[];
  selectable?: boolean;
  selectedIds?: Set<string>;
  onToggleSelect?: (id: string) => void;
  onOpenItem?: (item: DriveItem) => void;
  getRowActions?: (item: DriveItem) => DriveRowAction[];
  showShareIcon?: boolean;
};

const NameCell = ({ item, showShareIcon }: { item: DriveItem; showShareIcon?: boolean }) => (
  <div className="flex min-w-0 items-center gap-3">
    <DriveItemIcon kind={item.kind} extension={item.extension} size="md" variant="plain" />
    <div className="min-w-0">
      <div className="flex items-center gap-1.5">
        <span className="truncate font-semibold text-[var(--text-primary)]" title={item.name}>
          {item.name}
        </span>
        {showShareIcon && item.isShared ? (
          <Share2 className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]" aria-hidden />
        ) : null}
      </div>
      {item.kind === 'file' ? (
        <p className="text-xs text-[var(--text-secondary)]">{formatBytes(item.size)}</p>
      ) : null}
    </div>
  </div>
);

/** Columnas estándar: Mi Unidad, Destacados, Recientes. */
export const defaultTableColumns = (showShareIcon = false): DriveTableColumn[] => [
  {
    key: 'name',
    header: 'Nombre',
    render: (item) => <NameCell item={item} showShareIcon={showShareIcon} />,
  },
  {
    key: 'modified',
    header: 'Modificado',
    className: 'hidden sm:table-cell w-[10rem]',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">{formatDate(item.updatedAt)}</span>
    ),
  },
  {
    key: 'size',
    header: 'Tamaño',
    className: 'hidden md:table-cell w-[7rem]',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">
        {item.kind === 'folder' ? '—' : formatBytes(item.size)}
      </span>
    ),
  },
];

/** Columnas para Compartidos conmigo. */
export const sharedTableColumns: DriveTableColumn[] = [
  {
    key: 'name',
    header: 'Nombre',
    render: (item) => <NameCell item={item} showShareIcon />,
  },
  {
    key: 'owner',
    header: 'Propietario',
    className: 'hidden sm:table-cell w-[11rem]',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">{item.sharedBy ?? 'Tú'}</span>
    ),
  },
  {
    key: 'modified',
    header: 'Modificado',
    className: 'hidden md:table-cell w-[10rem]',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">{formatDate(item.updatedAt)}</span>
    ),
  },
  {
    key: 'size',
    header: 'Tamaño',
    className: 'hidden lg:table-cell w-[7rem]',
    render: (item) => (
      <span className="text-[var(--text-secondary)]">
        {item.kind === 'folder' ? '—' : formatBytes(item.size)}
      </span>
    ),
  },
];

/** Tabla reutilizable para listas de archivos en todas las vistas user (excepto Papelera). */
export const DriveItemsTable = ({
  items,
  variant = 'default',
  columns,
  selectable = false,
  selectedIds,
  onToggleSelect,
  onOpenItem,
  getRowActions,
  showShareIcon = false,
}: DriveItemsTableProps) => {
  const resolvedColumns =
    columns ??
    (variant === 'shared' ? sharedTableColumns : defaultTableColumns(showShareIcon));

  return (
    <VaultCard padding="p-0" className="overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm">
        <thead>
          <tr className="border-b border-[var(--border-subtle)] text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {selectable ? <th className="w-10 px-4 py-3" /> : null}
            {resolvedColumns.map((column) => (
              <th key={column.key} className={`px-4 py-3 ${column.className ?? ''}`}>
                {column.header}
              </th>
            ))}
            {getRowActions ? <th className="w-12 px-4 py-3" aria-label="Acciones" /> : null}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => {
            const isSelected = selectedIds?.has(item.id) ?? false;

            return (
              <tr
                key={item.id}
                onClick={() => onOpenItem?.(item)}
                className={`group cursor-pointer border-b border-[var(--border-subtle)] transition-colors last:border-b-0 hover:bg-[var(--bg-surface)] ${
                  isSelected ? 'bg-[var(--accent-subtle)]' : ''
                }`}
              >
                {selectable ? (
                  <td className="px-4 py-3" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggleSelect?.(item.id)}
                      aria-label={`Seleccionar ${item.name}`}
                    />
                  </td>
                ) : null}
                {resolvedColumns.map((column) => (
                  <td key={column.key} className={`px-4 py-3 ${column.className ?? ''}`}>
                    {column.render(item)}
                  </td>
                ))}
                {getRowActions ? (
                  <td className="px-4 py-3 text-right" onClick={(event) => event.stopPropagation()}>
                    <div className="flex justify-end">
                      <DriveRowActionsMenu actions={getRowActions(item)} />
                    </div>
                  </td>
                ) : null}
              </tr>
            );
          })}
        </tbody>
      </table>
    </VaultCard>
  );
};

export { NameCell };
