export type ThemeOption = 'SYSTEM' | 'LIGHT' | 'DARK';

export type LocaleOption = 'es-419' | 'en' | 'fr';

export type UserSettings = {
  name: string;
  surname: string;
  motherLastName: string;
  email: string;
  theme: ThemeOption;
  locale: LocaleOption;
  timezone: string;
};

export const THEME_OPTIONS: Array<{ value: ThemeOption; label: string }> = [
  { value: 'LIGHT', label: 'Claro' },
  { value: 'DARK', label: 'Oscuro' },
  { value: 'SYSTEM', label: 'Automático (sistema)' },
];

export const LOCALE_OPTIONS: Array<{ value: LocaleOption; label: string }> = [
  { value: 'es-419', label: 'Español (Latinoamérica)' },
  { value: 'en', label: 'Inglés' },
  { value: 'fr', label: 'Francés' },
];

export const TIMEZONE_OPTIONS: string[] = [
  'America/Mexico_City',
  'America/Bogota',
  'America/Lima',
  'America/Buenos_Aires',
  'America/Santiago',
  'Europe/Madrid',
  'UTC',
];
