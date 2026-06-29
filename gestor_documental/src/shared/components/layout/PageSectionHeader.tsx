import { ActionButton } from '@shared/components/inputs/ActionButton';

// Componente de encabezado para secciones o pantallas, con soporte para título, contexto adicional y acción principal.
/**
 * PageSectionHeader
 */
const PageSectionHeader = ({
  title,
  contextLabel,
  secondaryContextLabel,
  contextNotice,
  actionIcon,
  actionLabel,
  onAction,
  actionLoading = false,
  actionLoadingLabel = 'Cargando...',
  actionDisabled = false,
  actionVariant = 'primary',
}) => {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap">
      <div>
        <h2 className="text-2xl font-extrabold tracking-tight" style={{ color: 'var(--text-primary, #1e3a5f)' }}>
          {title}
        </h2>

        <div className="mt-1 flex items-center gap-2 flex-wrap">
          {contextLabel ? (
            <p className="text-base" style={{ color: 'var(--text-secondary, #6b7280)' }}>
              {contextLabel}
            </p>
          ) : null}

          {secondaryContextLabel ? (
            <p className="text-sm px-2.5 py-1 rounded-md border" style={{
              color: 'var(--text-secondary, #6b7280)',
              borderColor: 'var(--border-default, #d1d5db)',
              backgroundColor: 'var(--bg-surface, #f3f4f6)',
            }}>
              {secondaryContextLabel}
            </p>
          ) : null}
        </div>

        {contextNotice ? (
          <p
            className="mt-1 text-sm"
            style={{ color: 'var(--warning, #b45309)' }}
          >
            {contextNotice}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-2 flex-wrap justify-center">
      {actionLabel && onAction ? (
        <ActionButton
          icon={actionIcon}
          label={actionLabel}
          onClick={onAction}
          loading={actionLoading}
          loadingLabel={actionLoadingLabel}
          disabled={actionDisabled}
          variant={actionVariant}
          size="medium"
          fullWidth={false}
        />
      ) : null}
      </div>
    </div>
  );
};
export { PageSectionHeader };
