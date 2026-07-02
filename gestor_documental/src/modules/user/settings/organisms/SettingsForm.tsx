import { useEffect, useState, type ComponentType, type ReactNode } from 'react';
import { Clock, Globe, Mail, Moon, User } from 'lucide-react';
import { InputText } from '@shared/components/inputs/InputText';
import { Select } from '@shared/components/inputs/Select';
import { AuthGradientButton } from '@shared/components/auth/AuthGradientButton';
import { VaultCard } from '@shared/components/VaultCard';
import { validateProfile } from '../validations/settingsSchema';
import type { ProfileErrors } from '../validations/settingsSchema';
import {
  LOCALE_OPTIONS,
  THEME_OPTIONS,
  TIMEZONE_OPTIONS,
} from '../types/settings.types';
import type { UserSettings } from '../types/settings.types';

type SettingsTab = 'profile' | 'preferences';

type SettingsFormProps = {
  tab: SettingsTab;
  settings: UserSettings;
  onSaveProfile: (patch: Partial<UserSettings>) => void;
  onSavePreferences: (patch: Partial<UserSettings>) => void;
};

const PreferenceField = ({
  icon: Icon,
  label,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  label: string;
  children: ReactNode;
}) => (
  <div className="space-y-2">
    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--bg-surface)] text-[var(--accent)]">
        <Icon className="h-4 w-4" />
      </span>
      {label}
    </div>
    {children}
  </div>
);

const ProfileSection = ({
  settings,
  onSaveProfile,
}: Pick<SettingsFormProps, 'settings' | 'onSaveProfile'>) => {
  const [name, setName] = useState(settings.name);
  const [email, setEmail] = useState(settings.email);
  const [errors, setErrors] = useState<ProfileErrors>({});

  useEffect(() => {
    setName(settings.name);
    setEmail(settings.email);
  }, [settings]);

  const handleSubmit = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const validationErrors = validateProfile({ name, email });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSaveProfile({ name: name.trim(), email: email.trim() });
  };

  return (
    <VaultCard padding="p-6">
      <h2 className="mb-1 text-lg font-extrabold text-[var(--text-primary)]">Información del perfil</h2>
      <p className="mb-5 text-sm text-[var(--text-secondary)]">
        Actualiza tu nombre y correo electrónico.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputText
          label="Nombre completo"
          value={name}
          error={errors.name}
          onChange={(event) => setName(event.target.value)}
          icon={User}
        />
        <InputText
          label="Email"
          type="email"
          value={email}
          error={errors.email}
          onChange={(event) => setEmail(event.target.value)}
          icon={Mail}
        />
        <div className="flex justify-end pt-2">
          <AuthGradientButton
            type="submit"
            label="Guardar cambios"
            fullWidth={false}
            className="!w-auto min-w-[10rem] px-6"
          />
        </div>
      </form>
    </VaultCard>
  );
};

const PreferencesSection = ({
  settings,
  onSavePreferences,
}: Pick<SettingsFormProps, 'settings' | 'onSavePreferences'>) => {
  const [locale, setLocale] = useState(settings.locale);
  const [theme, setTheme] = useState(settings.theme);
  const [timezone, setTimezone] = useState(settings.timezone);

  useEffect(() => {
    setLocale(settings.locale);
    setTheme(settings.theme);
    setTimezone(settings.timezone);
  }, [settings]);

  return (
    <VaultCard padding="p-6">
      <h2 className="mb-1 text-lg font-extrabold text-[var(--text-primary)]">Preferencias</h2>
      <p className="mb-5 text-sm text-[var(--text-secondary)]">
        Personaliza idioma, tema visual y zona horaria.
      </p>
      <div className="space-y-5">
        <PreferenceField icon={Globe} label="Idioma">
          <Select
            value={locale}
            options={LOCALE_OPTIONS}
            showPlaceholderOption={false}
            reserveHelperSpace={false}
            onChange={(event) => setLocale(event.target.value as UserSettings['locale'])}
          />
        </PreferenceField>
        <PreferenceField icon={Moon} label="Tema">
          <Select
            value={theme}
            options={THEME_OPTIONS}
            showPlaceholderOption={false}
            reserveHelperSpace={false}
            onChange={(event) => setTheme(event.target.value as UserSettings['theme'])}
          />
        </PreferenceField>
        <PreferenceField icon={Clock} label="Zona horaria">
          <Select
            value={timezone}
            options={TIMEZONE_OPTIONS.map((value) => ({ value, label: value }))}
            showPlaceholderOption={false}
            reserveHelperSpace={false}
            onChange={(event) => setTimezone(event.target.value)}
          />
        </PreferenceField>
        <div className="flex justify-end pt-2">
          <AuthGradientButton
            label="Guardar preferencias"
            fullWidth={false}
            className="!w-auto min-w-[10rem] px-6"
            onClick={() => onSavePreferences({ locale, theme, timezone })}
          />
        </div>
      </div>
    </VaultCard>
  );
};

export const SettingsForm = ({ tab, settings, onSaveProfile, onSavePreferences }: SettingsFormProps) => {
  if (tab === 'profile') {
    return <ProfileSection settings={settings} onSaveProfile={onSaveProfile} />;
  }
  return <PreferencesSection settings={settings} onSavePreferences={onSavePreferences} />;
};
