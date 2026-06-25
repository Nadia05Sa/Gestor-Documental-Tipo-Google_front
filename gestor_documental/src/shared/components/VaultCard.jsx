import PropTypes from 'prop-types';

export function VaultCard({
  as: Component = 'article',
  children,
  className = '',
  padding = 'p-6',
  interactive = false,
  selected = false,
  ...props
}) {
  return (
    <Component
      className={`rounded-[var(--radius-card)] border bg-[var(--bg-elevated)] shadow-[var(--shadow-card)] ${padding} ${
        selected ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border-default)]'
      } ${
        interactive ? 'text-left transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}

VaultCard.propTypes = {
  as: PropTypes.elementType,
  children: PropTypes.node,
  className: PropTypes.string,
  padding: PropTypes.string,
  interactive: PropTypes.bool,
  selected: PropTypes.bool,
};
