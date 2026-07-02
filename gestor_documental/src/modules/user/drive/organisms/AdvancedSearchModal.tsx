import { useEffect, useState } from 'react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { Checkbox } from '@shared/components/atoms/Checkbox';
import { InputText } from '@shared/components/atoms/InputText';
import { Select } from '@shared/components/atoms/Select';
import { VaultModal } from '@shared/components/molecules/VaultModal';
import { EMPTY_ADVANCED_FILTERS, type AdvancedSearchFilters } from '../types/drive.types';

const FILE_TYPE_OPTIONS = [
  { value: '', label: 'Seleccionar tipo' },
  { value: 'pdf', label: 'PDF' },
  { value: 'docx', label: 'Documento (Word)' },
  { value: 'xlsx', label: 'Hoja de cálculo (Excel)' },
  { value: 'png', label: 'Imagen (PNG)' },
  { value: 'txt', label: 'Texto' },
];

type AdvancedSearchModalProps = {
  open: boolean;
  initialFilters: AdvancedSearchFilters;
  onClose: () => void;
  onApply: (filters: AdvancedSearchFilters) => void;
};

export const AdvancedSearchModal = ({
  open,
  initialFilters,
  onClose,
  onApply,
}: AdvancedSearchModalProps) => {
  const [filters, setFilters] = useState<AdvancedSearchFilters>(initialFilters);

  useEffect(() => {
    if (open) setFilters(initialFilters);
  }, [open, initialFilters]);

  const update = (patch: Partial<AdvancedSearchFilters>) => {
    setFilters((current) => ({ ...current, ...patch }));
  };

  return (
    <VaultModal
      open={open}
      onClose={onClose}
      title="Búsqueda Avanzada"
      description="Filtra archivos por tipo, tamaño, fechas y etiquetas."
      size="lg"
      footer={(
        <>
          <ActionButton
            label="Limpiar"
            variant="ghost"
            fullWidth={false}
            onClick={() => setFilters(EMPTY_ADVANCED_FILTERS)}
          />
          <ActionButton
            label="Aplicar filtros"
            variant="primary"
            fullWidth={false}
            onClick={() => {
              onApply(filters);
              onClose();
            }}
          />
        </>
      )}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Select
          label="Tipo de archivo"
          value={filters.fileType}
          options={FILE_TYPE_OPTIONS}
          showPlaceholderOption={false}
          reserveHelperSpace={false}
          onChange={(event) => update({ fileType: event.target.value })}
        />
        <InputText
          label="Tamaño mínimo (MB)"
          type="number"
          value={filters.minSizeMb}
          onChange={(event) => update({ minSizeMb: event.target.value })}
          placeholder="0"
        />
        <InputText
          label="Tamaño máximo (MB)"
          type="number"
          value={filters.maxSizeMb}
          onChange={(event) => update({ maxSizeMb: event.target.value })}
          placeholder="1000"
        />
        <InputText
          label="Desde"
          type="date"
          value={filters.dateFrom}
          onChange={(event) => update({ dateFrom: event.target.value })}
        />
        <InputText
          label="Hasta"
          type="date"
          value={filters.dateTo}
          onChange={(event) => update({ dateTo: event.target.value })}
        />
        <div className="sm:col-span-2">
          <InputText
            label="Tags"
            value={filters.tags}
            onChange={(event) => update({ tags: event.target.value })}
            placeholder="Separar por comas: trabajo, importante, urgente"
          />
        </div>
        <Checkbox
          label="Solo archivos compartidos"
          checked={filters.sharedOnly}
          onChange={(event) => update({ sharedOnly: event.target.checked })}
        />
        <Checkbox
          label="Solo archivos destacados"
          checked={filters.starredOnly}
          onChange={(event) => update({ starredOnly: event.target.checked })}
        />
      </div>
    </VaultModal>
  );
};
