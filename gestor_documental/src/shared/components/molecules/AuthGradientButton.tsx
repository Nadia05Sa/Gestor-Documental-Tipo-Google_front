import { ActionButton } from '@shared/components/inputs/ActionButton';
import { gradientButtonHoverStyle, gradientButtonStyle } from '@shared/utils/authTheme';
import type { MouseEvent } from 'react';

type AuthGradientButtonOptions = {
  label: string;
  loading?: boolean;
  loadingLabel?: string;
  disabled?: boolean;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  styleOverrides?: Record<string, string | number>;
  fullWidth?: boolean;
};

export const AuthGradientButton = ({
  label,
  loading,
  loadingLabel,
  disabled,
  onClick,
  type = 'button',
  size = 'medium',
  className = '',
  styleOverrides = {},
  fullWidth = true,
}: AuthGradientButtonOptions) => (
  <ActionButton
    type={type}
    label={label}
    loading={loading}
    loadingLabel={loadingLabel}
    disabled={disabled}
    onClick={onClick}
    variant="default"
    colorVariant="default"
    size={size}
    fullWidth={fullWidth}
    className={className}
    customStyle={gradientButtonStyle(styleOverrides)}
    customHoverStyle={gradientButtonHoverStyle()}
  />
);
