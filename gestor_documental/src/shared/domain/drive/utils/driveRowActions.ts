import {
  Download,
  Eye,
  FolderInput,
  History,
  Pencil,
  Share2,
  Star,
  Trash2,
} from 'lucide-react';
import { toast } from '@shared/components/organisms/Toast';
import type { DriveItem } from '../types/drive.types';
import type { DriveRowAction } from '../organisms/DriveRowActionsMenu';

export type DriveItemMenuHandlers = {
  onPreview: (item: DriveItem) => void;
  onDownload?: (item: DriveItem) => void;
  onShare?: (item: DriveItem) => void;
  onMove?: (item: DriveItem) => void;
  onRename?: (item: DriveItem) => void;
  onToggleStar?: (item: DriveItem) => void;
  onVersionHistory?: (item: DriveItem) => void;
  onDelete?: (item: DriveItem) => void;
};

const soon = (feature: string) => (_item: DriveItem) => {
  toast.info(`${feature} disponible próximamente.`);
};

/** Menú contextual estándar Figma para tablas de archivos. */
export const buildStandardDriveRowActions = (
  item: DriveItem,
  handlers: DriveItemMenuHandlers,
): DriveRowAction[] => {
  const {
    onPreview,
    onDownload = soon('Descarga'),
    onShare = soon('Compartir'),
    onMove = soon('Mover'),
    onRename = soon('Renombrar'),
    onToggleStar = soon('Destacar'),
    onVersionHistory = soon('Historial de versiones'),
    onDelete = soon('Eliminar'),
  } = handlers;

  return [
    { key: 'preview', label: 'Vista previa', icon: Eye, onClick: () => onPreview(item) },
    { key: 'download', label: 'Descargar', icon: Download, onClick: () => onDownload(item) },
    { key: 'share', label: 'Compartir', icon: Share2, onClick: () => onShare(item) },
    { key: 'move', label: 'Mover a...', icon: FolderInput, onClick: () => onMove(item) },
    { key: 'rename', label: 'Renombrar', icon: Pencil, onClick: () => onRename(item) },
    {
      key: 'star',
      label: item.isStarred ? 'Quitar destacado' : 'Destacar',
      icon: Star,
      onClick: () => onToggleStar(item),
    },
    {
      key: 'history',
      label: 'Historial de versiones',
      icon: History,
      onClick: () => onVersionHistory(item),
    },
    {
      key: 'delete',
      label: 'Eliminar',
      icon: Trash2,
      tone: 'danger',
      dividerBefore: true,
      onClick: () => onDelete(item),
    },
  ];
};
