
import type { CSSProperties, ComponentType, FocusEvent, MouseEvent, ReactNode } from 'react';

const LEGACY_SIZE_MAP: Record<string, string> = {
  sm: 'small',
  md: 'medium',
  lg: 'large',
  icon: 'icon',
};

const resolveVariant = (variant: string) => {
  if (variant === 'user' || variant === 'default') {
    return 'primary';
  }

  if (variant === 'danger') {
    return 'danger';
  }

  if (variant === 'ghost') {
    return 'ghost';
  }

  return ['primary', 'secondary', 'outline'].includes(variant) ? variant : 'secondary';
};

type ActionButtonOptions = {
  children?: ReactNode;
  label?: ReactNode;
  icon?: ComponentType<{ size?: number; className?: string }>;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onFocus?: (event: FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: FocusEvent<HTMLButtonElement>) => void;
  variant?: string;
  colorVariant?: string;
  size?: string;
  align?: 'center' | 'left';
  iconPosition?: 'left' | 'right';
  iconSize?: number;
  className?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  loadingLabel?: ReactNode;
  customStyle?: CSSProperties;
  customHoverStyle?: CSSProperties;
  customBackgroundColor?: string;
  customTextColor?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
  name?: string;
  value?: string | number | readonly string[];
  'aria-label'?: string;
};

