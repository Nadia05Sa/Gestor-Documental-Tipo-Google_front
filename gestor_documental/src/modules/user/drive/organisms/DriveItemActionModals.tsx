import { VersionHistoryModal } from '@shared/domain/drive/organisms/VersionHistoryModal';
import type { DriveItem, DriveItemVersion, PermissionLevel, ShareAccess } from '../types/drive.types';
import { DriveForm } from './DriveForm';
import { ShareModal } from './ShareModal';

type DriveItemActionModalsProps = {
  renameItem: DriveItem | null;
  onCloseRename: () => void;
  onRename: (id: string, name: string) => void;
  shareItem: DriveItem | null;
  onCloseShare: () => void;
  onSaveShare: (
    itemId: string,
    settings: { isShared: boolean; shareAccess: ShareAccess; permissionLevel: PermissionLevel },
  ) => void;
  getShareLink: (itemId: string) => string;
  versionItem: DriveItem | null;
  onCloseVersion: () => void;
  getVersions: (itemId: string) => DriveItemVersion[];
  onRestoreVersion: (item: DriveItem, version: DriveItemVersion) => void;
};

/** Bundle de modales de Renombrar/Compartir/Historial reutilizado por Compartidos, Destacados y Recientes. */
export const DriveItemActionModals = ({
  renameItem,
  onCloseRename,
  onRename,
  shareItem,
  onCloseShare,
  onSaveShare,
  getShareLink,
  versionItem,
  onCloseVersion,
  getVersions,
  onRestoreVersion,
}: DriveItemActionModalsProps) => (
  <>
    <DriveForm
      open={Boolean(renameItem)}
      title="Renombrar"
      label="Nuevo nombre"
      confirmLabel="Guardar"
      initialValue={renameItem?.name ?? ''}
      onClose={onCloseRename}
      onSubmit={(name) => {
        if (renameItem) onRename(renameItem.id, name);
      }}
    />

    <ShareModal
      item={shareItem}
      onClose={onCloseShare}
      onSave={onSaveShare}
      getShareLink={getShareLink}
    />

    <VersionHistoryModal
      item={versionItem}
      onClose={onCloseVersion}
      getVersions={getVersions}
      onRestore={onRestoreVersion}
    />
  </>
);
