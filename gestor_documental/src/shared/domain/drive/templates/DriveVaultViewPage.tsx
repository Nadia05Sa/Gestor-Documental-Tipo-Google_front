import { useState, type Dispatch, type ReactNode, type SetStateAction } from 'react';
import { VaultViewPageLayout } from '@shared/components/layout/VaultViewPageLayout';
import { MoveItemModal } from '@shared/components/drive/MoveItemModal';
import { DriveDetail } from './DriveDetail';
import type { DriveItem, ViewMode } from '../types/drive.types';

type DriveVaultViewPageProps = {
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

/** Layout estándar para vistas de colección de archivos con detalle lateral y mover. */
export const DriveVaultViewPage = ({
  title,
  itemCount,
  defaultViewMode = 'grid',
  previewItem,
  setPreviewItem,
  detailHandlers,
  onRefresh,
  children,
}: DriveVaultViewPageProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultViewMode);
  const [moveItem, setMoveItem] = useState<DriveItem | null>(null);

  return (
    <VaultViewPageLayout
      title={title}
      itemCount={itemCount}
      viewMode={viewMode}
      onViewModeChange={setViewMode}
    >
      {children({ viewMode, onMove: setMoveItem })}

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
    </VaultViewPageLayout>
  );
};
