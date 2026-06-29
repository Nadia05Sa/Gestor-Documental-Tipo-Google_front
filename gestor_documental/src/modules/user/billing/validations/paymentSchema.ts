export type PaymentMethodErrors = {
  cardNumber?: string;
  cardholderName?: string;
  expiry?: string;
};

export const validatePaymentMethod = (values: {
  cardNumber: string;
  cardholderName: string;
  expiry: string;
}): PaymentMethodErrors => {
  const errors: PaymentMethodErrors = {};
  const digits = values.cardNumber.replace(/\D/g, '');

  if (digits.length < 13) {
    errors.cardNumber = 'Introduce un número de tarjeta válido.';
  }
  if (!values.cardholderName.trim()) {
    errors.cardholderName = 'El nombre en la tarjeta es obligatorio.';
  }
  if (!/^\d{2}\s*\/\s*\d{2}$/.test(values.expiry.trim())) {
    errors.expiry = 'Usa el formato MM / AA.';
  }

  return errors;
};
