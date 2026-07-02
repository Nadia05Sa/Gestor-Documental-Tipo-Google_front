import type { ReactNode } from 'react';
import { INTER_STYLE } from '@shared/utils/authTheme';

type LandingTemplateProps = {
  topBar: ReactNode;
  hero: ReactNode;
  features: ReactNode;
  benefits: ReactNode;
  cta: ReactNode;
  footer: ReactNode;
};

/** Estructura de la landing pública: barra superior, secciones principales y pie. */
export function LandingTemplate({
  topBar,
  hero,
  features,
  benefits,
  cta,
  footer,
}: LandingTemplateProps) {
  return (
    <div
      id="inicio"
      className="overflow-x-hidden bg-[var(--bg-base)] text-[var(--text-primary)]"
      style={{ ...INTER_STYLE, minHeight: 'max(884px, 100dvh)' }}
    >
      {topBar}

      <main className="pt-20">
        {hero}
        {features}
        {benefits}
        {cta}
      </main>

      {footer}
    </div>
  );
}
