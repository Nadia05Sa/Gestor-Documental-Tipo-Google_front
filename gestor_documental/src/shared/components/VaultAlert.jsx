import PropTypes from 'prop-types';

export function VaultAlert({ children, className = '' }) {
  return (
    <div
      className={`rounded-xl border bg-[var(--accent-subtle)] p-4 text-sm leading-6 text-[var(--text-primary)] ${className}`}
      style={{ borderColor: 'var(--border-subtle)' }}
      role="note"
    >
      {children}
    </div>
  );
}

VaultAlert.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};
