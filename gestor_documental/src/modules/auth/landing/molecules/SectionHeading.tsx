import { MANROPE_STYLE } from '@shared/utils/authTheme';
import type { SectionHeadingProps } from '../types/landing.types';

/** Título + descripción opcional para secciones de la landing. */
export const SectionHeading = ({ title, description, className = 'text-center' }: SectionHeadingProps) => (
  <div className={`space-y-4 ${className}`}>
    <h2 className="text-3xl font-bold tracking-tight md:text-4xl" style={MANROPE_STYLE}>
      {title}
    </h2>
    {description ? (
      <p className="mx-auto max-w-2xl text-[var(--text-secondary)]">{description}</p>
    ) : null}
  </div>
);
