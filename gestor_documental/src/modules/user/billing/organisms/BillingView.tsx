import { useState } from 'react';
import { CreditCard, Check, Plus, Trash2 } from 'lucide-react';
import { VaultCard } from '@shared/components/atoms/VaultCard';
import { VaultBadge } from '@shared/components/atoms/VaultBadge';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { AuthGradientButton } from '@shared/components/molecules/AuthGradientButton';
import { ConfirmModal } from '@shared/components/molecules/ConfirmModal';
import { formatDate, formatGigabytes } from '@shared/domain/drive/utils/driveItemUtils';
import { PaymentMethodModal } from './PaymentMethodModal';
import type {
  BillingPlan,
  BillingSummary,
  PaymentMethod,
  PaymentMethodInput,
  PaymentStatus,
} from '../types/billing.types';

const STATUS_LABEL: Record<PaymentStatus, string> = {
  paid: 'Pagado',
  pending: 'Pago pendiente',
  processing: 'En proceso',
  failed: 'Fallido',
};

const STATUS_TONE: Record<PaymentStatus, string> = {
  paid: 'var(--success-600, #16a34a)',
  pending: 'var(--warning-600, #d97706)',
  processing: 'var(--accent, #2563eb)',
  failed: 'var(--danger-600, #dc2626)',
};

type BillingViewProps = {
  summary: BillingSummary;
  onChangePlan: (planId: string) => void;
  onAddPaymentMethod: (input: PaymentMethodInput) => void;
  onRemovePaymentMethod: (id: string) => void;
  onSetDefaultPaymentMethod: (id: string) => void;
};

type ConfirmState =
  | { type: 'plan'; plan: BillingPlan }
  | { type: 'remove'; method: PaymentMethod }
  | null;

