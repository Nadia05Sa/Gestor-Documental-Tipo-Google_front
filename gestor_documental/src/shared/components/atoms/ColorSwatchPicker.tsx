import type { ChangeEvent, ReactNode } from 'react';

export type ColorSwatchOption = {
  value: string | number;
  label: string;
  hex?: string;
};

type ColorSwatchPickerProps = {
  label?: ReactNode;
  value?: string | number;
  onChange?: (event: ChangeEvent<HTMLInputElement> | { target: { value: string } }) => void;
  options?: ColorSwatchOption[];
  disabled?: boolean;
  required?: boolean;
  error?: string;
  helperText?: string;
  className?: string;
};

/**
 * ColorSwatchPicker
 * Componente para seleccionar un color a través de swatches visuales.
 */
export const ColorSwatchPicker = ({
  label,
  value,
  onChange,
  options = [],
  disabled = false,
  required = false,
  error,
  helperText,
  className = '',
}: ColorSwatchPickerProps) => {
  const selectedOption = options.find((option) => String(option.value) === String(value));

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-[var(--text-primary)] mb-3">
          {label}
          {required ? <span className="ml-1 text-[var(--error)]">*</span> : null}
        </label>
      )}

      <div className="flex flex-wrap gap-3">
        {options.map((option) => {
          const swatchHex = option.hex || '#9CA3AF';
          const isSelected = String(option.value) === String(value);

          return (
            <button
              key={String(option.value)}
              type="button"
              onClick={() => onChange?.({ target: { value: String(option.value) } })}
              disabled={disabled}
              className={`w-10 h-10 rounded-lg border-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                isSelected
                  ? 'border-[var(--accent)] ring-2 ring-[var(--accent)]'
                  : 'border-[var(--border-default)] hover:border-[var(--text-secondary)]'
              }`}
              style={{ backgroundColor: swatchHex }}
              title={option.label}
              aria-label={`Seleccionar color ${option.label}`}
            />
          );
        })}
      </div>

      {helperText && (
        !error && (
          <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
            {helperText}
            {selectedOption ? ` Seleccionado: ${selectedOption.label}.` : ''}
          </p>
        )
      )}

      {error && (
        <p className="mt-1.5 text-xs" style={{ color: 'var(--error, #dc2626)' }}>
          {error}
        </p>
      )}
    </div>
  );
};
