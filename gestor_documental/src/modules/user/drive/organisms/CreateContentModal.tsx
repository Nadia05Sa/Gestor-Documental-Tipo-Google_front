import { useEffect, useState } from 'react';
import { FileSpreadsheet, FileText } from 'lucide-react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { InputText } from '@shared/components/atoms/InputText';
import { AuthGradientButton } from '@shared/components/molecules/AuthGradientButton';
import { VaultModal } from '@shared/components/molecules/VaultModal';
import { validateItemName } from '../validations/driveSchema';

export type CreateContentKind = 'document' | 'spreadsheet';

type CreateContentModalProps = {
  kind: CreateContentKind | null;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

const CONFIG: Record<
  CreateContentKind,
  {
    title: string;
    description: string;
    label: string;
    placeholder: string;
    defaultName: string;
    confirmLabel: string;
    icon: typeof FileText;
  }
> = {
  document: {
    title: 'Crear documento',
    description: 'Asigna un nombre al nuevo documento de texto.',
    label: 'Nombre del documento',
    placeholder: 'Documento sin título',
    defaultName: 'Documento sin título',
    confirmLabel: 'Crear documento',
    icon: FileText,
  },
  spreadsheet: {
    title: 'Crear hoja de cálculo',
    description: 'Asigna un nombre a la nueva hoja de cálculo.',
    label: 'Nombre de la hoja',
    placeholder: 'Hoja sin título',
    defaultName: 'Hoja sin título',
    confirmLabel: 'Crear hoja',
    icon: FileSpreadsheet,
  },
};

export const CreateContentModal = ({ kind, onClose, onSubmit }: CreateContentModalProps) => {
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!kind) return;
    setName(CONFIG[kind].defaultName);
    setError(null);
  }, [kind]);

  if (!kind) return null;

  const config = CONFIG[kind];
  const Icon = config.icon;

  const handleSubmit = () => {
    const validationError = validateItemName(name);
    if (validationError) {
      setError(validationError);
      return;
    }
    onSubmit(name.trim());
    onClose();
  };

  return (
    <VaultModal
      open
      onClose={onClose}
      title={config.title}
      description={config.description}
      size="sm"
      footer={(
        <>
          <ActionButton label="Cancelar" variant="ghost" fullWidth={false} onClick={onClose} />
          <AuthGradientButton
            label={config.confirmLabel}
            size="small"
            fullWidth={false}
            className="!w-auto min-w-[9rem] px-5"
            onClick={handleSubmit}
          />
        </>
      )}
    >
      <div className="space-y-5">
        <div className="flex justify-center">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl shadow-[var(--shadow-soft)]"
            style={{ background: 'var(--gradient-primary)' }}
          >
            <Icon className="h-8 w-8 text-white" strokeWidth={1.75} />
          </div>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            handleSubmit();
          }}
        >
          <InputText
            label={config.label}
            value={name}
            placeholder={config.placeholder}
            error={error ?? undefined}
            autoFocus
            onChange={(event) => {
              setName(event.target.value);
              if (error) setError(null);
            }}
          />
        </form>
      </div>
    </VaultModal>
  );
};
