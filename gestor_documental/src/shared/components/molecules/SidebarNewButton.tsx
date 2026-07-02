import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileSpreadsheet, FileText, FolderPlus, Plus, Upload } from 'lucide-react';
import { AuthGradientButton } from '@shared/components/molecules/AuthGradientButton';

type SidebarNewButtonProps = {
  collapsed?: boolean;
};

/** Botón "+ Nuevo" del sidebar VAULT con menú de creación. */
export const SidebarNewButton = ({ collapsed = false }: SidebarNewButtonProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const goToDrive = (action?: string) => {
    setOpen(false);
    navigate('/drive', { state: { newAction: action } });
  };

  if (collapsed) {
    return (
      <button
        type="button"
        onClick={() => goToDrive('upload')}
        className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl text-white"
        style={{ background: 'var(--gradient-primary)' }}
        aria-label="Nuevo"
      >
        <Plus className="h-5 w-5" />
      </button>
    );
  }

  return (
    <div ref={ref} className="relative px-3 pb-3">
      <AuthGradientButton
        label="+ Nuevo"
        size="small"
        fullWidth
        className="!font-bold"
        onClick={() => setOpen((value) => !value)}
      />
      {open ? (
        <div
          role="menu"
          className="absolute left-3 right-3 top-full z-30 mt-2 overflow-hidden rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] py-1 shadow-[var(--shadow-soft)]"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            onClick={() => goToDrive('upload')}
          >
            <Upload className="h-4 w-4 text-[var(--accent)]" />
            Subir archivo
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            onClick={() => goToDrive('folder')}
          >
            <FolderPlus className="h-4 w-4 text-[var(--accent)]" />
            Nueva carpeta
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            onClick={() => goToDrive('document')}
          >
            <FileText className="h-4 w-4 text-[var(--accent)]" />
            Crear documento
          </button>
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--bg-surface)]"
            onClick={() => goToDrive('spreadsheet')}
          >
            <FileSpreadsheet className="h-4 w-4 text-[var(--accent)]" />
            Crear hoja de cálculo
          </button>
        </div>
      ) : null}
    </div>
  );
};
