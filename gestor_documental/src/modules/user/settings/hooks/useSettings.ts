import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@context/AuthContext';
import { toast } from '@shared/components/organisms/Toast';
import { settingsApi } from '../api/settingsApi';
import type { UserSettings } from '../types/settings.types';

export const useSettings = () => {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fallback = {
      name: user?.name ?? '',
      surname: user?.surname ?? '',
      motherLastName: '',
      email: user?.email ?? '',
    };
    setSettings(settingsApi.getSettings(fallback));
    setLoading(false);
  }, [user]);

  const update = useCallback((patch: Partial<UserSettings>) => {
    setSettings((current) => {
      if (!current) return current;
      const next = { ...current, ...patch };
      settingsApi.save(next);
      return next;
    });
  }, []);

  const saveProfile = useCallback((patch: Partial<UserSettings>) => {
    update(patch);
    toast.success('Perfil actualizado');
  }, [update]);

  const savePreferences = useCallback((patch: Partial<UserSettings>) => {
    update(patch);
    toast.success('Configuración actualizada');
  }, [update]);

  return { settings, loading, saveProfile, savePreferences };
};
