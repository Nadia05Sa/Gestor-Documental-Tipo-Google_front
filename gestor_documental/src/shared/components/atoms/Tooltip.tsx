import { useId, useState, type ReactNode } from 'react';
import { Info } from 'lucide-react';

type TooltipProps = {
  children?: ReactNode;
  content?: ReactNode;
  className?: string;
  buttonClassName?: string;
  panelClassName?: string;
  ariaLabel?: string;
};

export const Tooltip = ({
  children,
  content,
  className = '',
  buttonClassName = '',
  panelClassName = '',
  ariaLabel = 'Mostrar informacion',
}: TooltipProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const tooltipId = useId();

  if (!content) {
    return children ?? null;
  }

  return (
    <span className={`relative inline-flex items-center ${className}`}>
      {children}
      <button
        type="button"
        className={`ml-1 inline-flex items-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent,#2563eb)]/35 ${buttonClassName}`}
        style={{ color: 'var(--text-secondary, #6b7280)' }}
        aria-label={ariaLabel}
        aria-describedby={isOpen ? tooltipId : undefined}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        onClick={() => setIsOpen((current) => !current)}
      >
        <Info className="h-4 w-4" />
      </button>

      {isOpen ? (
        <span
          id={tooltipId}
          role="tooltip"
          className={`absolute right-0 top-6 z-50 w-64 rounded-lg border p-3 text-left text-xs shadow-lg ${panelClassName}`}
          style={{
            backgroundColor: 'var(--bg-base, #111827)',
            color: 'var(--text-primary, #f1f5f9)',
            borderColor: 'var(--border-default, #334155)',
          }}
        >
          <span
            className="absolute -top-1 right-2 h-2 w-2 rotate-45 border-l border-t"
            style={{
              backgroundColor: 'var(--bg-base, #111827)',
              borderColor: 'var(--border-default, #334155)',
            }}
          />
          {content}
        </span>
      ) : null}
    </span>
  );
};
