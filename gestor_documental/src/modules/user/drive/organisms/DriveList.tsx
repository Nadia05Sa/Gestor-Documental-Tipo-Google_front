import { FolderOpen } from 'lucide-react';
import { toast } from '@shared/components/Toast';
import { EmptyStatePanel } from '@shared/components/tables/EmptyStatePanel';
import { DriveItemsGrid } from '@shared/components/drive/DriveItemsGrid';
import { DriveItemsTable } from '@shared/components/drive/DriveItemsTable';
import { buildStandardDriveRowActions } from '@shared/components/drive/driveRowActions';
import type { DriveItem, ViewMode } from '../types/drive.types';

type DriveListProps = {
  items: DriveItem[];
  viewMode: ViewMode;
  onOpenItem: (item: DriveItem) => void;
  onToggleStar: (item: DriveItem) => void;
  onRename: (item: DriveItem) => void;
  onShare: (item: DriveItem) => void;
  onMoveToTrash: (item: DriveItem) => void;
  onUploadFile: () => void;
  onMoveItem?: (itemId: string, targetFolderId: string | null) => void;
  onMove?: (item: DriveItem) => void;
};

export const DriveList = ({
  items,
  viewMode,
  onOpenItem,
  onToggleStar,
  onRename,
  onShare,
  onMoveToTrash,
  onUploadFile,
  onMoveItem,
  onMove,
}: DriveListProps) => {
  if (items.length === 0) {
    return (
      <EmptyStatePanel
        icon={FolderOpen}
        title="Esta carpeta está vacía"
        description="Sube un archivo o crea una carpeta para empezar."
        actionLabel="Subir archivo"
        onAction={onUploadFile}
      />
    );
  }

  const getRowActions = (item: DriveItem) =>
    buildStandardDriveRowActions(item, {
      onPreview: onOpenItem,
      onDownload: (file) => toast.info(`Descargando ${file.name}...`),
      onShare,
      onMove,
      onRename,
      onToggleStar,
      onDelete: onMoveToTrash,
    });

  if (viewMode === 'list') {
    return (
      <DriveItemsTable
        items={items}
        variant="default"
        showShareIcon
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
      showSharedIcon
      movable={Boolean(onMoveItem)}
      onMoveItem={onMoveItem}
    />
  );
};
