import type { ComponentType } from 'react';
import { toast } from '@shared/components/organisms/Toast';
import { EmptyStatePanel } from '@shared/components/molecules/EmptyStatePanel';
import { DriveItemsGrid } from './DriveItemsGrid';
import { DriveItemsTable } from './DriveItemsTable';
import { buildStandardDriveRowActions } from '../utils/driveRowActions';
import type { DriveRowAction } from './DriveRowActionsMenu';
import type { DriveItem, ViewMode } from '../types/drive.types';

type DriveVaultListEmptyState = {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description: string;
};

type DriveVaultListProps = {
  items: DriveItem[];
  viewMode: ViewMode;
  onOpenItem: (item: DriveItem) => void;
  onToggleStar: (item: DriveItem) => void;
  onMoveToTrash: (item: DriveItem) => void;
  onMove?: (item: DriveItem) => void;
  onShare?: (item: DriveItem) => void;
  onRename?: (item: DriveItem) => void;
  onVersionHistory?: (item: DriveItem) => void;
  canShare?: (item: DriveItem) => boolean;
  canRename?: (item: DriveItem) => boolean;
  emptyState?: DriveVaultListEmptyState;
  tableVariant?: 'default' | 'shared';
  showSharedIcon?: boolean;
  getFooterRight?: (item: DriveItem) => string;
};

type RowActionsSource = Pick<
  DriveVaultListProps,
  | 'onOpenItem'
  | 'onToggleStar'
  | 'onMoveToTrash'
  | 'onMove'
  | 'onShare'
  | 'onRename'
  | 'onVersionHistory'
  | 'canShare'
  | 'canRename'
>;

const makeGetRowActions =
  ({
    onOpenItem,
    onToggleStar,
    onMoveToTrash,
    onMove,
    onShare,
    onRename,
    onVersionHistory,
    canShare,
    canRename,
  }: RowActionsSource) =>
  (item: DriveItem): DriveRowAction[] =>
    buildStandardDriveRowActions(item, {
      onPreview: onOpenItem,
      onDownload: (file) => toast.info(`Descargando ${file.name}...`),
      onToggleStar,
      onMove,
      onShare,
      onRename,
      onVersionHistory,
      canShare,
      canRename,
      onDelete: onMoveToTrash,
    });

/** Lista unificada para vistas de archivos (Destacados, Compartidos, etc.). */
export const DriveVaultList = ({
  items,
  viewMode,
  onOpenItem,
  onToggleStar,
  onMoveToTrash,
  onMove,
  onShare,
  onRename,
  onVersionHistory,
  canShare,
  canRename,
  emptyState,
  tableVariant = 'default',
  showSharedIcon = false,
  getFooterRight,
}: DriveVaultListProps) => {
  if (items.length === 0 && emptyState) {
    return (
      <EmptyStatePanel
        icon={emptyState.icon}
        title={emptyState.title}
        description={emptyState.description}
      />
    );
  }

  const getRowActions = makeGetRowActions({
    onOpenItem,
    onToggleStar,
    onMoveToTrash,
    onMove,
    onShare,
    onRename,
    onVersionHistory,
    canShare,
    canRename,
  });

  if (viewMode === 'list') {
    return (
      <DriveItemsTable
        items={items}
        variant={tableVariant}
        onOpenItem={onOpenItem}
        getRowActions={getRowActions}
      />
    );
  }

  return (
    <DriveItemsGrid
      items={items}
      onOpenItem={onOpenItem}
      onToggleStar={onToggleStar}
      showSharedIcon={showSharedIcon}
      getFooterRight={getFooterRight}
    />
  );
};

type DriveVaultSectionListProps = Omit<DriveVaultListProps, 'items' | 'emptyState'> & {
  sections: Array<{ key: string; title: string; items: DriveItem[] }>;
};

/** Lista por secciones (p. ej. Archivos recientes agrupados por fecha). */
export const DriveVaultSectionList = ({
  sections,
  viewMode,
  onOpenItem,
  onToggleStar,
  onMoveToTrash,
  onMove,
  onShare,
  onRename,
  onVersionHistory,
  canShare,
  canRename,
  tableVariant = 'default',
  showSharedIcon = false,
  getFooterRight,
}: DriveVaultSectionListProps) => {
  const getRowActions = makeGetRowActions({
    onOpenItem,
    onToggleStar,
    onMoveToTrash,
    onMove,
    onShare,
    onRename,
    onVersionHistory,
    canShare,
    canRename,
  });

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <section key={section.key} className="space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
            {section.title}
          </h2>

          {viewMode === 'grid' ? (
            <DriveItemsGrid
              items={section.items}
              onOpenItem={onOpenItem}
              onToggleStar={onToggleStar}
              showSharedIcon={showSharedIcon}
              getFooterRight={getFooterRight}
            />
          ) : (
            <DriveItemsTable
              items={section.items}
              variant={tableVariant}
              onOpenItem={onOpenItem}
              getRowActions={getRowActions}
            />
          )}
        </section>
      ))}
    </div>
  );
};

export type { DriveVaultListEmptyState };
