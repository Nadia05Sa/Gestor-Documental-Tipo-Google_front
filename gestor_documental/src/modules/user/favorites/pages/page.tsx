import { Star } from 'lucide-react';
import { canEditDriveItem } from '@shared/domain/drive/utils/driveItemUtils';
import { useFavorites } from '../hooks/useFavorites';
import { DriveVaultCollectionShell } from '@shared/domain/drive/organisms/DriveVaultCollectionShell';
import { DriveItemActionModals } from '../../drive/organisms/DriveItemActionModals';
import { useDriveItemActionModals } from '../../drive/hooks/useDriveItemActionModals';
import { DriveVaultList } from '@shared/domain/drive/organisms/DriveVaultList';

export const FavoritesPage = () => {
  const favorites = useFavorites();
  const modals = useDriveItemActionModals();

  return (
    <>
      <DriveVaultCollectionShell
        title="Destacados"
        itemCount={favorites.items.length}
        previewItem={favorites.previewItem}
        setPreviewItem={favorites.setPreviewItem}
        detailHandlers={favorites.detailHandlers}
        onRefresh={favorites.refresh}
      >
        {({ viewMode, onMove }) => (
          <DriveVaultList
            items={favorites.items}
            viewMode={viewMode}
            emptyState={{
              icon: Star,
              title: 'No tienes archivos destacados',
              description: 'Marca archivos o carpetas con la estrella para verlos aquí.',
            }}
            onOpenItem={favorites.openItem}
            onToggleStar={favorites.toggleStar}
            onMoveToTrash={favorites.moveToTrash}
            onMove={onMove}
            onShare={modals.setShareItem}
            onRename={modals.setRenameItem}
            onVersionHistory={modals.setVersionItem}
            canShare={canEditDriveItem}
            canRename={canEditDriveItem}
          />
        )}
      </DriveVaultCollectionShell>

      <DriveItemActionModals
        renameItem={modals.renameItem}
        onCloseRename={() => modals.setRenameItem(null)}
        onRename={favorites.rename}
        shareItem={modals.shareItem}
        onCloseShare={() => modals.setShareItem(null)}
        onSaveShare={favorites.saveShareSettings}
        getShareLink={favorites.getShareLink}
        versionItem={modals.versionItem}
        onCloseVersion={() => modals.setVersionItem(null)}
        getVersions={favorites.getVersionHistory}
        onRestoreVersion={favorites.restoreVersion}
      />
    </>
  );
};
