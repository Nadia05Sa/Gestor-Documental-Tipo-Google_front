import { driveApi } from '../../drive/api/driveApi';
import type { BillingPlan, BillingSummary, PaymentMethod, PaymentMethodInput } from '../types/billing.types';

const STORAGE_KEY = 'vault_billing_state';
const GB = 1024 ** 3;

const PLANS: BillingPlan[] = [
  {
    id: 'free',
    name: 'Free',
    storageBytes: 15 * GB,
    priceLabel: 'Gratis',
    features: ['15 GB de almacenamiento', 'Editor de documentos', 'Compartir con enlaces'],
  },
  {
    id: 'pro',
    name: 'Pro',
    storageBytes: 100 * GB,
    priceLabel: '$9.99 / mes',
    features: ['100 GB de almacenamiento', 'Historial de versiones ampliado', 'Soporte prioritario'],
  },
  {
    id: 'business',
    name: 'Business',
    storageBytes: 1024 * GB,
    priceLabel: '$24.99 / mes',
    features: ['1 TB de almacenamiento', 'Controles de administración', 'Auditoría avanzada'],
  },
];

type BillingState = {
  currentPlanId: string;
  paymentMethods: PaymentMethod[];
};

const addDaysIso = (days: number) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString();
};

const monthsAgoIso = (months: number) => {
  const date = new Date();
  date.setMonth(date.getMonth() - months);
  return date.toISOString();
};

const createId = () => `pm_${Date.now().toString(36)}`;

const readState = (): BillingState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as BillingState;
  } catch {
    // ignore
  }
  return {
    currentPlanId: 'pro',
    paymentMethods: [
      {
        id: 'pm_default',
        brand: 'Visa',
        last4: '4242',
        expiry: '08/28',
        cardholderName: 'Usuario Demo',
        isDefault: true,
      },
    ],
  };
};

const writeState = (state: BillingState) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const detectBrand = (cardNumber: string) => {
  if (cardNumber.startsWith('4')) return 'Visa';
  if (cardNumber.startsWith('5')) return 'Mastercard';
  return 'Tarjeta';
};

export const billingApi = {
  getSummary(): BillingSummary {
    const state = readState();
    const plan = PLANS.find((item) => item.id === state.currentPlanId) ?? PLANS[1];

    return {
      plan,
      usedBytes: driveApi.getUsedBytes(),
      renewsOn: addDaysIso(21),
      paymentMethods: state.paymentMethods,
      history: [
        { id: 'pay_4', date: monthsAgoIso(0), concept: `Plan ${plan.name} — mensual`, amountLabel: plan.priceLabel.includes('$') ? '$9.99' : '$0.00', status: 'pending' },
        { id: 'pay_3', date: monthsAgoIso(1), concept: 'Plan Pro — mensual', amountLabel: '$9.99', status: 'paid' },
        { id: 'pay_2', date: monthsAgoIso(2), concept: 'Plan Pro — mensual', amountLabel: '$9.99', status: 'processing' },
        { id: 'pay_1', date: monthsAgoIso(3), concept: 'Plan Pro — mensual', amountLabel: '$9.99', status: 'failed' },
      ],
      availablePlans: PLANS,
    };
  },

  changePlan(planId: string): BillingSummary {
    const state = readState();
    writeState({ ...state, currentPlanId: planId });
    return this.getSummary();
  },

  addPaymentMethod(input: PaymentMethodInput): BillingSummary {
    const state = readState();
    const digits = input.cardNumber.replace(/\D/g, '');
    const last4 = digits.slice(-4);
    const method: PaymentMethod = {
      id: createId(),
      brand: detectBrand(digits),
      last4,
      expiry: input.expiry.trim(),
      cardholderName: input.cardholderName.trim(),
      isDefault: input.setAsDefault || state.paymentMethods.length === 0,
    };

    const paymentMethods = state.paymentMethods.map((item) => ({
      ...item,
      isDefault: input.setAsDefault ? false : item.isDefault,
    }));

    if (method.isDefault) {
      paymentMethods.forEach((item) => {
        item.isDefault = false;
      });
    }

    writeState({ ...state, paymentMethods: [...paymentMethods, method] });
    return this.getSummary();
  },

  removePaymentMethod(id: string): BillingSummary {
    const state = readState();
    const target = state.paymentMethods.find((item) => item.id === id);
    if (!target) return this.getSummary();
    if (target.isDefault) {
      throw new Error('No puedes eliminar el método de pago predeterminado');
    }
    writeState({
      ...state,
      paymentMethods: state.paymentMethods.filter((item) => item.id !== id),
    });
    return this.getSummary();
  },

  setDefaultPaymentMethod(id: string): BillingSummary {
    const state = readState();
    writeState({
      ...state,
      paymentMethods: state.paymentMethods.map((item) => ({
        ...item,
        isDefault: item.id === id,
      })),
    });
    return this.getSummary();
  },
};
