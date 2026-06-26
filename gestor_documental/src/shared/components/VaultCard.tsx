
export function VaultCard({
  as: Component = 'article',
  children,
  className = '',
  padding = 'p-6',
  interactive = false,
  selected = false,
  onClick,
  role,
  tabIndex,
  id,
  title,
}) {
  return (
    <Component
      className={`rounded-[var(--radius-card)] border bg-[var(--bg-elevated)] shadow-[var(--shadow-card)] ${padding} ${
        selected ? 'border-[var(--accent)] ring-1 ring-[var(--accent)]' : 'border-[var(--border-default)]'
      } ${
        interactive ? 'text-left transition-all hover:-translate-y-0.5 hover:border-[var(--accent)]' : ''
      } ${className}`}
      onClick={onClick}
      role={role}
      tabIndex={tabIndex}
      id={id}
      title={title}
    >
      {children}
    </Component>
  );
}
