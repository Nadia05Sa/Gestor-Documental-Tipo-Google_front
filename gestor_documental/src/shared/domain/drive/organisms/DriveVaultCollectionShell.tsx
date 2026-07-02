import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { DriveVaultCollectionTemplate } from '../templates/DriveVaultCollectionTemplate';
import { MoveItemModal } from './MoveItemModal';
import { DriveDetail } from './DriveDetail';
import type { DriveItem, ViewMode } from '../types/drive.types';

export type DriveVaultCollectionShellProps = {
  title: string;
  itemCount: number;
  defaultViewMode?: ViewMode;
  previewItem: DriveItem | null;
  setPreviewItem: Dispatch<SetStateAction<DriveItem | null>>;
  detailHandlers: {
    onToggleStar: (item: DriveItem) => void;
    onMoveToTrash: (item: DriveItem) => void;
  };
  onRefresh: () => void;
  children: (ctx: { viewMode: ViewMode; onMove: (item: DriveItem) => void }) => ReactNode;
};

/**
 * Shell de vistas drive (destacados, recientes, compartidos…):
 * orquesta modo de vista, mover ítem y panel de detalle.
 */
export function DriveVaultCollectionShell({
  title,
  itemCount,
  defaultViewMode = 'grid',
  previewItem,
  setPreviewItem,
  detailHandlers,
  onRefresh,
  children,
}: DriveVaultCollectionShellProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [moveItem, setMoveItem] = useState<DriveItem | null>(null);

  return (
    <DriveVaultCollectionTemplate
      title={title}
      itemCount={itemCount}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      overlays={(
        <>
          <MoveItemModal
            item={moveItem}
            onClose={() => setMoveItem(null)}
            onMoved={onRefresh}
          />

          <DriveDetail
            item={previewItem}
            onClose={() => setPreviewItem(null)}
            onToggleStar={detailHandlers.onToggleStar}
            onMoveToTrash={detailHandlers.onMoveToTrash}
          />
        </>
      )}
    >
      {children({ viewMode, onMove: setMoveItem })}
    </DriveVaultCollectionTemplate>
  );
}

/** @deprecated Usar `DriveVaultCollectionShell`. Alias mantenido por compatibilidad. */
export const DriveVaultViewPage = DriveVaultCollectionShell;
