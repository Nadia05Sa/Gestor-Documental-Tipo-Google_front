import { useCallback } from 'react';
import { toast } from '@shared/components/organisms/Toast';
import type { DriveItem, DriveItemVersion, PermissionLevel, ShareAccess } from '@shared/domain/drive/types/drive.types';
import { sharedApi } from '../api/sharedApi';
import { useDriveItemCollection } from '../../drive/hooks/useDriveItemCollection';

export const useShared = () => {
  const collection = useDriveItemCollection({
    api: sharedApi,
    getToggleStarMessage: (item) =>
      item.isStarred ? 'Eliminado de destacados' : 'Añadido a destacados',
    openFolder: 'navigate-drive',
  });

  const { refresh } = collection;

  const rename = useCallback(
    (id: string, name: string) => {
      sharedApi.rename(id, name);
      refresh();
      toast.success('Elemento renombrado');
    },
    [refresh],
  );

  const saveShareSettings = useCallback(
    (
      itemId: string,
      settings: { isShared: boolean; shareAccess: ShareAccess; permissionLevel: PermissionLevel },
    ) => {
      sharedApi.updateShareSettings(itemId, settings);
      refresh();
      toast.success(settings.isShared ? 'Elemento compartido' : 'Compartir desactivado');
    },
    [refresh],
  );

  const restoreVersion = useCallback(
    (item: DriveItem, version: DriveItemVersion) => {
      sharedApi.restoreVersion(item.id);
      refresh();
      toast.success(`"${item.name}" restaurado a ${version.versionLabel.toLowerCase()}`);
    },
    [refresh],
  );

  return {
    ...collection,
    rename,
    saveShareSettings,
    getShareLink: sharedApi.getShareLink,
    getVersionHistory: sharedApi.listVersionHistory,
    restoreVersion,
  };
};
