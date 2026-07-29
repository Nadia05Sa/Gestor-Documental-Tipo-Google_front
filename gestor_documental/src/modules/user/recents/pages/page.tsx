import { Clock } from 'lucide-react';
import { EmptyStatePanel } from '@shared/components/molecules/EmptyStatePanel';
import { DriveVaultSectionList } from '@shared/domain/drive/organisms/DriveVaultList';
import { canEditDriveItem } from '@shared/domain/drive/utils/driveItemUtils';
import { DriveVaultCollectionShell } from '@shared/domain/drive/organisms/DriveVaultCollectionShell';
import { DriveItemActionModals } from '../../drive/organisms/DriveItemActionModals';
import { useDriveItemActionModals } from '../../drive/hooks/useDriveItemActionModals';
import { useRecents } from '../hooks/useRecents';

export const RecentsPage = () => {
  const recents = useRecents();
  const modals = useDriveItemActionModals();
  const itemCount = recents.sections.reduce((total, section) => total + section.items.length, 0);

  return (
    <>
      <DriveVaultCollectionShell
        title="Archivos recientes"
        itemCount={itemCount}
        previewItem={recents.previewItem}
        setPreviewItem={recents.setPreviewItem}
        detailHandlers={recents.detailHandlers}
        onRefresh={recents.refresh}
      >
        {({ viewMode, onMove }) =>
          recents.hasItems ? (
            <DriveVaultSectionList
              sections={recents.sections.map((section) => ({
                key: section.group,
                title: section.group,
                items: section.items,
              }))}
              viewMode={viewMode}
              onOpenItem={recents.openItem}
              onToggleStar={recents.toggleStar}
              onMoveToTrash={recents.moveToTrash}
              onMove={onMove}
              onShare={modals.setShareItem}
              onRename={modals.setRenameItem}
              onVersionHistory={modals.setVersionItem}
              canShare={canEditDriveItem}
              canRename={canEditDriveItem}
              getFooterRight={recents.getRelativeLabel}
            />
          ) : (
            <EmptyStatePanel
              icon={Clock}
              title="Aún no hay archivos recientes"
              description="Los archivos que abras aparecerán aquí."
            />
          )
        }
      </DriveVaultCollectionShell>

      <DriveItemActionModals
        renameItem={modals.renameItem}
        onCloseRename={() => modals.setRenameItem(null)}
        onRename={recents.rename}
        shareItem={modals.shareItem}
        onCloseShare={() => modals.setShareItem(null)}
        onSaveShare={recents.saveShareSettings}
        getShareLink={recents.getShareLink}
        versionItem={modals.versionItem}
        onCloseVersion={() => modals.setVersionItem(null)}
        getVersions={recents.getVersionHistory}
        onRestoreVersion={recents.restoreVersion}
      />
    </>
  );
};
