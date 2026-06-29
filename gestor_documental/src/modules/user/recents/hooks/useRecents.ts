import { useCallback, useMemo } from 'react';
import { getRecentGroup, formatRelativeTime } from '@shared/components/drive/driveItemUtils';
import type { RecentGroup } from '@shared/components/drive/driveItemUtils';
import { recentsApi } from '../api/recentsApi';
import { useDriveItemCollection } from '../../drive/hooks/useDriveItemCollection';
import type { DriveItem } from '../../drive/types/drive.types';

export type RecentSection = {
  group: RecentGroup;
  items: DriveItem[];
};

const GROUP_ORDER: RecentGroup[] = ['Hoy', 'Ayer', 'Esta semana', 'Antes'];

export const useRecents = () => {
  const collection = useDriveItemCollection({
    api: recentsApi,
    getToggleStarMessage: (item) =>
      item.isStarred ? 'Eliminado de destacados' : 'Añadido a destacados',
  });

  const sections = useMemo<RecentSection[]>(() =>
    GROUP_ORDER.map((group) => ({
      group,
      items: collection.items.filter((item) => getRecentGroup(item.visitedAt) === group),
    })).filter((section) => section.items.length > 0),
  [collection.items]);

  const hasItems = sections.length > 0;

  const getRelativeLabel = useCallback((item: DriveItem) => formatRelativeTime(item.visitedAt), []);

  return {
    ...collection,
    sections,
    hasItems,
    getRelativeLabel,
  };
};
