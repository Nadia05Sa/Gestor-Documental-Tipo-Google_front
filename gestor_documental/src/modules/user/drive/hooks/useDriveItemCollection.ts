import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@shared/components/organisms/Toast';
import type { DriveItem, DriveItemVersion, PermissionLevel, ShareAccess } from '../types/drive.types';

export type DriveItemCollectionApi = {
  list: () => DriveItem[];
  toggleStar: (id: string) => void;
  touchRecent: (id: string) => void;
  moveToTrash: (id: string) => void;
  rename: (id: string, name: string) => void;
  updateShareSettings: (
    id: string,
    settings: { isShared: boolean; shareAccess: ShareAccess; permissionLevel: PermissionLevel },
  ) => void;
  getShareLink: (id: string) => string;
  listVersionHistory: (id: string) => DriveItemVersion[];
  restoreVersion: (id: string) => void;
};

type OpenFolderBehavior = 'navigate-drive' | 'preview';

type UseDriveItemCollectionOptions = {
  api: DriveItemCollectionApi;
  getToggleStarMessage: (item: DriveItem) => string;
  openFolder?: OpenFolderBehavior;
  closePreviewOnToggleStar?: boolean;
};

export const useDriveItemCollection = ({
  api,
  getToggleStarMessage,
  openFolder = 'preview',
  closePreviewOnToggleStar = false,
}: UseDriveItemCollectionOptions) => {
  const navigate = useNavigate();
  const [version, setVersion] = useState(0);
  const [previewItem, setPreviewItem] = useState<DriveItem | null>(null);

  const items = useMemo<DriveItem[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => api.list(),
    [version],
  );

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const toggleStar = useCallback((item: DriveItem) => {
    api.toggleStar(item.id);
    refresh();
    toast.info(getToggleStarMessage(item));
    if (closePreviewOnToggleStar && previewItem?.id === item.id) {
      setPreviewItem(null);
    }
  }, [api, closePreviewOnToggleStar, getToggleStarMessage, previewItem?.id, refresh]);

  const openItem = useCallback((item: DriveItem) => {
    if (item.kind === 'folder' && openFolder === 'navigate-drive') {
      navigate('/drive');
      return;
    }
    api.touchRecent(item.id);
    setPreviewItem(item);
    refresh();
  }, [api, navigate, openFolder, refresh]);

  const moveToTrash = useCallback((item: DriveItem) => {
    api.moveToTrash(item.id);
    refresh();
    if (previewItem?.id === item.id) setPreviewItem(null);
    toast.success('Movido a la papelera');
  }, [api, previewItem?.id, refresh]);

  const rename = useCallback((id: string, name: string) => {
    api.rename(id, name);
    refresh();
    toast.success('Elemento renombrado');
  }, [api, refresh]);

  const saveShareSettings = useCallback(
    (
      itemId: string,
      settings: { isShared: boolean; shareAccess: ShareAccess; permissionLevel: PermissionLevel },
    ) => {
      api.updateShareSettings(itemId, settings);
      refresh();
      toast.success(settings.isShared ? 'Elemento compartido' : 'Compartir desactivado');
    },
    [api, refresh],
  );

  const restoreVersion = useCallback(
    (item: DriveItem, versionEntry: DriveItemVersion) => {
      api.restoreVersion(item.id);
      refresh();
      toast.success(`"${item.name}" restaurado a ${versionEntry.versionLabel.toLowerCase()}`);
    },
    [api, refresh],
  );

  const detailHandlers = useMemo(() => ({
    onToggleStar: closePreviewOnToggleStar
      ? toggleStar
      : (item: DriveItem) => {
          toggleStar(item);
          setPreviewItem((current) =>
            current?.id === item.id ? { ...current, isStarred: !current.isStarred } : current,
          );
        },
    onMoveToTrash: moveToTrash,
  }), [closePreviewOnToggleStar, moveToTrash, toggleStar]);

  return {
    items,
    previewItem,
    setPreviewItem,
    toggleStar,
    openItem,
    moveToTrash,
    refresh,
    detailHandlers,
    rename,
    saveShareSettings,
    getShareLink: api.getShareLink,
    getVersionHistory: api.listVersionHistory,
    restoreVersion,
  };
};
