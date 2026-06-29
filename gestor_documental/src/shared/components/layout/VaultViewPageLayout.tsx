import type { ReactNode } from 'react';
import { PageSectionHeader } from '@shared/components/layout/PageSectionHeader';
import { ViewModeToggle } from '@shared/components/drive/ViewModeToggle';
import type { ViewMode } from '../../../modules/user/drive/types/drive.types';

type VaultViewPageLayoutProps = {
  title: string;
  subtitle?: string;
  itemCount?: number;
  viewMode?: ViewMode;
  onViewModeChange?: (mode: ViewMode) => void;
  showViewToggle?: boolean;
  actionIcon?: React.ComponentType<{ className?: string }>;
  actionLabel?: string;
  onAction?: () => void;
  actionVariant?: 'primary' | 'secondary' | 'danger' | 'outline';
  children: ReactNode;
};

/** Layout estándar VAULT para vistas de archivos (Drive, Compartidos, Recientes, etc.). */
export const VaultViewPageLayout = ({
  title,
  subtitle,
  itemCount,
  viewMode,
  onViewModeChange,
  showViewToggle = true,
  actionIcon,
  actionLabel,
  onAction,
  actionVariant = 'primary',
  children,
}: VaultViewPageLayoutProps) => (
  <div className="mx-auto max-w-[1400px] space-y-5 p-4 sm:p-6 lg:p-8">
    <PageSectionHeader
      title={title}
      contextLabel={subtitle}
      actionIcon={actionIcon}
      actionLabel={actionLabel}
      onAction={onAction}
      actionVariant={actionVariant}
    />

    {(showViewToggle || itemCount !== undefined) && (
      <div className="flex items-center justify-between gap-3">
        {showViewToggle && viewMode && onViewModeChange ? (
          <ViewModeToggle value={viewMode} onChange={onViewModeChange} />
        ) : (
          <div />
        )}
        {itemCount !== undefined ? (
          <p className="text-sm font-medium text-[var(--text-secondary)]">
            {itemCount} elemento(s)
          </p>
        ) : null}
      </div>
    )}

    {children}
  </div>
);
