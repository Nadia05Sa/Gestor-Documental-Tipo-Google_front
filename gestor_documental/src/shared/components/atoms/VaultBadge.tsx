import type { ReactNode } from 'react';

const TONE_STYLES = {
  primary: {
    backgroundColor: 'var(--accent-subtle)',
    color: 'var(--accent)',
  },
  success: {
    backgroundColor: 'var(--success-subtle)',
    color: 'var(--success-text)',
  },
  warning: {
    backgroundColor: 'var(--warning-subtle)',
    color: 'var(--warning-text)',
  },
  danger: {
    backgroundColor: 'var(--danger-subtle)',
    color: 'var(--error)',
  },
  neutral: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
  },
};

type VaultBadgeTone = keyof typeof TONE_STYLES;

type VaultBadgeProps = {
  children: ReactNode;
  tone?: VaultBadgeTone;
  className?: string;
};

export function VaultBadge({ children, tone = 'primary', className = '' }: VaultBadgeProps) {
  const toneStyle = TONE_STYLES[tone] ?? TONE_STYLES.primary;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${className}`}
      style={toneStyle}
    >
      {children}
    </span>
  );
}
