import {
  File,
  FileArchive,
  FileAudio,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
  Folder,
  Presentation,
} from 'lucide-react';
import type { ComponentType, CSSProperties } from 'react';

type IconComponent = ComponentType<{ className?: string; size?: number; style?: CSSProperties }>;

export type DriveFileCategory =
  | 'folder'
  | 'pdf'
  | 'document'
  | 'spreadsheet'
  | 'image'
  | 'presentation'
  | 'video'
  | 'audio'
  | 'archive'
  | 'file';

export type DriveItemIconMeta = {
  category: DriveFileCategory;
  icon: IconComponent;
  color: string;
  backgroundColor: string;
  label: string;
};

const EXTENSION_CATEGORY: Record<string, DriveFileCategory> = {
  pdf: 'pdf',
  doc: 'document',
  docx: 'document',
  txt: 'document',
  rtf: 'document',
  md: 'document',
  odt: 'document',
  xls: 'spreadsheet',
  xlsx: 'spreadsheet',
  csv: 'spreadsheet',
  ods: 'spreadsheet',
  ppt: 'presentation',
  pptx: 'presentation',
  odp: 'presentation',
  png: 'image',
  jpg: 'image',
  jpeg: 'image',
  gif: 'image',
  webp: 'image',
  svg: 'image',
  bmp: 'image',
  heic: 'image',
  mp4: 'video',
  mov: 'video',
  avi: 'video',
  webm: 'video',
  mkv: 'video',
  mp3: 'audio',
  wav: 'audio',
  flac: 'audio',
  aac: 'audio',
  ogg: 'audio',
  zip: 'archive',
  rar: 'archive',
  '7z': 'archive',
  tar: 'archive',
  gz: 'archive',
};

const CATEGORY_META: Record<DriveFileCategory, Omit<DriveItemIconMeta, 'category'>> = {
  folder: {
    icon: Folder,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-subtle)',
    label: 'Carpeta',
  },
  pdf: {
    icon: File,
    color: 'var(--danger-600)',
    backgroundColor: 'var(--error-subtle)',
    label: 'PDF',
  },
  document: {
    icon: FileText,
    color: 'var(--accent)',
    backgroundColor: 'var(--accent-subtle)',
    label: 'Documento',
  },
  spreadsheet: {
    icon: FileSpreadsheet,
    color: 'var(--success-600)',
    backgroundColor: '#ecfdf5',
    label: 'Hoja de cálculo',
  },
  image: {
    icon: FileImage,
    color: 'var(--brand-purple)',
    backgroundColor: '#f3e8ff',
    label: 'Imagen',
  },
  presentation: {
    icon: Presentation,
    color: 'var(--warning-600)',
    backgroundColor: '#fffbeb',
    label: 'Presentación',
  },
  video: {
    icon: FileVideo,
    color: '#7c3aed',
    backgroundColor: '#ede9fe',
    label: 'Video',
  },
  audio: {
    icon: FileAudio,
    color: '#0891b2',
    backgroundColor: '#ecfeff',
    label: 'Audio',
  },
  archive: {
    icon: FileArchive,
    color: 'var(--warning-600)',
    backgroundColor: '#fffbeb',
    label: 'Comprimido',
  },
  file: {
    icon: File,
    color: 'var(--text-secondary)',
    backgroundColor: 'var(--bg-surface)',
    label: 'Archivo',
  },
};

/**
 * Resuelve la categoría visual de un ítem según su tipo/extensión.
 */
export const resolveDriveFileCategory = (
  kind: 'folder' | 'file',
  extension?: string,
): DriveFileCategory => {
  if (kind === 'folder') return 'folder';
  const key = (extension ?? '').toLowerCase();
  return EXTENSION_CATEGORY[key] ?? 'file';
};

/**
 * Metadatos de icono y color por categoría (PDF, Word, Excel, imagen, etc.).
 */
export const getDriveItemIconMeta = (
  kind: 'folder' | 'file',
  extension?: string,
): DriveItemIconMeta => {
  const category = resolveDriveFileCategory(kind, extension);
  return { category, ...CATEGORY_META[category] };
};

/**
 * Devuelve el icono adecuado para un ítem del Drive según su tipo/extensión.
 */
export const getDriveItemIcon = (kind: 'folder' | 'file', extension?: string): IconComponent =>
  getDriveItemIconMeta(kind, extension).icon;

/**
 * Etiqueta legible del tipo de archivo (p. ej. "PDF", "Hoja de cálculo").
 */
export const getDriveItemTypeLabel = (kind: 'folder' | 'file', extension?: string): string =>
  getDriveItemIconMeta(kind, extension).label;

/**
 * Formatea un tamaño en bytes a una cadena legible (KB, MB, GB).
 */
export const formatBytes = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(value >= 10 || exponent === 0 ? 0 : 1)} ${units[exponent]}`;
};

/**
 * Formatea una fecha ISO a una cadena corta en español.
 */
export const formatDate = (iso?: string): string => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('es-419', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

const startOfDay = (date: Date): number => {
  const copy = new Date(date);
  copy.setHours(0, 0, 0, 0);
  return copy.getTime();
};

export type RecentGroup = 'Hoy' | 'Ayer' | 'Esta semana' | 'Antes';

/**
 * Formatea bytes como GB con un decimal (p. ej. para facturación).
 */
export const formatGigabytes = (bytes: number): string => {
  if (!bytes || bytes <= 0) return '0 GB';
  return `${(bytes / 1024 ** 3).toFixed(1)} GB`;
};

/**
 * Tiempo relativo en español (p. ej. "hace 2 min", "hace 3 días").
 */
export const formatRelativeTime = (iso?: string): string => {
  if (!iso) return '—';
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 0) return 'ahora';
  const minutes = Math.floor(diffMs / 60_000);
  if (minutes < 1) return 'hace un momento';
  if (minutes < 60) return `hace ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `hace ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'hace 1 día';
  if (days < 7) return `hace ${days} días`;
  return formatDate(iso);
};

/**
 * Clasifica una fecha ISO en uno de los grupos de la vista Recientes.
 */
export const getRecentGroup = (iso?: string): RecentGroup => {
  if (!iso) return 'Antes';
  const today = startOfDay(new Date());
  const target = startOfDay(new Date(iso));
  const dayMs = 24 * 60 * 60 * 1000;
  const diffDays = Math.round((today - target) / dayMs);
  if (diffDays <= 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays <= 7) return 'Esta semana';
  return 'Antes';
};

/**
 * Días restantes antes de eliminación permanente desde la papelera.
 */
export const getDaysUntilPermanentDelete = (deletedAt?: string, retentionDays = 30): number => {
  if (!deletedAt) return retentionDays;
  const expiresAt = new Date(deletedAt).getTime() + retentionDays * 24 * 60 * 60 * 1000;
  return Math.max(0, Math.ceil((expiresAt - Date.now()) / (24 * 60 * 60 * 1000)));
};
