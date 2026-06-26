import { AlertCircle } from 'lucide-react';

// Componente de alerta para mostrar cuando no hay universidad seleccionada, con mensaje personalizable.
/**
 * SelectedUniversityAlert
 */
export const SelectedUniversityAlert = ({
  message = 'Por favor selecciona una universidad en el apartado de Universidades',
}) => {
  return (
    <div
      className="rounded-[var(--radius-card,0.5rem)] border p-6 text-center"
      style={{
        backgroundColor: 'var(--warning-subtle, #fef3c7)',
        borderColor: 'var(--warning-border, #fcd34d)',
      }}
    >
      <AlertCircle className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--warning, #f59e0b)' }} />
      <p className="font-medium" style={{ color: 'var(--warning-text, #92400e)' }}>
        {message}
      </p>
    </div>
  );
};
