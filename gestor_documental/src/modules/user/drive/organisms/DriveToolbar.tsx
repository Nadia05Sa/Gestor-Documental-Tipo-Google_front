import { useEffect, useRef, useState } from 'react';
import { FolderPlus, FileSpreadsheet, FileText, SlidersHorizontal, Upload } from 'lucide-react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { AuthGradientButton } from '@shared/components/molecules/AuthGradientButton';
import { ViewModeToggle } from '@shared/domain/drive/molecules/ViewModeToggle';
import type { ViewMode } from '../types/drive.types';

type DriveToolbarProps = {
  title: string;
  description?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onCreateFolder?: () => void;
  onCreateDocument?: () => void;
  onCreateSpreadsheet?: () => void;
  onUploadFile?: () => void;
  onAdvancedSearch?: () => void;
};

export const DriveToolbar = ({
  title,
  description,
  viewMode,
  onViewModeChange,
  onCreateFolder,
  onCreateDocument,
  onCreateSpreadsheet,
  onUploadFile,
  onAdvancedSearch,
}: DriveToolbarProps) => {
  const [uploadMenuOpen, setUploadMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!uploadMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setUploadMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [uploadMenuOpen]);

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">{description}</p>
        ) : (
          <p className="mt-1 text-sm text-[var(--text-secondary)]">
            Organiza, comparte y accede a tus archivos
          </p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ViewModeToggle value={viewMode} onChange={onViewModeChange} />

        {onAdvancedSearch ? (
          <ActionButton
            icon={SlidersHorizontal}
            label="Búsqueda avanzada"
            variant="outline"
            size="small"
            fullWidth={false}
            onClick={onAdvancedSearch}
            className="!w-auto whitespace-nowrap"
          />
        ) : null}

        {onCreateFolder ? (
          <ActionButton
            icon={FolderPlus}
            label="Nueva carpeta"
            variant="outline"
            size="small"
            fullWidth={false}
            onClick={onCreateFolder}
          />
        ) : null}

        {onUploadFile ? (
          <div ref={menuRef} className="relative">
            <AuthGradientButton
              label="Nuevo"
              size="small"
              fullWidth={false}
              className="!w-auto min-w-[7rem] px-4"
              onClick={() => setUploadMenuOpen((open) => !open)}
            />
            {uploadMenuOpen ? (
              <div
                className="absolute right-0 top-full z-20 mt-2 min-w-[13rem] overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-soft)]"
                role="menu"
              >
                <button
                  type="button"
                  role="menuitem"
                  className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
                  onClick={() => {
                    setUploadMenuOpen(false);
                    onUploadFile();
                  }}
                >
                  <Upload className="h-4 w-4 text-[var(--accent)]" />
                  Subir archivo
                </button>
                {onCreateDocument ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
                    onClick={() => {
                      setUploadMenuOpen(false);
                      onCreateDocument();
                    }}
                  >
                    <FileText className="h-4 w-4 text-[var(--accent)]" />
                    Crear documento
                  </button>
                ) : null}
                {onCreateSpreadsheet ? (
                  <button
                    type="button"
                    role="menuitem"
                    className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface)]"
                    onClick={() => {
                      setUploadMenuOpen(false);
                      onCreateSpreadsheet();
                    }}
                  >
                    <FileSpreadsheet className="h-4 w-4 text-[var(--accent)]" />
                    Crear hoja de cálculo
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
};
