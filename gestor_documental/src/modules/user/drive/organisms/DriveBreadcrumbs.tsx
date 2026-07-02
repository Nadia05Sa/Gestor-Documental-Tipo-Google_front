import { Fragment, useState, type DragEvent } from 'react';
import { ChevronRight } from 'lucide-react';
import type { Breadcrumb } from '../types/drive.types';

const DRAG_MIME = 'application/x-vault-item-id';

type DriveBreadcrumbsProps = {
  breadcrumbs: Breadcrumb[];
  onNavigate: (id: string | null) => void;
  movable?: boolean;
  onMoveItem?: (itemId: string, targetFolderId: string | null) => void;
};

export const DriveBreadcrumbs = ({
  breadcrumbs,
  onNavigate,
  movable = false,
  onMoveItem,
}: DriveBreadcrumbsProps) => {
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragOver = (event: DragEvent, folderId: string | null) => {
    if (!movable || !onMoveItem) return;
    if (!event.dataTransfer.types.includes(DRAG_MIME)) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverId(folderId ?? 'root');
  };

  const handleDrop = (event: DragEvent, folderId: string | null) => {
    if (!movable || !onMoveItem) return;
    event.preventDefault();
    const draggedId = event.dataTransfer.getData(DRAG_MIME);
    setDragOverId(null);
    if (draggedId) onMoveItem(draggedId, folderId);
  };

  return (
    <nav className="flex flex-wrap items-center gap-1 text-sm" aria-label="Ruta de navegación">
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        const isDropTarget = movable && !isLast;
        const dropActive = dragOverId === (crumb.id ?? 'root');

        return (
          <Fragment key={crumb.id ?? 'root'}>
            {index > 0 ? (
              <ChevronRight className="h-4 w-4 text-[var(--text-secondary)]" />
            ) : null}
            <button
              type="button"
              onClick={() => !isLast && onNavigate(crumb.id)}
              disabled={isLast}
              onDragOver={isDropTarget ? (event) => handleDragOver(event, crumb.id) : undefined}
              onDragLeave={isDropTarget ? () => setDragOverId(null) : undefined}
              onDrop={isDropTarget ? (event) => handleDrop(event, crumb.id) : undefined}
              className={`rounded px-1.5 py-0.5 transition-colors disabled:cursor-default ${
                dropActive ? 'bg-[var(--accent-subtle)] ring-2 ring-[var(--accent)]' : ''
              }`}
              style={{
                color: isLast ? 'var(--text-primary, #111827)' : 'var(--text-secondary, #6b7280)',
                fontWeight: isLast ? 600 : 400,
              }}
              title={isDropTarget ? 'Mover aquí' : undefined}
            >
              {crumb.name}
            </button>
          </Fragment>
        );
      })}
    </nav>
  );
};
