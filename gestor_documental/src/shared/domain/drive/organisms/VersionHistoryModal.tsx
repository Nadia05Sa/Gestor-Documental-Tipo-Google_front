import { History, RotateCcw } from 'lucide-react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { VaultBadge } from '@shared/components/atoms/VaultBadge';
import { VaultModal } from '@shared/components/molecules/VaultModal';
import { formatBytes, formatDate } from '../utils/driveItemUtils';
import type { DriveItem, DriveItemVersion } from '../types/drive.types';

type VersionHistoryModalProps = {
  item: DriveItem | null;
  onClose: () => void;
  getVersions: (itemId: string) => DriveItemVersion[];
  onRestore?: (item: DriveItem, version: DriveItemVersion) => void;
};

/** Modal de historial de versiones para archivos del Drive. */
export const VersionHistoryModal = ({ item, onClose, getVersions, onRestore }: VersionHistoryModalProps) => {
  if (!item) return null;

  const versions = getVersions(item.id);

  return (
    <VaultModal
      open={Boolean(item)}
      onClose={onClose}
      title="Historial de versiones"
      description={item.name}
      size="md"
      footer={<ActionButton label="Cerrar" variant="secondary" fullWidth={false} onClick={onClose} />}
    >
      <ul className="space-y-3">
        {versions.map((version) => (
          <li
            key={version.id}
            className="flex items-center justify-between gap-3 rounded-lg border border-[var(--border-subtle)] px-3 py-2.5"
          >
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent-subtle)] text-[var(--accent)]">
                <History className="h-4 w-4" />
              </span>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[var(--text-primary)]">{version.versionLabel}</p>
                  {version.isCurrent ? <VaultBadge tone="success">Actual</VaultBadge> : null}
                </div>
                <p className="text-xs text-[var(--text-secondary)]">
                  {formatDate(version.updatedAt)} · {formatBytes(version.size)} · {version.modifiedBy}
                </p>
              </div>
            </div>

            {!version.isCurrent && onRestore ? (
              <ActionButton
                icon={RotateCcw}
                label="Restaurar"
                variant="secondary"
                size="small"
                fullWidth={false}
                onClick={() => onRestore(item, version)}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </VaultModal>
  );
};
