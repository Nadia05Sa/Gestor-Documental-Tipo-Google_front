import { forwardRef, useEffect, useRef, useState } from 'react';
import type { ChangeEvent, FocusEvent } from 'react';
import { Info } from 'lucide-react';

type TextareaOptions = {
  label?: string;
  error?: string;
  helperText?: string;
  infoMessage?: string;
  className?: string;
  colorVariant?: 'user' | 'default';
  reserveHelperSpace?: boolean;
  id?: string;
  name?: string;
  value?: string | number | readonly string[];
  defaultValue?: string | number | readonly string[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  readOnly?: boolean;
  onChange?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: (event: FocusEvent<HTMLTextAreaElement>) => void;
  onBlur?: (event: FocusEvent<HTMLTextAreaElement>) => void;
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaOptions>(
  (
    {
      label,
      error,
      helperText,
      infoMessage,
      className = '',
      colorVariant = 'user',
      reserveHelperSpace = false,
      id,
      name,
      value,
      defaultValue,
      placeholder,
      disabled = false,
      required = false,
      rows,
      minLength,
      maxLength,
      readOnly = false,
      onChange,
      onFocus,
      onBlur,
    },
    ref,
  ) => {
    const isBaseDisabled = disabled;
    const [showTooltip, setShowTooltip] = useState(false);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const hasError = Boolean(error);
    const textareaBackgroundColor = hasError
      ? 'var(--error-subtle, #fef2f2)'
      : 'var(--bg-surface, #f3f4f6)';

    let textareaBorderColor = 'var(--border-default, #d1d5db)';
    if (hasError) {
      textareaBorderColor = 'var(--error, #dc2626)';
    } else if (isBaseDisabled) {
      textareaBorderColor = 'transparent';
    }

    const textareaTextColor = isBaseDisabled
      ? 'var(--text-disabled, #94a3b8)'
      : 'var(--text-primary, #111827)';
    const focusAccent = colorVariant === 'default'
      ? 'var(--system-accent, var(--accent, #2563eb))'
      : 'var(--accent, #2563eb)';
    const focusAccentSubtle = colorVariant === 'default'
      ? 'var(--system-accent-subtle, var(--accent-subtle, rgba(37, 99, 235, 0.1)))'
      : 'var(--accent-subtle, rgba(37, 99, 235, 0.1))';

    useEffect(() => {
      if (!showTooltip) {
        return undefined;
      }

      const handleClickOutside = (event: MouseEvent) => {
        if (tooltipRef.current && event.target instanceof Node && !tooltipRef.current.contains(event.target)) {
          setShowTooltip(false);
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showTooltip]);

    return (
      <div className="w-full">
        {label && (
          <label
            className="mb-2 flex items-center justify-between text-sm font-medium"
            style={{ color: 'var(--text-primary, #111827)' }}
          >
            <span>
              {label}
              {required && (
                <span style={{ color: 'var(--error, #dc2626)' }} className="ml-1">
                  *
                </span>
              )}
            </span>
            {infoMessage && (
              <div className="relative flex items-center" ref={tooltipRef}>
                <button
                  type="button"
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  onClick={() => setShowTooltip((prev) => !prev)}
                  className="transition-colors focus:outline-none"
                  style={{ color: 'var(--text-secondary, #6b7280)' }}
                >
                  <Info className="h-4 w-4" />
                </button>
                {showTooltip && (
                  <div
                    className="absolute right-0 top-6 z-50 w-64 rounded-lg border p-3 text-xs shadow-lg"
                    style={{
                      backgroundColor: 'var(--bg-base, #111827)',
                      color: 'var(--text-primary, #f1f5f9)',
                      border: '1px solid var(--border-default, #334155)',
                    }}
                  >
                    <div
                      className="absolute -top-1 right-2 h-2 w-2 rotate-45"
                      style={{
                        backgroundColor: 'var(--bg-base, #111827)',
                        borderTop: '1px solid var(--border-default, #334155)',
                        borderLeft: '1px solid var(--border-default, #334155)',
                      }}
                    />
                    {infoMessage}
                  </div>
                )}
              </div>
            )}
          </label>
        )}

        <textarea
          ref={ref}
          style={{
            backgroundColor: textareaBackgroundColor,
            borderColor: textareaBorderColor,
            color: textareaTextColor,
          }}
          className={`w-full resize-none rounded-lg border px-4 py-2.5 text-sm outline-none transition-all duration-200 disabled:cursor-not-allowed ${className}`}
          onFocus={(event) => {
            if (!error && !isBaseDisabled) {
              event.currentTarget.style.backgroundColor = 'var(--bg-surface, #f3f4f6)';
              event.currentTarget.style.borderColor = focusAccent;
              event.currentTarget.style.boxShadow = `0 0 0 3px ${focusAccentSubtle}`;
            }
            onFocus?.(event);
          }}
          onBlur={(event) => {
            if (!isBaseDisabled) {
              event.currentTarget.style.backgroundColor = textareaBackgroundColor;
              event.currentTarget.style.borderColor = textareaBorderColor;
              event.currentTarget.style.boxShadow = 'none';
            }
            onBlur?.(event);
          }}
          id={id}
          name={name}
          value={value}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          rows={rows}
          minLength={minLength}
          maxLength={maxLength}
          readOnly={readOnly}
          onChange={onChange}
        />

        {error && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--error, #dc2626)' }}>
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="mt-1.5 text-xs" style={{ color: 'var(--text-secondary, #6b7280)' }}>
            {helperText}
          </p>
        )}

        {reserveHelperSpace && !error && !helperText && (
          <p className="mt-1.5 text-xs opacity-0" aria-hidden="true">&nbsp;</p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
export { Textarea };
