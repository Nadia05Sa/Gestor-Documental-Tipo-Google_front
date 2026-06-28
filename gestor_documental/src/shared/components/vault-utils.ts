import { createElement } from 'react';
import type { ReactElement } from 'react';
import {
  Cloud,
  File,
  Folder,
  HardDrive,
  Lock,
  Mail,
  Share2,
  Shield,
  Upload,
  Users,
} from 'lucide-react';
import type { LucideIcon, LucideProps } from 'lucide-react';

export const iconMap: Record<string, LucideIcon> = {
  file: File,
  folder: Folder,
  share: Share2,
  storage: HardDrive,
  users: Users,
  upload: Upload,
  cloud: Cloud,
  lock: Lock,
  mail: Mail,
  shield: Shield,
};

export type IconInput = string | LucideIcon | null | undefined;
export type DaysLeftTone = 'neutral' | 'danger' | 'warning' | 'success';

export function resolveIcon(icon: IconInput): LucideIcon | null {
  if (!icon) return null;
  if (typeof icon === 'string') return iconMap[icon] || File;
  return icon;
}

export function renderIcon(icon: IconInput, props?: LucideProps): ReactElement | null {
  const Icon = resolveIcon(icon);
  return Icon ? createElement(Icon, props) : null;
}

export function resolveDaysLeftTone(days: number | string): DaysLeftTone {
  const value = typeof days === 'number' ? days : parseInt(String(days).replace(/\D/g, ''), 10);

  if (Number.isNaN(value)) return 'neutral';
  if (value <= 5) return 'danger';
  if (value <= 14) return 'warning';
  return 'success';
}
