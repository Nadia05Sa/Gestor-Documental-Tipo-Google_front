import { useEffect, useState } from 'react';
import { Link2, User } from 'lucide-react';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { Select } from '@shared/components/inputs/Select';
import { VaultModal } from '@shared/components/VaultModal';
import { toast } from '@shared/components/Toast';
import { PERMISSION_LABELS, type DriveItem, type PermissionLevel, type ShareAccess } from '../types/drive.types';

type ShareModalProps = {
  item: DriveItem | null;
  onClose: () => void;
  onSave: (itemId: string, settings: {
    isShared: boolean;
    shareAccess: ShareAccess;
    permissionLevel: PermissionLevel;
  }) => void;
  getShareLink: (itemId: string) => string;
};

const ACCESS_OPTIONS = [
  { value: 'restricted', label: 'Solo personas con acceso' },
  { value: 'anyone', label: 'Cualquier persona con el enlace' },
];

const PERMISSION_OPTIONS = [
  { value: 'EDITOR', label: PERMISSION_LABELS.EDITOR },
  { value: 'COMMENTER', label: PERMISSION_LABELS.COMMENTER },
  { value: 'VIEWER', label: PERMISSION_LABELS.VIEWER },
];

export const ShareModal = ({ item, onClose, onSave, getShareLink }: ShareModalProps) => {
  const [shareAccess, setShareAccess] = useState<ShareAccess>('restricted');
  const [permissionLevel, setPermissionLevel] = useState<PermissionLevel>('VIEWER');
  const [isShared, setIsShared] = useState(false);

  useEffect(() => {
    if (!item) return;
    setShareAccess(item.shareAccess ?? 'restricted');
    setPermissionLevel(item.permissionLevel ?? 'VIEWER');
    setIsShared(item.isShared);
  }, [item]);

  if (!item) return null;

  const handleCopyLink = async () => {
    const link = getShareLink(item.id);
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Enlace copiado al portapapeles');
    } catch {
      toast.info(link);
    }
  };

  return (
    <VaultModal
      open={Boolean(item)}
      onClose={onClose}
      title="Compartir"
      description={item.name}
      size="md"
      footer={(
        <>
          <ActionButton label="Cancelar" variant="ghost" fullWidth={false} onClick={onClose} />
          <ActionButton
            label="Guardar"
            variant="primary"
            fullWidth={false}
            onClick={() => {
              onSave(item.id, { isShared, shareAccess, permissionLevel });
              onClose();
            }}
          />
        </>
      )}
    >
      <div className="space-y-5">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">Personas con acceso</h3>
          <div className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2.5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                <User className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-medium text-[var(--text-primary)]">Tú</p>
                <p className="text-xs text-[var(--text-secondary)]">Propietario</p>
              </div>
            </div>
          </div>
          <div className="mt-3">
            <Select
              label="Permiso predeterminado"
              value={permissionLevel}
              options={PERMISSION_OPTIONS}
              showPlaceholderOption={false}
              reserveHelperSpace={false}
              onChange={(event) => setPermissionLevel(event.target.value as PermissionLevel)}
            />
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-[var(--text-primary)]">Acceso con enlace</h3>
          <Select
            label="Quién puede acceder"
            value={shareAccess}
            options={ACCESS_OPTIONS}
            showPlaceholderOption={false}
            reserveHelperSpace={false}
            onChange={(event) => {
              const value = event.target.value as ShareAccess;
              setShareAccess(value);
              setIsShared(true);
            }}
          />
          <div className="mt-3">
            <ActionButton
              icon={Link2}
              label="Obtener enlace"
              variant="secondary"
              size="small"
              fullWidth
              onClick={handleCopyLink}
            />
          </div>
        </section>
      </div>
    </VaultModal>
  );
};
