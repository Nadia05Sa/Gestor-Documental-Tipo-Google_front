import { useState } from 'react';
import type { DriveItem } from '../types/drive.types';

/** Estado de los modales de Renombrar/Compartir/Historial de versiones. */
export const useDriveItemActionModals = () => {
  const [renameItem, setRenameItem] = useState<DriveItem | null>(null);
  const [shareItem, setShareItem] = useState<DriveItem | null>(null);
  const [versionItem, setVersionItem] = useState<DriveItem | null>(null);

  return { renameItem, setRenameItem, shareItem, setShareItem, versionItem, setVersionItem };
};
