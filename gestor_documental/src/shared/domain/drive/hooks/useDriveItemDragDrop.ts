import { useState, type DragEvent } from 'react';
import type { DriveItem } from '../../../modules/user/drive/types/drive.types';

const DRAG_MIME = 'application/x-vault-item-id';

type UseDriveItemDragDropOptions = {
  movable: boolean;
  onMoveItem?: (itemId: string, targetFolderId: string | null) => void;
};

/** Estado y handlers de arrastrar/soltar ítems sobre carpetas en vista cuadrícula. */
export const useDriveItemDragDrop = ({ movable, onMoveItem }: UseDriveItemDragDropOptions) => {
  const [dragOverFolderId, setDragOverFolderId] = useState<string | null>(null);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const readDraggedId = (event: DragEvent) =>
    event.dataTransfer.getData(DRAG_MIME) || draggedItemId || '';

  const handleDragEnd = () => {
    setDraggedItemId(null);
    setDragOverFolderId(null);
  };

  const handleDragStart = (event: DragEvent, item: DriveItem) => {
    if (!movable) return;
    event.dataTransfer.setData(DRAG_MIME, item.id);
    event.dataTransfer.effectAllowed = 'move';
    setDraggedItemId(item.id);
  };

  const handleFolderDragOver = (event: DragEvent, folder: DriveItem) => {
    if (!movable || !onMoveItem) return;
    const draggedId = readDraggedId(event);
    if (!draggedId || draggedId === folder.id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setDragOverFolderId(folder.id);
  };

  const handleFolderDrop = (event: DragEvent, folder: DriveItem) => {
    if (!movable || !onMoveItem) return;
    event.preventDefault();
    event.stopPropagation();
    const draggedId = readDraggedId(event);
    handleDragEnd();
    if (draggedId && draggedId !== folder.id) {
      onMoveItem(draggedId, folder.id);
    }
  };

  const folderDropClass = (folderId: string) =>
    dragOverFolderId === folderId ? 'ring-2 ring-[var(--accent)] bg-[var(--accent-subtle)] rounded-2xl' : '';

  const getItemDragProps = (item: DriveItem) => ({
    draggable: movable,
    onDragStart: (event: DragEvent) => handleDragStart(event, item),
    onDragEnd: handleDragEnd,
    onDragOver: item.kind === 'folder' ? (event: DragEvent) => handleFolderDragOver(event, item) : undefined,
    onDragLeave: item.kind === 'folder' ? () => setDragOverFolderId(null) : undefined,
    onDrop: item.kind === 'folder' ? (event: DragEvent) => handleFolderDrop(event, item) : undefined,
    className: item.kind === 'folder' ? folderDropClass(item.id) : '',
  });

  return { getItemDragProps };
};
