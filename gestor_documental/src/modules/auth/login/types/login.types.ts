import type { LucideIcon } from 'lucide-react';
import { Cloud, FileText, FolderOpen } from 'lucide-react';

export type AuthRole = 'admin' | 'user' | string;

export type AuthSessionUser = {
  id: number | string;
  email: string;
  role: AuthRole;
  name?: string;
  surname?: string;
};

export type AuthAccount = AuthSessionUser & {
  password: string;
};

export type HardcodedUsers = Record<string, AuthAccount>;

import type { ChangeEvent, FormEvent } from 'react';

export type LoginFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type LoginFormProps = {
  email: string;
  password: string;
  rememberMe: boolean;
  error: string;
  loading: boolean;
  onEmailChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRememberMeChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type LoginPromoFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const LOGIN_PROMO = {
  title: 'Tu almacenamiento seguro en la nube',
  description: 'Gestiona, comparte y colabora en tus documentos desde cualquier lugar del mundo.',
  features: [
    {
      icon: Cloud,
      title: 'Almacenamiento seguro',
      description: 'Archivos protegidos con encriptación AES-256 de extremo a extremo.',
    },
    {
      icon: FolderOpen,
      title: 'Organización inteligente',
      description: 'Carpetas, etiquetas y búsqueda avanzada para encontrar todo al instante.',
    },
    {
      icon: FileText,
      title: 'Colaboración en tiempo real',
      description: 'Edita y comparte documentos con tu equipo sin fricciones.',
    },
  ] as LoginPromoFeature[],
};
