import type {
  Breadcrumb,
  CreateFolderInput,
  DriveItem,
  DriveItemVersion,
  PermissionLevel,
  ShareAccess,
  UploadFileInput,
} from '../types/drive.types';

/**
 * Capa de datos del Drive (mock de desarrollo).
 *
 * Persiste los ítems en `localStorage` replicando el contrato objetivo de
 * `svc-main`. Cuando exista backend real, este archivo se reemplaza por
 * llamadas vía `apiClient.ts` manteniendo las mismas firmas.
 */

const STORAGE_KEY = 'vault_drive_items';
const TRASH_RETENTION_DAYS = 30;

const nowIso = () => new Date().toISOString();

const createId = () =>
  `itm_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

const daysAgoIso = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
};

const readRaw = (): DriveItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DriveItem[]) : [];
  } catch {
    return [];
  }
};

const writeRaw = (items: DriveItem[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Cuota de almacenamiento excedida (p. ej. muchas vistas previas guardadas):
    // reintenta sin las vistas previas para no perder los datos del ítem.
    const withoutPreviews = items.map((item) => {
      const copy = { ...item };
      delete copy.previewDataUrl;
      return copy;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(withoutPreviews));
  }
};

const buildSeed = (): DriveItem[] => {
  const baseFolder = (id: string, name: string, parentId: string | null, daysAgo: number): DriveItem => ({
    id,
    name,
    kind: 'folder',
    parentId,
    size: 0,
    isStarred: false,
    isShared: false,
    isDeleted: false,
    createdAt: daysAgoIso(daysAgo),
    updatedAt: daysAgoIso(daysAgo),
  });

  const baseFile = (
    id: string,
    name: string,
    parentId: string | null,
    size: number,
    extension: string,
    daysAgo: number,
  ): DriveItem => ({
    id,
    name,
    kind: 'file',
    parentId,
    size,
    extension,
    isStarred: false,
    isShared: false,
    isDeleted: false,
    createdAt: daysAgoIso(daysAgo),
    updatedAt: daysAgoIso(daysAgo),
  });

  return [
    baseFolder('seed_docs', 'Documentos', null, 20),
    baseFolder('seed_img', 'Imágenes', null, 18),
    baseFolder('seed_proj', 'Proyecto Vault', 'seed_docs', 12),
    { ...baseFile('seed_cv', 'CV.pdf', null, 240_500, 'pdf', 1), isStarred: true, visitedAt: daysAgoIso(0) },
    { ...baseFile('seed_plan', 'Plan-2026.docx', null, 88_200, 'docx', 2), visitedAt: daysAgoIso(1) },
    baseFile('seed_budget', 'Presupuesto.xlsx', 'seed_docs', 51_300, 'xlsx', 4),
    { ...baseFile('seed_logo', 'logo.png', 'seed_img', 18_900, 'png', 6), isStarred: true },
    {
      ...baseFile('seed_shared_report', 'Informe-compartido.pdf', null, 320_000, 'pdf', 3),
      isShared: true,
      sharedBy: 'Ana García',
      permissionLevel: 'EDITOR' as PermissionLevel,
      visitedAt: daysAgoIso(3),
    },
    {
      ...baseFile('seed_old', 'Notas-antiguas.txt', null, 4_200, 'txt', 40),
      isDeleted: true,
      deletedAt: daysAgoIso(5),
      deletedBy: 'Tú',
      originalLocation: 'Mi Unidad',
    },
  ];
};

const ensureSeed = (): DriveItem[] => {
  const existing = readRaw();
  if (existing.length > 0) return existing;
  const seed = buildSeed();
  writeRaw(seed);
  return seed;
};

const collectDescendantIds = (items: DriveItem[], rootId: string): string[] => {
  const result: string[] = [rootId];
  const queue = [rootId];
  while (queue.length > 0) {
    const current = queue.shift() as string;
    items
      .filter((item) => item.parentId === current)
      .forEach((child) => {
        result.push(child.id);
        queue.push(child.id);
      });
  }
  return result;
};

const sortItems = (items: DriveItem[]): DriveItem[] =>
  [...items].sort((a, b) => {
    if (a.kind !== b.kind) return a.kind === 'folder' ? -1 : 1;
    return a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });
  });

export const driveApi = {
  listByParent(parentId: string | null): DriveItem[] {
    const items = ensureSeed();
    return sortItems(items.filter((item) => item.parentId === parentId && !item.isDeleted));
  },

  getItem(id: string): DriveItem | null {
    return ensureSeed().find((item) => item.id === id) ?? null;
  },

  getBreadcrumbs(parentId: string | null): Breadcrumb[] {
    const items = ensureSeed();
    const trail: Breadcrumb[] = [{ id: null, name: 'Mi Unidad' }];
    const path: Breadcrumb[] = [];
    let currentId = parentId;
    while (currentId) {
      const folder = items.find((item) => item.id === currentId);
      if (!folder) break;
      path.unshift({ id: folder.id, name: folder.name });
      currentId = folder.parentId;
    }
    return [...trail, ...path];
  },

  listMoveDestinations(movingItemId: string): Array<{ id: string | null; name: string; path: string }> {
    const items = ensureSeed();
    const descendants = new Set(collectDescendantIds(items, movingItemId));
    const folders = items.filter(
      (entry) =>
        entry.kind === 'folder' &&
        !entry.isDeleted &&
        entry.id !== movingItemId &&
        !descendants.has(entry.id),
    );

    const pathOf = (folderId: string): string =>
      this.getBreadcrumbs(folderId)
        .map((crumb) => crumb.name)
        .join(' / ');

    return [
      { id: null, name: 'Mi Unidad', path: 'Raíz de Mi Unidad' },
      ...folders
        .map((folder) => ({
          id: folder.id,
          name: folder.name,
          path: pathOf(folder.id),
        }))
        .sort((a, b) => a.path.localeCompare(b.path, 'es', { sensitivity: 'base' })),
    ];
  },

  createFolder({ name, parentId }: CreateFolderInput): DriveItem {
    const items = ensureSeed();
    const folder: DriveItem = {
      id: createId(),
      name: name.trim(),
      kind: 'folder',
      parentId,
      size: 0,
      isStarred: false,
      isShared: false,
      isDeleted: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    writeRaw([...items, folder]);
    return folder;
  },

  uploadFile({ name, parentId, size, extension, previewDataUrl }: UploadFileInput): DriveItem {
    const items = ensureSeed();
    const cleanName = name.trim();
    const resolvedExtension = extension ?? cleanName.split('.').pop()?.toLowerCase();
    const file: DriveItem = {
      id: createId(),
      name: cleanName,
      kind: 'file',
      parentId,
      size,
      extension: resolvedExtension,
      isStarred: false,
      isShared: false,
      isDeleted: false,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      visitedAt: nowIso(),
      previewDataUrl,
    };
    writeRaw([...items, file]);
    return file;
  },

  createDocument({ name, parentId }: CreateFolderInput): DriveItem {
    const docName = name.trim().endsWith('.docx') ? name.trim() : `${name.trim()}.docx`;
    return this.uploadFile({ name: docName, parentId, size: 12_400, extension: 'docx' });
  },

  createSpreadsheet({ name, parentId }: CreateFolderInput): DriveItem {
    const sheetName = name.trim().endsWith('.xlsx') ? name.trim() : `${name.trim()}.xlsx`;
    return this.uploadFile({ name: sheetName, parentId, size: 9_800, extension: 'xlsx' });
  },

  rename(id: string, name: string): void {
    const items = ensureSeed();
    writeRaw(
      items.map((item) =>
        item.id === id ? { ...item, name: name.trim(), updatedAt: nowIso() } : item,
      ),
    );
  },

  moveItem(id: string, targetParentId: string | null): { ok: boolean; message: string } {
    const items = ensureSeed();
    const item = items.find((entry) => entry.id === id);
    if (!item) return { ok: false, message: 'Elemento no encontrado' };
    if (item.id === targetParentId) return { ok: false, message: 'No se puede mover a sí mismo' };
    if (item.parentId === targetParentId) return { ok: false, message: 'El elemento ya está en esta ubicación' };
    if (targetParentId && collectDescendantIds(items, id).includes(targetParentId)) {
      return { ok: false, message: 'No se puede mover una carpeta dentro de sí misma' };
    }
    if (targetParentId) {
      const target = items.find((entry) => entry.id === targetParentId);
      if (!target || target.kind !== 'folder' || target.isDeleted) {
        return { ok: false, message: 'Destino no válido' };
      }
    }
    writeRaw(
      items.map((entry) =>
        entry.id === id ? { ...entry, parentId: targetParentId, updatedAt: nowIso() } : entry,
      ),
    );
    const targetName = targetParentId
      ? items.find((entry) => entry.id === targetParentId)?.name ?? 'carpeta'
      : 'Mi Unidad';
    return { ok: true, message: `Movido a "${targetName}"` };
  },

  toggleStar(id: string): void {
    const items = ensureSeed();
    writeRaw(
      items.map((item) => (item.id === id ? { ...item, isStarred: !item.isStarred } : item)),
    );
  },

  toggleShare(id: string): void {
    const items = ensureSeed();
    writeRaw(
      items.map((item) => (item.id === id ? { ...item, isShared: !item.isShared } : item)),
    );
  },

  updateShareSettings(
    id: string,
    settings: {
      isShared?: boolean;
      shareAccess?: ShareAccess;
      permissionLevel?: PermissionLevel;
    },
  ): void {
    const items = ensureSeed();
    writeRaw(
      items.map((item) => {
        if (item.id !== id) return item;
        const shareLink = settings.isShared !== false
          ? item.shareLink ?? `https://vault.app/s/${item.id.slice(-8)}`
          : undefined;
        return {
          ...item,
          isShared: settings.isShared ?? item.isShared,
          shareAccess: settings.shareAccess ?? item.shareAccess ?? 'restricted',
          permissionLevel: settings.permissionLevel ?? item.permissionLevel ?? 'VIEWER',
          shareLink,
        };
      }),
    );
  },

  getShareLink(id: string): string {
    const item = this.getItem(id);
    if (!item) return '';
    if (item.shareLink) return item.shareLink;
    return `https://vault.app/s/${id.slice(-8)}`;
  },

  listVersionHistory(id: string): DriveItemVersion[] {
    const item = this.getItem(id);
    if (!item) return [];

    const modifiedBy = item.isShared ? item.sharedBy ?? 'Colaborador' : 'Tú';
    const current: DriveItemVersion = {
      id: `${item.id}_v_current`,
      versionLabel: 'Versión actual',
      updatedAt: item.updatedAt,
      modifiedBy,
      size: item.size,
      isCurrent: true,
    };

    if (item.kind === 'folder') return [current];

    const dayMs = 24 * 60 * 60 * 1000;
    const older = [1, 2].map((stepsAgo) => ({
      id: `${item.id}_v_${stepsAgo}`,
      versionLabel: `Versión anterior ${stepsAgo}`,
      updatedAt: new Date(new Date(item.updatedAt).getTime() - stepsAgo * 3 * dayMs).toISOString(),
      modifiedBy,
      size: Math.max(1024, Math.round(item.size * (1 - stepsAgo * 0.12))),
      isCurrent: false,
    }));

    return [current, ...older];
  },

  restoreVersion(id: string): void {
    const items = ensureSeed();
    writeRaw(
      items.map((item) => (item.id === id ? { ...item, updatedAt: nowIso() } : item)),
    );
  },

  getItemLocationLabel(item: DriveItem): string {
    if (!item.parentId) return 'Mi Unidad';
    const crumbs = this.getBreadcrumbs(item.parentId);
    return crumbs.map((crumb) => crumb.name).join(' / ');
  },

  touchRecent(id: string): void {
    const items = ensureSeed();
    writeRaw(
      items.map((item) => (item.id === id ? { ...item, visitedAt: nowIso() } : item)),
    );
  },

  moveToTrash(id: string, deletedBy = 'Tú'): void {
    const items = ensureSeed();
    const target = items.find((item) => item.id === id);
    const location = target ? this.getItemLocationLabel(target) : 'Mi Unidad';
    const affected = new Set(collectDescendantIds(items, id));
    const deletedAt = nowIso();
    writeRaw(
      items.map((item) =>
        affected.has(item.id)
          ? {
              ...item,
              isDeleted: true,
              deletedAt,
              deletedBy: item.id === id ? deletedBy : item.deletedBy,
              originalLocation: item.id === id ? location : item.originalLocation,
            }
          : item,
      ),
    );
  },

  restore(id: string): void {
    const items = ensureSeed();
    const affected = new Set(collectDescendantIds(items, id));
    writeRaw(
      items.map((item) =>
        affected.has(item.id)
          ? {
              ...item,
              isDeleted: false,
              deletedAt: undefined,
              deletedBy: undefined,
              originalLocation: undefined,
            }
          : item,
      ),
    );
  },

  deletePermanent(id: string): void {
    const items = ensureSeed();
    const affected = new Set(collectDescendantIds(items, id));
    writeRaw(items.filter((item) => !affected.has(item.id)));
  },

  emptyTrash(): void {
    const items = ensureSeed();
    writeRaw(items.filter((item) => !item.isDeleted));
  },

  listStarred(): DriveItem[] {
    return sortItems(ensureSeed().filter((item) => item.isStarred && !item.isDeleted));
  },

  listShared(): DriveItem[] {
    return sortItems(ensureSeed().filter((item) => item.isShared && !item.isDeleted));
  },

  listTrash(): DriveItem[] {
    return ensureSeed()
      .filter((item) => item.isDeleted)
      .sort((a, b) => (b.deletedAt ?? '').localeCompare(a.deletedAt ?? ''));
  },

  listRecents(): DriveItem[] {
    return ensureSeed()
      .filter((item) => item.kind === 'file' && !item.isDeleted && item.visitedAt)
      .sort((a, b) => (b.visitedAt ?? '').localeCompare(a.visitedAt ?? ''));
  },

  getTrashRetentionDays(): number {
    return TRASH_RETENTION_DAYS;
  },

  getUsedBytes(): number {
    return ensureSeed()
      .filter((item) => item.kind === 'file' && !item.isDeleted)
      .reduce((total, item) => total + (item.size || 0), 0);
  },
};
