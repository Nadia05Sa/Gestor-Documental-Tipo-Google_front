const AUTH_FONTS_ID = 'auth-google-fonts';
const AUTH_FONTS_URL =
  'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Inter:wght@400;500;600&display=swap';

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
