import { useEffect, useMemo, useState } from 'react';
import { Check, Folder, HardDrive, Search } from 'lucide-react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { InputText } from '@shared/components/atoms/InputText';
import { AuthGradientButton } from '@shared/components/molecules/AuthGradientButton';
import { VaultModal } from '@shared/components/molecules/VaultModal';
import { toast } from '@shared/components/organisms/Toast';
import { driveApi } from '../../../../modules/user/drive/api/driveApi';
import type { DriveItem } from '../types/drive.types';

type MoveItemModalProps = {
  item: DriveItem | null;
  onClose: () => void;
  onMoved?: () => void;
};

export const MoveItemModal = ({ item, onClose, onMoved }: MoveItemModalProps) => {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!item) return;
    setQuery('');
    setSelectedId(item.parentId);
  }, [item]);

  const destinations = useMemo(
    () => (item ? driveApi.listMoveDestinations(item.id) : []),
    [item],
  );

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return destinations;
    return destinations.filter(
      (dest) =>
        dest.name.toLowerCase().includes(term) ||
        dest.path.toLowerCase().includes(term),
    );
  }, [destinations, query]);

  if (!item) return null;

  const isCurrentLocation = selectedId === item.parentId;
  const canMove = !isCurrentLocation;

  const handleMove = () => {
    const result = driveApi.moveItem(item.id, selectedId);
    if (result.ok) {
      toast.success(result.message);
      onMoved?.();
      onClose();
      return;
    }
    toast.error(result.message);
  };

  return (
    <VaultModal
      open={Boolean(item)}
      onClose={onClose}
      title="Mover a..."
      description={item.name}
      size="md"
      footer={(
        <>
          <ActionButton label="Cancelar" variant="ghost" fullWidth={false} onClick={onClose} />
          <AuthGradientButton
            label="Mover aquí"
            size="small"
            fullWidth={false}
            className="!w-auto min-w-[8rem] px-5"
            disabled={!canMove}
            onClick={handleMove}
          />
        </>
      )}
    >
      <div className="space-y-4">
        <InputText
          label="Buscar carpeta"
          value={query}
          placeholder="Escribe para filtrar..."
          onChange={(event) => setQuery(event.target.value)}
          icon={Search}
        />

        <div
          className="max-h-72 overflow-y-auto rounded-xl border"
          style={{ borderColor: 'var(--border-subtle)' }}
          role="listbox"
          aria-label="Destinos disponibles"
        >
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-[var(--text-secondary)]">
              No hay carpetas que coincidan con tu búsqueda.
            </p>
          ) : (
            filtered.map((dest) => {
              const isSelected = selectedId === dest.id;
              const isCurrent = dest.id === item.parentId;
              const Icon = dest.id === null ? HardDrive : Folder;

              return (
                <button
                  key={dest.id ?? 'root'}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  className={`flex w-full items-center gap-3 border-b px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-[var(--bg-surface)] ${
                    isSelected ? 'bg-[var(--bg-surface)]' : ''
                  }`}
                  style={{ borderColor: 'var(--border-subtle)' }}
                  onClick={() => setSelectedId(dest.id)}
                >
                  <span
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{
                      backgroundColor: isSelected ? 'var(--accent-soft, #eff6ff)' : 'var(--bg-surface)',
                      color: 'var(--accent)',
                    }}
                  >
                    <Icon className="h-4 w-4" />
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-[var(--text-primary)]">
                      {dest.name}
                    </span>
                    <span className="block truncate text-xs text-[var(--text-secondary)]">
                      {dest.path}
                      {isCurrent ? ' · Ubicación actual' : ''}
                    </span>
                  </span>

                  {isSelected ? (
                    <Check className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden />
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>
    </VaultModal>
  );
};