export function ActionButton({
  children,
  label,
  icon: Icon,
  onClick,
  onFocus,
  onBlur,
  variant = 'secondary',
  colorVariant = 'user',
  size = 'medium',
  align = 'center',
  iconPosition = 'left',
  iconSize,
  className = '',
  fullWidth = true,
  disabled = false,
  loading = false,
  loadingLabel = 'Cargando...',
  customStyle,
  customHoverStyle,
  customBackgroundColor,
  customTextColor,
  type = 'button',
  title,
  name,
  value,
  'aria-label': ariaLabel,
}: ActionButtonOptions) {
  const isBlocked = disabled || loading;
  const resolvedVariant = resolveVariant(variant);
  const resolvedSize = LEGACY_SIZE_MAP[size] || size;
  const normalizedColorVariant = colorVariant === 'default' ? 'default' : 'user';
  const useSystemColors = normalizedColorVariant === 'default' || variant === 'default';

  const palette = useSystemColors
    ? {
        accent: 'var(--system-accent, var(--accent, #2563eb))',
        accentHover: 'var(--system-accent-hover, var(--accent-hover, #1d4ed8))',
        accentSubtle: 'var(--system-accent-subtle, var(--accent-subtle, #eff6ff))',
        textOnAccent: 'var(--system-text-on-accent, #ffffff)',
        outlineBg: 'var(--system-button-outline-bg, transparent)',
        outlineText: 'var(--system-button-outline-text, var(--text-primary, #111827))',
        outlineBorder: 'var(--system-button-outline-border, var(--border-strong, #9ca3af))',
        outlineHoverBg: 'var(--system-button-outline-hover-bg, var(--system-accent-subtle, var(--accent-subtle, #eff6ff)))',
        outlineHoverBorder: 'var(--system-button-outline-hover-border, var(--system-accent, var(--accent, #2563eb)))',
        outlineHoverText: 'var(--system-button-outline-hover-text, var(--text-primary, #111827))',
        secondaryBorder: 'var(--system-secondary-border, var(--border-default, #d1d5db))',
        secondaryHoverBorder: 'var(--system-secondary-hover-border, var(--border-strong, #9ca3af))',
      }
    : {
        accent: 'var(--accent, #2563eb)',
        accentHover: 'var(--accent-hover, #1d4ed8)',
        accentSubtle: 'var(--accent-subtle, #eff6ff)',
        textOnAccent: 'var(--text-on-accent, #ffffff)',
        outlineBg: 'var(--button-outline-bg, transparent)',
        outlineText: 'var(--button-outline-text, var(--text-primary, #111827))',
        outlineBorder: 'var(--button-outline-border, var(--border-strong, #9ca3af))',
        outlineHoverBg: 'var(--button-outline-hover-bg, var(--accent-subtle, #eff6ff))',
        outlineHoverBorder: 'var(--button-outline-hover-border, var(--accent, #2563eb))',
        outlineHoverText: 'var(--button-outline-hover-text, var(--text-primary, #111827))',
        secondaryBorder: 'var(--border-default, #d1d5db)',
        secondaryHoverBorder: 'var(--border-strong, #9ca3af)',
      };

  const sizeConfig: Record<string, {
    padding: string;
    fontSize: string;
    gap: string | number;
    iconSize: number;
    width?: string;
    height?: string;
  }> = {
    small: { padding: '0.375rem 0.625rem', fontSize: '0.8125rem', gap: '0.375rem', iconSize: iconSize || 16 },
    medium: { padding: '0.5rem 0.75rem', fontSize: '0.875rem', gap: '0.5rem', iconSize: iconSize || 18 },
    large: { padding: '0.75rem 1rem', fontSize: '1rem', gap: '0.625rem', iconSize: iconSize || 22 },
    hero: { padding: '1rem 2rem', fontSize: '1rem', gap: '0.625rem', iconSize: iconSize || 22 },
    icon: { padding: '0.5rem', fontSize: '0.875rem', gap: 0, iconSize: iconSize || 18, width: '2.25rem', height: '2.25rem' },
  };

  const currentSize = sizeConfig[resolvedSize] || sizeConfig.medium;
  const isPrimary = resolvedVariant === 'primary';
  const isSecondary = resolvedVariant === 'secondary';
  const isOutline = resolvedVariant === 'outline';
  const isGhost = resolvedVariant === 'ghost';
  const isDanger = resolvedVariant === 'danger';
  const content = children ?? label;
  const isIconOnly = Boolean(Icon && !content && !loading);

  const baseStyles = {
    display: 'inline-flex',
    width: fullWidth && resolvedSize !== 'icon' ? '100%' : currentSize.width,
    height: currentSize.height,
    alignItems: 'center',
    justifyContent: align === 'center' ? 'center' : 'flex-start',
    gap: currentSize.gap,
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    fontWeight: '600',
    borderRadius: '0.5rem',
    border: '1px solid transparent',
    cursor: isBlocked ? 'not-allowed' : 'pointer',
    transition: 'all 150ms ease',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    opacity: isBlocked ? 0.6 : 1,
  };

  let variantStyles;
  if (isPrimary) {
    variantStyles = {
      backgroundColor: customBackgroundColor || palette.accent,
      color: customTextColor || palette.textOnAccent,
    };
  } else if (isOutline) {
    variantStyles = {
      backgroundColor: palette.outlineBg,
      color: palette.outlineText,
      borderColor: palette.outlineBorder,
    };
  } else if (isGhost) {
    variantStyles = {
      backgroundColor: 'transparent',
      color: 'var(--text-secondary, #6b7280)',
      borderColor: 'transparent',
      boxShadow: 'none',
    };
  } else if (isDanger) {
    variantStyles = {
      backgroundColor: 'var(--error, #ef4444)',
      color: 'white',
      borderColor: 'var(--error, #ef4444)',
    };
  } else {
    variantStyles = {
      backgroundColor: 'transparent',
      color: 'var(--text-primary, #111827)',
      borderColor: palette.secondaryBorder,
    };
  }

  const styles = customStyle ? { ...baseStyles, ...variantStyles, ...customStyle } : { ...baseStyles, ...variantStyles };

  const applyStyleObject = (target: HTMLElement, styleObject?: CSSProperties) => {
    if (!styleObject) return;
    Object.entries(styleObject).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        (target.style as unknown as Record<string, string>)[key] = String(value);
      }
    });
  };

  const handleHover = (event: MouseEvent<HTMLButtonElement>) => {
    if (isBlocked) return;

    if (isPrimary) {
      if (customBackgroundColor) {
        event.currentTarget.style.opacity = '0.9';
      } else {
        event.currentTarget.style.backgroundColor = palette.accentHover;
      }
    } else if (isOutline) {
      event.currentTarget.style.backgroundColor = palette.outlineHoverBg;
      event.currentTarget.style.borderColor = palette.outlineHoverBorder;
      event.currentTarget.style.color = palette.outlineHoverText;
    } else if (isSecondary) {
      event.currentTarget.style.backgroundColor = palette.accentSubtle;
      event.currentTarget.style.borderColor = palette.secondaryHoverBorder;
    } else if (isGhost) {
      event.currentTarget.style.backgroundColor = palette.accentSubtle;
      event.currentTarget.style.color = palette.accent;
    } else if (isDanger) {
      event.currentTarget.style.filter = 'brightness(0.95)';
    }

    applyStyleObject(event.currentTarget, customHoverStyle);
  };

  const handleHoverOut = (event: MouseEvent<HTMLButtonElement>) => {
    if (isBlocked) return;

    if (isPrimary) {
      event.currentTarget.style.opacity = '1';
      if (!customBackgroundColor) {
        event.currentTarget.style.backgroundColor = palette.accent;
      }
    } else if (isOutline) {
      event.currentTarget.style.backgroundColor = palette.outlineBg;
      event.currentTarget.style.borderColor = palette.outlineBorder;
      event.currentTarget.style.color = palette.outlineText;
    } else if (isSecondary) {
      event.currentTarget.style.backgroundColor = 'transparent';
      event.currentTarget.style.borderColor = palette.secondaryBorder;
    } else if (isGhost) {
      event.currentTarget.style.backgroundColor = 'transparent';
      event.currentTarget.style.color = 'var(--text-secondary, #6b7280)';
    } else if (isDanger) {
      event.currentTarget.style.filter = 'none';
    }

    if (customHoverStyle) {
      applyStyleObject(event.currentTarget, {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        border: styles.border,
        borderColor: styles.borderColor,
        opacity: String(styles.opacity ?? 1),
      });
    }
  };

  const renderIcon = () => {
    if (loading) {
      return (
        <svg className="animate-spin" style={{ width: currentSize.iconSize, height: currentSize.iconSize }} viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    }

    return Icon ? <Icon size={currentSize.iconSize} /> : null;
  };

  return (
    <button
      type={type}
      onClick={isBlocked ? undefined : onClick}
      className={className}
      style={styles}
      onMouseEnter={handleHover}
      onMouseLeave={handleHoverOut}
      disabled={isBlocked}
      aria-busy={loading}
      aria-label={ariaLabel}
      title={title}
      name={name}
      value={value}
      onFocus={onFocus}
      onBlur={onBlur}
    >
      {isIconOnly ? (
        renderIcon()
      ) : (
        <>
          {iconPosition === 'left' && renderIcon()}
          {loading ? loadingLabel : content}
          {iconPosition === 'right' && renderIcon()}
        </>
      )}
    </button>
  );
}
export { ActionButton as VaultButton };
