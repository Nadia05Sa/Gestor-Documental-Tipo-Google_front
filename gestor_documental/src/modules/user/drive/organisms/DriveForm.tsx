import { useEffect, useState } from 'react';
import { InputText } from '@shared/components/atoms/InputText';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { VaultModal } from '@shared/components/molecules/VaultModal';
import { validateItemName } from '../validations/driveSchema';

type DriveFormProps = {
  open: boolean;
  title: string;
  label: string;
  confirmLabel: string;
  initialValue?: string;
  onClose: () => void;
  onSubmit: (name: string) => void;
};

/**
 * Modal de formulario reutilizable para crear carpeta y renombrar ítems.
 */
export const DriveForm = ({
  open,
  title,
  label,
  confirmLabel,
  initialValue = '',
  onClose,
  onSubmit,
}: DriveFormProps) => {
  const [name, setName] = useState(initialValue);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialValue);
      setError(null);
    }
  }, [open, initialValue]);

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
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={(
        <>
          <ActionButton label="Cancelar" variant="secondary" fullWidth={false} onClick={onClose} />
          <ActionButton label={confirmLabel} variant="primary" fullWidth={false} onClick={handleSubmit} />
        </>
      )}
    >
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
      >
        <InputText
          label={label}
          value={name}
          error={error ?? undefined}
          autoFocus
          onChange={(event) => {
            setName(event.target.value);
            if (error) setError(null);
          }}
        />
      </form>
    </VaultModal>
  );
};
