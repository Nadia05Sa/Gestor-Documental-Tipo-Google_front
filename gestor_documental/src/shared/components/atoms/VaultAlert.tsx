import type { ReactNode } from 'react';

type VaultAlertProps = {
  children: ReactNode;
  className?: string;
};

export function VaultAlert({ children, className = '' }: VaultAlertProps) {
  return (
    <div
      className={`rounded-xl border bg-[var(--accent-subtle)] p-4 text-sm leading-6 text-[var(--text-primary)] ${className}`}
      style={{ borderColor: 'var(--border-subtle)' }}
      role="note"
    >
      {children}
    </div>
  );
}
