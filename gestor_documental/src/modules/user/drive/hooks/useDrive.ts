import { useCallback, useMemo, useState } from 'react';
import { toast } from '@shared/components/organisms/Toast';
import { useDriveSearch } from '@context/DriveSearchContext';
import { driveApi } from '../api/driveApi';
import type {
  AdvancedSearchFilters,
  Breadcrumb,
  DriveItem,
  PermissionLevel,
  ShareAccess,
  ViewMode,
} from '../types/drive.types';
import { EMPTY_ADVANCED_FILTERS } from '../types/drive.types';

const matchesFilters = (item: DriveItem, query: string, filters: AdvancedSearchFilters): boolean => {
  const normalizedQuery = query.trim().toLowerCase();
  const filterQuery = filters.query.trim().toLowerCase();
  const searchTerm = filterQuery || normalizedQuery;

  if (searchTerm && !item.name.toLowerCase().includes(searchTerm)) return false;
  if (filters.fileType && item.kind === 'file' && item.extension !== filters.fileType) return false;
  if (filters.sharedOnly && !item.isShared) return false;
  if (filters.starredOnly && !item.isStarred) return false;

  if (filters.minSizeMb) {
    const minBytes = Number(filters.minSizeMb) * 1024 * 1024;
    if (item.kind === 'file' && item.size < minBytes) return false;
  }
  if (filters.maxSizeMb) {
    const maxBytes = Number(filters.maxSizeMb) * 1024 * 1024;
    if (item.kind === 'file' && item.size > maxBytes) return false;
  }
  if (filters.dateFrom && new Date(item.updatedAt) < new Date(filters.dateFrom)) return false;
  if (filters.dateTo) {
    const end = new Date(filters.dateTo);
    end.setHours(23, 59, 59, 999);
    if (new Date(item.updatedAt) > end) return false;
  }
  if (filters.tags.trim()) {
    const requiredTags = filters.tags.split(',').map((tag) => tag.trim().toLowerCase()).filter(Boolean);
    const itemTags = (item.tags ?? []).map((tag) => tag.toLowerCase());
    if (!requiredTags.every((tag) => itemTags.includes(tag))) return false;
  }

  return true;
};

/**
 * Orquesta el explorador de Drive: carpeta actual, breadcrumbs, búsqueda,
 * modo de vista y las acciones sobre ítems.
 */
export const useDrive = () => {
  const driveSearch = useDriveSearch();
  const [currentParentId, setCurrentParentId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchQuery = driveSearch?.searchQuery ?? localSearchQuery;
  const setSearchQuery = driveSearch?.setSearchQuery ?? setLocalSearchQuery;
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedSearchFilters>(EMPTY_ADVANCED_FILTERS);
  const [version, setVersion] = useState(0);

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const rawItems = useMemo<DriveItem[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => driveApi.listByParent(currentParentId),
    [currentParentId, version],
  );

  const items = useMemo(
    () => rawItems.filter((item) => matchesFilters(item, searchQuery, advancedFilters)),
    [rawItems, searchQuery, advancedFilters],
  );

  const breadcrumbs = useMemo<Breadcrumb[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => driveApi.getBreadcrumbs(currentParentId),
    [currentParentId, version],
  );

  const openFolder = useCallback((id: string | null) => setCurrentParentId(id), []);

  const createFolder = useCallback(
    (name: string) => {
      driveApi.createFolder({ name, parentId: currentParentId });
      refresh();
      toast.success('Carpeta creada');
    },
    [currentParentId, refresh],
  );

  const createDocument = useCallback(
    (name: string) => {
      driveApi.createDocument({ name, parentId: currentParentId });
      refresh();
      toast.success('Documento creado');
    },
    [currentParentId, refresh],
  );

  const createSpreadsheet = useCallback(
    (name: string) => {
      driveApi.createSpreadsheet({ name, parentId: currentParentId });
      refresh();
      toast.success('Hoja de cálculo creada');
    },
    [currentParentId, refresh],
  );

  const uploadFile = useCallback(
    (name: string, size: number) => {
      driveApi.uploadFile({ name, parentId: currentParentId, size });
      refresh();
      toast.success('Archivo subido');
    },
    [currentParentId, refresh],
  );

  const rename = useCallback(
    (id: string, name: string) => {
      driveApi.rename(id, name);
      refresh();
      toast.success('Elemento renombrado');
    },
    [refresh],
  );

  const toggleStar = useCallback(
    (item: DriveItem) => {
      driveApi.toggleStar(item.id);
      refresh();
      toast.info(item.isStarred ? 'Eliminado de destacados' : 'Añadido a destacados');
    },
    [refresh],
  );

  const saveShareSettings = useCallback(
    (itemId: string, settings: { isShared: boolean; shareAccess: ShareAccess; permissionLevel: PermissionLevel }) => {
      driveApi.updateShareSettings(itemId, settings);
      refresh();
      toast.success(settings.isShared ? 'Elemento compartido' : 'Compartir desactivado');
    },
    [refresh],
  );

  const copyLink = useCallback(async (item: DriveItem) => {
    const link = driveApi.getShareLink(item.id);
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Enlace copiado al portapapeles');
    } catch {
      toast.info(link);
    }
  }, []);

  const moveToTrash = useCallback(
    (item: DriveItem) => {
      driveApi.moveToTrash(item.id);
      refresh();
      toast.success(`"${item.name}" movido a la papelera`);
    },
    [refresh],
  );

  const openFilePreview = useCallback((item: DriveItem) => {
    driveApi.touchRecent(item.id);
  }, []);

  const applyAdvancedFilters = useCallback((filters: AdvancedSearchFilters) => {
    setAdvancedFilters(filters);
    if (filters.query) setSearchQuery(filters.query);
  }, [setSearchQuery]);

  const moveItem = useCallback(
    (itemId: string, targetFolderId: string | null) => {
      const result = driveApi.moveItem(itemId, targetFolderId);
      if (result.ok) {
        refresh();
        toast.success(result.message);
        return true;
      }
      toast.error(result.message);
      return false;
    },
    [refresh],
  );

  return {
    currentParentId,
    items,
    breadcrumbs,
    viewMode,
    searchQuery,
    advancedFilters,
    setViewMode,
    setSearchQuery,
    applyAdvancedFilters,
    openFolder,
    createFolder,
    createDocument,
    createSpreadsheet,
    uploadFile,
    rename,
    toggleStar,
    saveShareSettings,
    copyLink,
    moveToTrash,
    openFilePreview,
    moveItem,
    getShareLink: driveApi.getShareLink,
    refresh,
  };
};
