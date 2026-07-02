import { VaultViewPageLayout } from '@shared/components/templates/VaultViewPageLayout';
import { useBilling } from '../hooks/useBilling';
import { BillingView } from '../organisms/BillingView';

export const BillingPage = () => {
  const billing = useBilling();

  return (
    <VaultViewPageLayout title="Plan y facturación" showViewToggle={false}>
      <BillingView
        summary={billing.summary}
        onChangePlan={billing.changePlan}
        onAddPaymentMethod={billing.addPaymentMethod}
        onRemovePaymentMethod={billing.removePaymentMethod}
        onSetDefaultPaymentMethod={billing.setDefaultPaymentMethod}
      />
    </VaultViewPageLayout>
  );
};
