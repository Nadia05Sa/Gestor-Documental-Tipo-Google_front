import type { DriveItem } from '../types/drive.types';
import { DriveFileCard } from './DriveFileCard';
import { useDriveItemDragDrop } from '../hooks/useDriveItemDragDrop';

type DriveItemsGridProps = {
  items: DriveItem[];
  onOpenItem: (item: DriveItem) => void;
  onToggleStar?: (item: DriveItem) => void;
  showSharedIcon?: boolean;
  getFooterRight?: (item: DriveItem) => string;
  movable?: boolean;
  onMoveItem?: (itemId: string, targetFolderId: string | null) => void;
};

/** Cuadrícula unificada de tarjetas VAULT. */
export const DriveItemsGrid = ({
  items,
  onOpenItem,
  onToggleStar,
  showSharedIcon = false,
  getFooterRight,
  movable = false,
  onMoveItem,
}: DriveItemsGridProps) => {
  const { getItemDragProps } = useDriveItemDragDrop({ movable, onMoveItem });

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
      {items.map((item) => {
        const dragProps = movable ? getItemDragProps(item) : { className: '' };
        const { className: dropClassName, ...restDragProps } = dragProps;

        return (
          <div key={item.id} className={dropClassName} {...restDragProps}>
            <DriveFileCard
              item={item}
              onOpen={onOpenItem}
              onToggleStar={onToggleStar}
              showSharedIcon={showSharedIcon}
              footerRight={getFooterRight?.(item)}
            />
          </div>
        );
      })}
    </div>
  );
};
