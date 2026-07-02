import { useCallback, useMemo, useState } from 'react';
import { toast } from '@shared/components/organisms/Toast';
import { billingApi } from '../api/billingApi';
import type { BillingSummary, PaymentMethodInput } from '../types/billing.types';

export const useBilling = () => {
  const [version, setVersion] = useState(0);

  const summary = useMemo<BillingSummary>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => billingApi.getSummary(),
    [version],
  );

  const refresh = useCallback(() => setVersion((value) => value + 1), []);

  const changePlan = useCallback((planId: string) => {
    billingApi.changePlan(planId);
    refresh();
    toast.success('Plan actualizado correctamente');
  }, [refresh]);

  const addPaymentMethod = useCallback((input: PaymentMethodInput) => {
    billingApi.addPaymentMethod(input);
    refresh();
    toast.success('Método de pago agregado exitosamente');
  }, [refresh]);

  const removePaymentMethod = useCallback((id: string) => {
    try {
      billingApi.removePaymentMethod(id);
      refresh();
      toast.success('Método de pago eliminado');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el método de pago');
    }
  }, [refresh]);

  const setDefaultPaymentMethod = useCallback((id: string) => {
    billingApi.setDefaultPaymentMethod(id);
    refresh();
    toast.success('Método de pago predeterminado actualizado');
  }, [refresh]);

  return {
    summary,
    changePlan,
    addPaymentMethod,
    removePaymentMethod,
    setDefaultPaymentMethod,
  };
};
