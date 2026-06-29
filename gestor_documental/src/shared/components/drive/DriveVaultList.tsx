import type { ComponentType } from 'react';
import { toast } from '@shared/components/Toast';
import { EmptyStatePanel } from '@shared/components/tables/EmptyStatePanel';
import { DriveItemsGrid } from '@shared/components/drive/DriveItemsGrid';
import { DriveItemsTable } from '@shared/components/drive/DriveItemsTable';
import { buildStandardDriveRowActions } from '@shared/components/drive/driveRowActions';
import type { DriveItem, ViewMode } from '../../../modules/user/drive/types/drive.types';

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
  emptyState?: DriveVaultListEmptyState;
  tableVariant?: 'default' | 'shared';
  showSharedIcon?: boolean;
  getFooterRight?: (item: DriveItem) => string;
};

/** Lista unificada para vistas de archivos (Destacados, Compartidos, etc.). */
export const DriveVaultList = ({
  items,
  viewMode,
  onOpenItem,
  onToggleStar,
  onMoveToTrash,
  onMove,
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

  const getRowActions = (item: DriveItem) =>
    buildStandardDriveRowActions(item, {
      onPreview: onOpenItem,
      onDownload: (file) => toast.info(`Descargando ${file.name}...`),
      onToggleStar,
      onMove,
      onDelete: onMoveToTrash,
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
  tableVariant = 'default',
  showSharedIcon = false,
  getFooterRight,
}: DriveVaultSectionListProps) => {
  const getRowActions = (item: DriveItem) =>
    buildStandardDriveRowActions(item, {
      onPreview: onOpenItem,
      onDownload: (file) => toast.info(`Descargando ${file.name}...`),
      onToggleStar,
      onMove,
      onDelete: onMoveToTrash,
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
