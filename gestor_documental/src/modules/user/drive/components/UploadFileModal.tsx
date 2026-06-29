import { useEffect, useRef, useState } from 'react';
import { UploadCloud } from 'lucide-react';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { VaultModal } from '@shared/components/VaultModal';
import { formatBytes } from '@shared/components/drive/driveItemUtils';

type SelectedFile = {
  name: string;
  size: number;
};

type UploadFileModalProps = {
  open: boolean;
  onClose: () => void;
  onUpload: (name: string, size: number) => void;
};

export const UploadFileModal = ({ open, onClose, onUpload }: UploadFileModalProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [selected, setSelected] = useState<SelectedFile | null>(null);

  useEffect(() => {
    if (open) setSelected(null);
  }, [open]);

  const handleConfirm = () => {
    if (!selected) return;
    onUpload(selected.name, selected.size);
    onClose();
  };

  return (
    <VaultModal
      open={open}
      onClose={onClose}
      title="Subir archivo"
      description="Selecciona un archivo de tu equipo para añadirlo a esta carpeta."
      size="sm"
      footer={(
        <>
          <ActionButton label="Cancelar" variant="secondary" fullWidth={false} onClick={onClose} />
          <ActionButton
            label="Subir"
            variant="primary"
            fullWidth={false}
            disabled={!selected}
            onClick={handleConfirm}
          />
        </>
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex w-full flex-col items-center gap-2 rounded-[var(--radius-card,0.75rem)] border-2 border-dashed p-8 text-center transition-colors hover:bg-[var(--bg-surface)]"
        style={{ borderColor: 'var(--border-default, #d1d5db)' }}
      >
        <UploadCloud className="h-8 w-8 text-[var(--accent,#2563eb)]" />
        <span className="text-sm font-medium text-[var(--text-primary)]">
          {selected ? selected.name : 'Haz clic para seleccionar un archivo'}
        </span>
        <span className="text-xs text-[var(--text-secondary)]">
          {selected ? formatBytes(selected.size) : 'Cualquier formato'}
        </span>
      </button>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) setSelected({ name: file.name, size: file.size });
        }}
      />
    </VaultModal>
  );
};
