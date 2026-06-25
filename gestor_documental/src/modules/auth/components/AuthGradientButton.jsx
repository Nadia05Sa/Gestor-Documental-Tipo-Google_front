import PropTypes from 'prop-types';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { gradientButtonHoverStyle, gradientButtonStyle } from '../constants/theme';

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
}) => (
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

AuthGradientButton.propTypes = {
  label: PropTypes.node,
  loading: PropTypes.bool,
  loadingLabel: PropTypes.node,
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  size: PropTypes.string,
  className: PropTypes.string,
  styleOverrides: PropTypes.object,
  fullWidth: PropTypes.bool,
};
