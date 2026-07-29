import { Users } from 'lucide-react';
import { canEditDriveItem } from '@shared/domain/drive/utils/driveItemUtils';
import { useShared } from '../hooks/useShared';
import { DriveVaultCollectionShell } from '@shared/domain/drive/organisms/DriveVaultCollectionShell';
import { DriveItemActionModals } from '../../drive/organisms/DriveItemActionModals';
import { useDriveItemActionModals } from '../../drive/hooks/useDriveItemActionModals';
import { DriveVaultList } from '@shared/domain/drive/organisms/DriveVaultList';

export const SharedPage = () => {
  const shared = useShared();
  const modals = useDriveItemActionModals();

  return (
    <>
      <DriveVaultCollectionShell
        title="Compartidos conmigo"
        itemCount={shared.items.length}
        defaultViewMode="list"
        previewItem={shared.previewItem}
        setPreviewItem={shared.setPreviewItem}
        detailHandlers={shared.detailHandlers}
        onRefresh={shared.refresh}
      >
        {({ viewMode, onMove }) => (
          <DriveVaultList
            items={shared.items}
            viewMode={viewMode}
            tableVariant="shared"
            showSharedIcon
            emptyState={{
              icon: Users,
              title: 'Nada compartido contigo aún',
              description: 'Los archivos que otras personas compartan contigo aparecerán aquí.',
            }}
            onOpenItem={shared.openItem}
            onToggleStar={shared.toggleStar}
            onMoveToTrash={shared.moveToTrash}
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
        onRename={shared.rename}
        shareItem={modals.shareItem}
        onCloseShare={() => modals.setShareItem(null)}
        onSaveShare={shared.saveShareSettings}
        getShareLink={shared.getShareLink}
        versionItem={modals.versionItem}
        onCloseVersion={() => modals.setVersionItem(null)}
        getVersions={shared.getVersionHistory}
        onRestoreVersion={shared.restoreVersion}
      />
    </>
  );
};
