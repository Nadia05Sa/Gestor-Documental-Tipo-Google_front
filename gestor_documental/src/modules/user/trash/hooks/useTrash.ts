import { useCallback, useMemo, useState } from 'react';
import { toast } from '@shared/components/organisms/Toast';
import { trashApi } from '../api/trashApi';
import type { DriveItem } from '../../drive/types/drive.types';

export const useTrash = () => {
  const [version, setVersion] = useState(0);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const items = useMemo<DriveItem[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => trashApi.list(),
    [version],
  );

  const retentionDays = trashApi.retentionDays();

  const refresh = useCallback(() => {
    setVersion((value) => value + 1);
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => setSelectedIds(new Set()), []);

  const restore = useCallback(
    (ids: string[]) => {
      ids.forEach((id) => trashApi.restore(id));
      refresh();
      toast.success(ids.length > 1 ? `${ids.length} archivos restaurados` : 'Archivo restaurado');
    },
    [refresh],
  );

  const deletePermanent = useCallback(
    (ids: string[]) => {
      ids.forEach((id) => trashApi.deletePermanent(id));
      refresh();
      toast.success(ids.length > 1 ? `${ids.length} archivos eliminados permanentemente` : 'Archivo eliminado permanentemente');
    },
    [refresh],
  );

  const emptyTrash = useCallback(() => {
    trashApi.emptyTrash();
    refresh();
    toast.success('Papelera vaciada');
  }, [refresh]);

  return {
    items,
    selectedIds,
    retentionDays,
    toggleSelect,
    clearSelection,
    restore,
    deletePermanent,
    emptyTrash,
  };
};
