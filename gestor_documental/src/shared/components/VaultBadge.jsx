import PropTypes from 'prop-types';

const TONE_STYLES = {
  primary: {
    backgroundColor: 'var(--accent-subtle)',
    color: 'var(--accent)',
  },
  success: {
    backgroundColor: 'var(--success-subtle)',
    color: 'var(--success-text)',
  },
  warning: {
    backgroundColor: 'var(--warning-subtle)',
    color: 'var(--warning-text)',
  },
  danger: {
    backgroundColor: 'var(--danger-subtle)',
    color: 'var(--error)',
  },
  neutral: {
    backgroundColor: 'var(--bg-surface)',
    color: 'var(--text-secondary)',
  },
};

export function VaultBadge({ children, tone = 'primary', className = '' }) {
  const toneStyle = TONE_STYLES[tone] || TONE_STYLES.primary;

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-bold ${className}`}
      style={toneStyle}
    >
      {children}
    </span>
  );
}

VaultBadge.propTypes = {
  children: PropTypes.node,
  tone: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'neutral']),
  className: PropTypes.string,
};
