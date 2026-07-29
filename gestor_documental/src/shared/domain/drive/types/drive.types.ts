export type ItemKind = 'folder' | 'file';

export type ViewMode = 'grid' | 'list';

export type PermissionLevel = 'VIEWER' | 'COMMENTER' | 'EDITOR';

export type ShareAccess = 'restricted' | 'anyone';

/**
 * Representa un archivo o carpeta del Drive del usuario.
 * Es el modelo central compartido por Drive, Favoritos, Recientes,
 * Compartidos y Papelera. El backend objetivo es `svc-main` (tabla `drive_items`).
 */
export type DriveItem = {
  id: string;
  name: string;
  kind: ItemKind;
  parentId: string | null;
  size: number;
  extension?: string;
  mimeType?: string;
  isStarred: boolean;
  isShared: boolean;
  sharedBy?: string;
  permissionLevel?: PermissionLevel;
  shareAccess?: ShareAccess;
  shareLink?: string;
  tags?: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  visitedAt?: string;
  deletedAt?: string;
  deletedBy?: string;
  originalLocation?: string;
  /** Data URL con el contenido real de la imagen (solo para archivos subidos por el usuario). */
  previewDataUrl?: string;
};

export type Breadcrumb = {
  id: string | null;
  name: string;
};

/** Entrada del historial de versiones de un archivo. */
export type DriveItemVersion = {
  id: string;
  versionLabel: string;
  updatedAt: string;
  modifiedBy: string;
  size: number;
  isCurrent: boolean;
};

export type CreateFolderInput = {
  name: string;
  parentId: string | null;
};

export type UploadFileInput = {
  name: string;
  parentId: string | null;
  size: number;
  extension?: string;
  previewDataUrl?: string;
};

export type AdvancedSearchFilters = {
  query: string;
  fileType: string;
  minSizeMb: string;
  maxSizeMb: string;
  dateFrom: string;
  dateTo: string;
  tags: string;
  sharedOnly: boolean;
  starredOnly: boolean;
};

export const PERMISSION_LABELS: Record<PermissionLevel, string> = {
  VIEWER: 'Solo ver',
  COMMENTER: 'Puede comentar',
  EDITOR: 'Puede editar',
};

export const EMPTY_ADVANCED_FILTERS: AdvancedSearchFilters = {
  query: '',
  fileType: '',
  minSizeMb: '',
  maxSizeMb: '',
  dateFrom: '',
  dateTo: '',
  tags: '',
  sharedOnly: false,
  starredOnly: false,
};
