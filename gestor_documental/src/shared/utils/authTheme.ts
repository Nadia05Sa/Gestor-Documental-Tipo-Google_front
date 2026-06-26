const AUTH_FONTS_ID = 'auth-google-fonts';
const AUTH_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';

export const BRAND_GRADIENT = 'linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%)';
export const PROMO_PANEL_GRADIENT = 'linear-gradient(135deg, #7c3aed 0%, #3b82f6 50%, #06b6d4 100%)';
export const CTA_BANNER_GRADIENT = PROMO_PANEL_GRADIENT;
export const REGISTER_PAGE_GRADIENT = 'linear-gradient(180deg, #f8faff 0%, #eef2ff 100%)';
export const SOFT_GLOW_GRADIENT = 'linear-gradient(135deg, #c4b5fd 0%, #93c5fd 100%)';

export const BRAND_NAVY = '#1e3a5f';
export const BRAND_PURPLE = '#8b5cf6';
export const BRAND_LINK_COLOR = '#3b82f6';

export const INPUT_LABEL_STYLE = { fontFamily: 'Manrope, sans-serif' };
export const MANROPE_STYLE = { fontFamily: 'Manrope, sans-serif' };
export const INTER_STYLE = { fontFamily: 'Inter, sans-serif' };

export const gradientButtonStyle = (overrides: Record<string, string | number> = {}) => ({
  background: BRAND_GRADIENT,
  border: 'none',
  fontWeight: '700',
  ...overrides,
});

export const gradientButtonHoverStyle = () => ({
  opacity: '0.92',
  background: BRAND_GRADIENT,
});

export const primaryAuthButtonStyle = {
  borderRadius: '0.625rem',
  padding: '0.75rem 1rem',
  fontSize: '0.9375rem',
  boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)',
};

export const setupAuthPage = () => {
  if (!document.getElementById(AUTH_FONTS_ID)) {
    const link = document.createElement('link');
    link.id = AUTH_FONTS_ID;
    link.rel = 'stylesheet';
    link.href = AUTH_FONTS_URL;
    document.head.appendChild(link);
  }

  const root = document.documentElement;
  root.dataset.theme = 'light';
  root.dataset.themeMode = 'light';
  root.dataset.accent = 'blue';
};