export const BillingView = ({
  summary,
  onChangePlan,
  onAddPaymentMethod,
  onRemovePaymentMethod,
  onSetDefaultPaymentMethod,
}: BillingViewProps) => {
  const { plan, usedBytes, renewsOn, paymentMethods, history, availablePlans } = summary;
  const usagePercent = Math.min(100, Math.round((usedBytes / plan.storageBytes) * 100));

  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const handleConfirm = () => {
    if (confirm?.type === 'plan') onChangePlan(confirm.plan.id);
    if (confirm?.type === 'remove') onRemovePaymentMethod(confirm.method.id);
    setConfirm(null);
  };

  return (
    <div className="space-y-8">
      <VaultCard padding="p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-extrabold text-[var(--text-primary)]">
                {plan.name} {formatGigabytes(plan.storageBytes)}
              </h2>
              <VaultBadge tone="success">Activo</VaultBadge>
            </div>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">
              Renueva el {formatDate(renewsOn)}
            </p>
          </div>
          <ActionButton
            label="Cambiar plan"
            variant="primary"
            size="small"
            fullWidth={false}
            onClick={() => {
              const next = availablePlans.find((option) => option.id !== plan.id);
              if (next) setConfirm({ type: 'plan', plan: next });
            }}
          />
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-[var(--text-primary)]">Almacenamiento</span>
            <span className="text-[var(--text-secondary)]">
              {formatGigabytes(usedBytes)} de {formatGigabytes(plan.storageBytes)} usados
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-[var(--bg-surface)]">
            <div
              className="h-full rounded-full"
              style={{ width: `${usagePercent}%`, background: 'var(--gradient-primary)' }}
            />
          </div>
        </div>
      </VaultCard>

      <div>
        <h3 className="mb-4 text-lg font-extrabold text-[var(--text-primary)]">Planes disponibles</h3>
        <div className="grid gap-4 md:grid-cols-3">
          {availablePlans.map((option) => {
            const isCurrent = option.id === plan.id;
            return (
              <VaultCard
                key={option.id}
                padding="p-5"
                selected={isCurrent}
                className={isCurrent ? 'ring-2 ring-[var(--accent)]' : ''}
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-lg font-bold text-[var(--text-primary)]">{option.name}</h4>
                  {isCurrent ? <VaultBadge tone="primary">Plan actual</VaultBadge> : null}
                </div>
                <p className="mt-1 text-sm font-semibold text-[var(--accent)]">{option.priceLabel}</p>
                <ul className="mt-4 space-y-2">
                  {option.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--success-600)]" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="mt-5">
                  {isCurrent ? (
                    <ActionButton label="Plan actual" variant="secondary" size="small" fullWidth disabled />
                  ) : (
                    <AuthGradientButton
                      label="Seleccionar"
                      size="small"
                      fullWidth
                      onClick={() => setConfirm({ type: 'plan', plan: option })}
                    />
                  )}
                </div>
              </VaultCard>
            );
          })}
        </div>
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-lg font-extrabold text-[var(--text-primary)]">Métodos de pago</h3>
          <ActionButton
            icon={Plus}
            label="Agregar método"
            variant="outline"
            size="small"
            fullWidth={false}
            onClick={() => setPaymentModalOpen(true)}
          />
        </div>

        <div className="space-y-3">
          {paymentMethods.length === 0 ? (
            <VaultCard padding="p-5">
              <p className="text-sm text-[var(--text-secondary)]">Sin método de pago registrado.</p>
            </VaultCard>
          ) : (
            paymentMethods.map((method) => (
              <VaultCard key={method.id} padding="p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-surface)] text-[var(--accent)]">
                      <CreditCard className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {method.brand} •••• {method.last4}
                        {method.isDefault ? (
                          <span className="ml-2">
                            <VaultBadge tone="primary">Predeterminada</VaultBadge>
                          </span>
                        ) : null}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)]">Expira {method.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {!method.isDefault ? (
                      <button
                        type="button"
                        className="text-sm font-semibold text-[var(--accent)] hover:underline"
                        onClick={() => onSetDefaultPaymentMethod(method.id)}
                      >
                        Predeterminar
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--error)] transition-colors hover:bg-[var(--error-subtle)] disabled:opacity-40"
                      onClick={() => setConfirm({ type: 'remove', method })}
                      disabled={method.isDefault}
                      title={method.isDefault ? 'No puedes eliminar el método predeterminado' : 'Eliminar'}
                      aria-label="Eliminar método de pago"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </VaultCard>
            ))
          )}
        </div>
      </div>

      {history.length > 0 ? (
        <div>
          <h3 className="mb-4 text-lg font-extrabold text-[var(--text-primary)]">Historial de pagos</h3>
          <VaultCard padding="p-0" className="overflow-hidden">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-left text-[11px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  <th className="px-4 py-3">Fecha</th>
                  <th className="px-4 py-3">Concepto</th>
                  <th className="px-4 py-3">Importe</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {history.map((record) => (
                  <tr key={record.id} className="border-b border-[var(--border-subtle)] last:border-b-0">
                    <td className="px-4 py-3 text-[var(--text-secondary)]">{formatDate(record.date)}</td>
                    <td className="px-4 py-3 text-[var(--text-primary)]">{record.concept}</td>
                    <td className="px-4 py-3 font-semibold text-[var(--text-primary)]">{record.amountLabel}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium" style={{ color: STATUS_TONE[record.status] }}>
                        {STATUS_LABEL[record.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </VaultCard>
        </div>
      ) : null}

      <PaymentMethodModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSubmit={onAddPaymentMethod}
      />

      <ConfirmModal
        isOpen={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={handleConfirm}
        title={confirm?.type === 'plan' ? 'Confirmar cambio de plan' : 'Eliminar método de pago'}
        message={
          confirm?.type === 'plan'
            ? `¿Confirmar cambio al plan ${confirm.plan.name}?`
            : confirm?.type === 'remove'
              ? '¿Estás seguro de que quieres eliminar este método de pago?'
              : ''
        }
        confirmLabel={confirm?.type === 'plan' ? 'Confirmar cambio' : 'Eliminar'}
      />
    </div>
  );
};
