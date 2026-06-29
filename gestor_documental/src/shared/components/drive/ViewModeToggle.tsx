import { Grid3x3, List } from 'lucide-react';

export type ViewMode = 'grid' | 'list';

type ViewModeToggleProps = {
  value: ViewMode;
  onChange: (mode: ViewMode) => void;
};

export const ViewModeToggle = ({ value, onChange }: ViewModeToggleProps) => (
  <div
    className="flex items-center rounded-xl border bg-[var(--bg-elevated)] p-1"
    style={{ borderColor: 'var(--border-subtle)' }}
  >
    <button
      type="button"
      onClick={() => onChange('grid')}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
      style={{
        background: value === 'grid' ? 'var(--gradient-primary)' : 'transparent',
        color: value === 'grid' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
      }}
      aria-label="Vista de cuadrícula"
      aria-pressed={value === 'grid'}
    >
      <Grid3x3 className="h-4 w-4" />
    </button>
    <button
      type="button"
      onClick={() => onChange('list')}
      className="flex h-8 w-8 items-center justify-center rounded-lg transition-all"
      style={{
        background: value === 'list' ? 'var(--gradient-primary)' : 'transparent',
        color: value === 'list' ? 'var(--text-on-accent)' : 'var(--text-secondary)',
      }}
      aria-label="Vista de lista"
      aria-pressed={value === 'list'}
    >
      <List className="h-4 w-4" />
    </button>
  </div>
);
