import { driveApi } from '../../../modules/user/drive/api/driveApi';
import { formatGigabytes } from '@shared/components/drive/driveItemUtils';

const DEFAULT_PLAN_BYTES = 100 * 1024 ** 3;

export const SidebarStorageFooter = () => {
  const usedBytes = driveApi.getUsedBytes();
  const usagePercent = Math.min(100, Math.round((usedBytes / DEFAULT_PLAN_BYTES) * 100));

  return (
    <div className="mx-3 mb-4 rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-3">
      <p className="text-xs font-semibold text-[var(--text-primary)]">
        {formatGigabytes(usedBytes)} de {formatGigabytes(DEFAULT_PLAN_BYTES)}
      </p>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[var(--border-subtle)]">
        <div
          className="h-full rounded-full"
          style={{
            width: `${usagePercent}%`,
            background: 'var(--gradient-primary)',
          }}
        />
      </div>
      <p className="mt-1.5 text-[11px] text-[var(--text-secondary)]">{usagePercent}% usado</p>
    </div>
  );
};
