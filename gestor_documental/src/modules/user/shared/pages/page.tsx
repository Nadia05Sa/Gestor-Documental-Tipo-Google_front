import { useState } from 'react';
import { Users } from 'lucide-react';
import { useShared } from '../hooks/useShared';
import { DriveVaultCollectionShell } from '@shared/domain/drive/organisms/DriveVaultCollectionShell';
import { DriveForm } from '../../drive/organisms/DriveForm';
import { ShareModal } from '../../drive/organisms/ShareModal';
import { DriveVaultList } from '@shared/domain/drive/organisms/DriveVaultList';
import { VersionHistoryModal } from '@shared/domain/drive/organisms/VersionHistoryModal';
import type { DriveItem } from '@shared/domain/drive/types/drive.types';

const canEditItem = (item: DriveItem) => item.permissionLevel === 'EDITOR';

export const SharedPage = () => {
  const shared = useShared();
  const [renameItem, setRenameItem] = useState<DriveItem | null>(null);
  const [shareItem, setShareItem] = useState<DriveItem | null>(null);
  const [versionItem, setVersionItem] = useState<DriveItem | null>(null);

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
            onShare={setShareItem}
            onRename={setRenameItem}
            onVersionHistory={setVersionItem}
            canShare={canEditItem}
            canRename={canEditItem}
          />
        )}
      </DriveVaultCollectionShell>

      <DriveForm
        open={Boolean(renameItem)}
        title="Renombrar"
        label="Nuevo nombre"
        confirmLabel="Guardar"
        initialValue={renameItem?.name ?? ''}
        onClose={() => setRenameItem(null)}
        onSubmit={(name) => {
          if (renameItem) shared.rename(renameItem.id, name);
        }}
      />

      <ShareModal
        item={shareItem}
        onClose={() => setShareItem(null)}
        onSave={shared.saveShareSettings}
        getShareLink={shared.getShareLink}
      />

      <VersionHistoryModal
        item={versionItem}
        onClose={() => setVersionItem(null)}
        getVersions={shared.getVersionHistory}
        onRestore={shared.restoreVersion}
      />
    </>
  );
};
