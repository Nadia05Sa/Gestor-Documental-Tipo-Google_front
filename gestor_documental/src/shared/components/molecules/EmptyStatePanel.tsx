import type { ComponentType, ReactNode } from 'react';
import { SurfacePanel } from '@shared/components/molecules/SurfacePanel';
import { ActionButton } from '@shared/components/atoms/ActionButton';

type EmptyStatePanelProps = {
  icon?: ComponentType<{ className?: string; style?: React.CSSProperties }>;
  title?: ReactNode;
  description?: ReactNode;
  actionIcon?: ComponentType<{ size?: number; className?: string }>;
  actionLabel?: ReactNode;
  onAction?: () => void;
};

/**
 * EmptyStatePanel
 */
export const EmptyStatePanel = ({
  icon: Icon,
  title,
  description,
  actionIcon,
  actionLabel,
  onAction,
}: EmptyStatePanelProps) => {
  return (
    <SurfacePanel padding="p-12" centered>
      {Icon ? <Icon className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--text-secondary, #6b7280)' }} /> : null}

      <h3 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary, #111827)' }}>
        {title}
      </h3>

      {description ? (
        <p className="mb-6" style={{ color: 'var(--text-secondary, #6b7280)' }}>
          {description}
        </p>
      ) : null}

      {actionLabel && onAction ? (
        <div className="flex justify-center">
          <ActionButton
            icon={actionIcon}
            label={actionLabel}
            onClick={onAction}
            variant="primary"
            size="medium"
            fullWidth={false}
          />
        </div>
      ) : null}
    </SurfacePanel>
  );
};
