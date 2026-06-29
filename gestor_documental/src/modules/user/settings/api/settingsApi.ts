import type { UserSettings } from '../types/settings.types';

/**
 * API de Configuración (mock de desarrollo).
 *
 * Persiste las preferencias del usuario en `localStorage`. Backend objetivo:
 * endpoints granulares en `svc-auth` sobre la tabla `user_settings`
 * (ver `.docs/05-modules/user/settings.md`).
 */

const STORAGE_KEY = 'vault_user_settings';

const DEFAULT_SETTINGS: UserSettings = {
  name: '',
  surname: '',
  motherLastName: '',
  email: '',
  theme: 'SYSTEM',
  locale: 'es-419',
  timezone: 'America/Mexico_City',
};

const applyTheme = (theme: UserSettings['theme']) => {
  if (typeof document === 'undefined') return;
  document.documentElement.dataset.theme = theme.toLowerCase();
};

export const settingsApi = {
  getSettings(fallback: Partial<UserSettings> = {}): UserSettings {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const stored = raw ? (JSON.parse(raw) as Partial<UserSettings>) : {};
      const merged = { ...DEFAULT_SETTINGS, ...fallback, ...stored };
      applyTheme(merged.theme);
      return merged;
    } catch {
      return { ...DEFAULT_SETTINGS, ...fallback };
    }
  },

  save(settings: UserSettings): UserSettings {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    applyTheme(settings.theme);
    return settings;
  },
};
