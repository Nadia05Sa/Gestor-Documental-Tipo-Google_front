import { Plus, Trash2 } from 'lucide-react';
import { Select } from '@shared/components/atoms/Select';
import type { SelectOption } from '@shared/components/atoms/Select';

type CascadingSelector = {
  key: string;
  label: string;
  options?: SelectOption[] | string[];
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
};

type CascadingListItem = {
  id: string | number;
  primaryText?: string;
  secondaryText?: string;
};

type CascadingSelectableListFieldProps = {
  label: string;
  description?: string;
  selectors?: CascadingSelector[];
  addLabel?: string;
  onAdd?: () => void;
  addDisabled?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingText?: string;
  notice?: string;
  error?: string;
  items?: CascadingListItem[];
  emptyText?: string;
  onRemove?: (item: CascadingListItem) => void;
  removeLabel?: string;
  colorVariant?: 'user' | 'default';
};

/**
 * CascadingSelectableListField
 */
export const CascadingSelectableListField = ({
  label,
  description,
  selectors = [],
  addLabel = 'Agregar',
  onAdd,
  addDisabled = false,
  disabled = false,
  loading = false,
  loadingText = 'Cargando catálogo…',
  notice,
  error,
  items = [],
  emptyText = 'Sin elementos seleccionados',
  onRemove,
  removeLabel = 'Quitar elemento',
  colorVariant = 'user',
}: CascadingSelectableListFieldProps) => {
  const actionAccent = colorVariant === 'default'
    ? 'var(--system-accent, var(--accent, #2563eb))'
    : 'var(--accent, #2563eb)';

  const canAdd = !disabled && !addDisabled;

  return (
    <div className="space-y-3 pt-2 border-t border-dashed border-[var(--border-default)]">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium text-[var(--text-primary)]">{label}</span>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 text-sm font-medium hover:underline disabled:opacity-50"
          style={{ color: actionAccent }}
          onClick={onAdd}
          disabled={!canAdd}
        >
          <Plus size={16} />
          {addLabel}
        </button>
      </div>

      {description ? (
        <p className="text-xs text-[var(--text-secondary)]">{description}</p>
      ) : null}

      <div className={`grid grid-cols-1 gap-3 ${selectors.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'}`}>
        {selectors.map((selector) => (
          <div key={selector.key}>
            <Select
              label={selector.label}
              options={Array.isArray(selector.options) ? selector.options : []}
              value={selector.value}
              onChange={(e) => selector.onChange?.(e.target.value)}
              placeholder={selector.placeholder || ''}
              disabled={disabled || Boolean(selector.disabled)}
              reserveHelperSpace={false}
            />
          </div>
        ))}
      </div>

      {loading ? (
        <p className="text-xs text-[var(--text-secondary)]">{loadingText}</p>
      ) : null}

      {notice ? (
        <p className="text-xs text-[var(--text-secondary)]">{notice}</p>
      ) : null}

      {error ? (
        <p className="text-xs" style={{ color: 'var(--error, #dc2626)' }}>
          {error}
        </p>
      ) : null}

      <div className="min-h-[2.5rem] rounded-lg border border-[var(--border-default)] p-3 bg-[var(--bg-surface)]">
        {items.length === 0 ? (
          <p className="text-sm italic text-[var(--text-tertiary)]">{emptyText}</p>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 text-sm text-[var(--text-primary)]"
              >
                <div>
                  <p>{item.primaryText || '—'}</p>
                  {item.secondaryText ? (
                    <p className="text-xs text-[var(--text-secondary)]">{item.secondaryText}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  className="p-1 rounded text-[var(--text-tertiary)] hover:bg-[var(--bg-elevated)] hover:text-[var(--error,#dc2626)] disabled:opacity-50"
                  onClick={() => onRemove?.(item)}
                  disabled={disabled}
                  aria-label={removeLabel}
                  title={removeLabel}
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};