import { LANDING_FOOTER_LINKS } from '../types/landing.types';
import { BRAND_NAVY, BRAND_PURPLE, MANROPE_STYLE } from '@shared/utils/authTheme';

export const LandingFooter = () => (
  <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]">
    <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-4 py-8 sm:px-8 md:flex-row md:px-12 md:py-10">
      <div className="flex flex-col items-center gap-2 md:items-start">
        <span className="text-lg font-semibold" style={MANROPE_STYLE}>
          <span style={{ color: BRAND_NAVY }}>Infinity </span>
          <span style={{ color: BRAND_PURPLE }}>Vault</span>
        </span>
        <p className="text-sm text-[var(--text-secondary)]">
          © {new Date().getFullYear()} Infinity Vault. Tu almacenamiento seguro en la nube.
        </p>
      </div>

      <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 md:justify-start">
        {LANDING_FOOTER_LINKS.map((label) => (
          <a
            key={label}
            href="#"
            className="text-sm text-[var(--text-secondary)] opacity-80 transition-all hover:text-[var(--accent)] hover:opacity-100"
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  </footer>
);
