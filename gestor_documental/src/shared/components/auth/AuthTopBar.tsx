import { Link } from 'react-router-dom';
import { AuthGradientButton } from '@shared/components/auth/AuthGradientButton';
import { InfinityVaultLogo } from '@shared/components/auth/InfinityVaultLogo';

const NAV_LINKS = [
  { href: '/#inicio', label: 'Inicio', active: true },
  { href: '/#funciones', label: 'Funciones' },
  { href: '/#cta', label: 'Comenzar' },
];

type AuthTopBarOptions = {
  showActionButton?: boolean;
  showNavigation?: boolean;
  logoClickable?: boolean;
  actionLabel?: string;
  actionLoadingLabel?: string;
  isActionLoading?: boolean;
  actionDisabled?: boolean;
  onActionClick?: () => void;
};

export const AuthTopBar = ({
  showActionButton = true,
  showNavigation = false,
  logoClickable = true,
  actionLabel = 'Iniciar sesión',
  actionLoadingLabel = 'Cargando...',
  isActionLoading = false,
  actionDisabled = false,
  onActionClick,
}: AuthTopBarOptions) => {
  const isDisabled = actionDisabled || isActionLoading;

  return (
    <header className="fixed top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-elevated)] shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {logoClickable ? (
          <Link to="/" className="rounded-lg transition-opacity hover:opacity-90" aria-label="Ir a la landing">
            <InfinityVaultLogo className="justify-start" />
          </Link>
        ) : (
          <InfinityVaultLogo className="justify-start" />
        )}

        {showNavigation ? (
          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className={
                  link.active
                    ? 'border-b-2 border-[var(--accent)] font-semibold text-[var(--accent)] transition-colors'
                    : 'rounded px-2 py-1 text-[var(--text-secondary)] transition-colors hover:bg-[var(--accent-subtle)]'
                }
              >
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <div className="hidden md:block" aria-hidden="true" />
        )}

        {showActionButton ? (
          <AuthGradientButton
            label={actionLabel}
            loading={isActionLoading}
            loadingLabel={actionLoadingLabel}
            disabled={isDisabled}
            onClick={onActionClick}
            fullWidth={false}
            className="!w-auto rounded-xl shadow-md"
          />
        ) : (
          <div className="w-[98px] sm:w-[130px]" aria-hidden="true" />
        )}
      </div>
    </header>
  );
};
