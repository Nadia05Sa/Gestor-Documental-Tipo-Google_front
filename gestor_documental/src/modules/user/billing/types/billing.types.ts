export type PaymentStatus = 'paid' | 'pending' | 'processing' | 'failed';

export type BillingPlan = {
  id: string;
  name: string;
  storageBytes: number;
  priceLabel: string;
  features: string[];
};

export type PaymentRecord = {
  id: string;
  date: string;
  concept: string;
  amountLabel: string;
  status: PaymentStatus;
};

export type PaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  expiry: string;
  cardholderName: string;
  isDefault: boolean;
};

export type BillingSummary = {
  plan: BillingPlan;
  usedBytes: number;
  renewsOn: string;
  paymentMethods: PaymentMethod[];
  history: PaymentRecord[];
  availablePlans: BillingPlan[];
};

export type PaymentMethodInput = {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
  setAsDefault: boolean;
};
