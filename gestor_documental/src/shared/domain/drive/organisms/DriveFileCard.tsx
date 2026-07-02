import { Share2, Star } from 'lucide-react';
import { VaultCard } from '@shared/components/atoms/VaultCard';
import { formatBytes, formatDate } from '../utils/driveItemUtils';
import { DriveItemIcon } from '../atoms/DriveItemIcon';
import type { DriveItem } from '../types/drive.types';

type DriveFileCardProps = {
  item: DriveItem;
  onOpen?: (item: DriveItem) => void;
  onToggleStar?: (item: DriveItem) => void;
  showSharedIcon?: boolean;
  footerLeft?: string;
  footerRight?: string;
};

/** Tarjeta de archivo/carpeta estilo Figma VAULT (Destacados, Recientes). */
export const DriveFileCard = ({
  item,
  onOpen,
  onToggleStar,
  showSharedIcon = false,
  footerLeft,
  footerRight,
}: DriveFileCardProps) => {
  const leftMeta = footerLeft ?? (item.kind === 'folder' ? 'Carpeta' : formatBytes(item.size));
  const rightMeta = footerRight ?? formatDate(item.updatedAt);

  return (
    <VaultCard
      interactive
      padding="p-4"
      className="flex h-full w-full flex-col gap-4 text-left"
      onClick={() => onOpen?.(item)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2.5">
          <DriveItemIcon kind={item.kind} extension={item.extension} size="md" />
          <p className="truncate text-sm font-semibold text-[var(--text-primary)]" title={item.name}>
            {item.name}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          {showSharedIcon && item.isShared ? (
            <Share2 className="h-3.5 w-3.5 text-[var(--text-secondary)]" aria-label="Compartido" />
          ) : null}
          {onToggleStar ? (
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onToggleStar(item);
              }}
              className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-[var(--bg-surface)]"
              aria-label={item.isStarred ? 'Quitar destacado' : 'Destacar'}
            >
              <Star
                className="h-4 w-4"
                fill={item.isStarred ? 'currentColor' : 'none'}
                style={{ color: item.isStarred ? 'var(--warning-600)' : 'var(--text-secondary)' }}
              />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 text-xs text-[var(--text-secondary)]">
        <span className="truncate">{leftMeta}</span>
        <span className="shrink-0">{rightMeta}</span>
      </div>
    </VaultCard>
  );
};
