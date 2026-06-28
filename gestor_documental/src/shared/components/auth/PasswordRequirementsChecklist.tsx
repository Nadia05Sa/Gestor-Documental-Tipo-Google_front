import { CheckCircle2, Circle } from 'lucide-react';
import type { PasswordRequirements } from '../../../modules/auth/register/types/register.types';

const REQUIREMENT_CONFIG = [
  { key: 'minLength' as const, label: 'Longitud mínima de 8 caracteres.' },
  { key: 'hasUppercase' as const, label: 'Debe incluir al menos una letra mayúscula.' },
  { key: 'hasSpecialCharacter' as const, label: 'Debe incluir al menos un signo especial.' },
];

export const PasswordRequirementsChecklist = ({ requirements }: { requirements: PasswordRequirements }) => (
  <div className="rounded-lg border p-3" style={{ borderColor: 'var(--border-default, #d1d5db)' }}>
    <p className="text-sm font-semibold" style={{ color: 'var(--text-primary, #111827)' }}>
      Requisitos de seguridad
    </p>
    <ul className="mt-2 space-y-2">
      {REQUIREMENT_CONFIG.map((item) => {
        const isValid = Boolean(requirements[item.key]);
        return (
          <li key={item.key} className="flex items-start gap-2 text-sm">
            {isValid ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4" style={{ color: '#16a34a' }} />
            ) : (
              <Circle className="mt-0.5 h-4 w-4" style={{ color: 'var(--text-secondary, #6b7280)' }} />
            )}
            <span style={{ color: isValid ? '#166534' : 'var(--text-secondary, #6b7280)' }}>
              {item.label}
            </span>
          </li>
        );
      })}
    </ul>
  </div>
);
