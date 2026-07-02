import type { ReactNode } from 'react';

type DetailInfoRowProps = {
  label: string;
  value: ReactNode;
};

/** Fila label/valor para paneles laterales de detalle (Drive, Papelera, etc.). */
export const DetailInfoRow = ({ label, value }: DetailInfoRowProps) => (
  <div
    className="flex items-center justify-between gap-4 border-b py-3 last:border-b-0"
    style={{ borderColor: 'var(--border-subtle)' }}
  >
    <span className="text-sm text-[var(--text-secondary)]">{label}</span>
    <span className="text-right text-sm font-semibold text-[var(--text-primary)]">{value}</span>
  </div>
);
