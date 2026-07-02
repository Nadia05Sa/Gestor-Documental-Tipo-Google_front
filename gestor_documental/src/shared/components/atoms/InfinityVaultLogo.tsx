import logoSrc from '../../../assets/icon.png';
import { BRAND_NAVY, BRAND_PURPLE, MANROPE_STYLE } from '@shared/utils/authTheme';

type ShowNameMode = 'auto' | 'always' | 'never';

type InfinityVaultLogoProps = {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  /** auto: oculta el nombre en pantallas pequeñas; always: siempre visible; never: solo icono */
  showName?: ShowNameMode;
};

const sizeClasses = {
  sm: { logo: 'h-7 max-w-[2.75rem]', text: 'text-base' },
  md: { logo: 'h-9 max-w-[3.25rem]', text: 'text-xl' },
  lg: { logo: 'h-12 max-w-[4rem]', text: 'text-2xl' },
} as const;

const showNameClasses: Record<ShowNameMode, string> = {
  auto: 'hidden sm:inline',
  always: 'inline',
  never: 'hidden',
};

export const InfinityVaultLogo = ({
  className = 'justify-center',
  size = 'md',
  showName = 'auto',
}: InfinityVaultLogoProps) => {
  const nameClass = showNameClasses[showName];
  const iconOnly = showName === 'never';

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <img
        src={logoSrc}
        alt={iconOnly || showName === 'auto' ? 'Infinity Vault' : ''}
        aria-hidden={showName === 'always' ? true : undefined}
        className={`${sizeClasses[size].logo} w-auto shrink-0 object-contain object-left`}
      />
      <span
        className={`${sizeClasses[size].text} ${nameClass} truncate font-bold tracking-tight whitespace-nowrap`}
        style={MANROPE_STYLE}
      >
        <span style={{ color: BRAND_NAVY }}>Infinity </span>
        <span style={{ color: BRAND_PURPLE }}>Vault</span>
      </span>
    </div>
  );
};
