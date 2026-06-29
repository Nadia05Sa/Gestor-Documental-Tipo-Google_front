const APP_FONTS_ID = 'vault-app-fonts';
const APP_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';

/** Inicializa fuentes y tokens visuales VAULT para toda la app autenticada. */
export const setupAppTheme = () => {
  if (!document.getElementById(APP_FONTS_ID)) {
    const link = document.createElement('link');
    link.id = APP_FONTS_ID;
    link.rel = 'stylesheet';
    link.href = APP_FONTS_URL;
    document.head.appendChild(link);
  }

  const root = document.documentElement;
  root.dataset.theme = 'light';
  root.dataset.themeMode = 'light';
  root.dataset.accent = 'vault';
};

export const APP_FONT_FAMILY = 'Manrope, Inter, system-ui, sans-serif';
