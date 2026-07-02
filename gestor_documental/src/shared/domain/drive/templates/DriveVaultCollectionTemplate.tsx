import type { ReactNode } from 'react';
import { VaultViewPageLayout } from '@shared/components/templates/VaultViewPageLayout';
import type { ViewMode } from '../types/drive.types';

type DriveVaultCollectionTemplateProps = {
  title: string;
  itemCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  children: ReactNode;
  /** Modales y paneles laterales montados fuera del layout principal. */
  overlays?: ReactNode;
};

/**
 * Layout puro para vistas de colección drive (grid/lista + encabezado).
 * Sin estado interno ni modales: solo estructura y slots.
 */
export function DriveVaultCollectionTemplate({
  title,
  itemCount,
  viewMode,
  onViewModeChange,
  children,
  overlays,
}: DriveVaultCollectionTemplateProps) {
  return (
    <>
      <VaultViewPageLayout
        title={title}
        itemCount={itemCount}
        viewMode={viewMode}
        onViewModeChange={onViewModeChange}
      >
        {children}
      </VaultViewPageLayout>

      {overlays}
    </>
  );
}
