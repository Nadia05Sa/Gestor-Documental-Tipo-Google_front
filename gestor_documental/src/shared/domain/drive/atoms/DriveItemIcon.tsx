import { getDriveItemIconMeta } from '../utils/driveItemUtils';

type DriveItemIconProps = {
  kind: 'folder' | 'file';
  extension?: string;
  size?: 'sm' | 'md' | 'lg';
  /** plain: solo icono; badge: icono sobre fondo suave; folderGradient: carpeta con gradiente VAULT */
  variant?: 'plain' | 'badge' | 'folderGradient';
  className?: string;
};

const SIZE_CLASSES = {
  sm: { icon: 'h-4 w-4', box: 'h-8 w-8 rounded-lg' },
  md: { icon: 'h-5 w-5', box: 'h-9 w-9 rounded-lg' },
  lg: { icon: 'h-6 w-6', box: 'h-12 w-12 rounded-xl' },
};

/**
 * Icono tipado por extensión con colores VAULT (PDF rojo, Word azul, Excel verde, imagen morada).
 */
export const DriveItemIcon = ({
  kind,
  extension,
  size = 'md',
  variant = 'badge',
  className = '',
}: DriveItemIconProps) => {
  const meta = getDriveItemIconMeta(kind, extension);
  const Icon = meta.icon;
  const sizes = SIZE_CLASSES[size];

  if (variant === 'plain') {
    return (
      <Icon
        className={`${sizes.icon} shrink-0 ${className}`}
        style={{ color: meta.color }}
        aria-hidden
      />
    );
  }

  if (kind === 'folder' && variant === 'folderGradient') {
    return (
      <span
        className={`flex shrink-0 items-center justify-center ${sizes.box} ${className}`}
        style={{
          background: 'var(--gradient-primary)',
          color: 'var(--text-on-accent)',
        }}
      >
        <Icon className={sizes.icon} aria-hidden />
      </span>
    );
  }

  return (
    <span
      className={`flex shrink-0 items-center justify-center ${sizes.box} ${className}`}
      style={{
        backgroundColor: meta.backgroundColor,
        color: meta.color,
      }}
    >
      <Icon className={sizes.icon} aria-hidden />
    </span>
  );
};
