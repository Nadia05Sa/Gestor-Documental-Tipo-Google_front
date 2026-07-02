import { useState } from 'react';
import { ActionButton } from '@shared/components/atoms/ActionButton';
import { Checkbox } from '@shared/components/atoms/Checkbox';
import { InputText } from '@shared/components/atoms/InputText';
import { VaultModal } from '@shared/components/molecules/VaultModal';
import { validatePaymentMethod } from '../validations/paymentSchema';
import type { PaymentMethodErrors } from '../validations/paymentSchema';
import type { PaymentMethodInput } from '../types/billing.types';

type PaymentMethodModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: PaymentMethodInput) => void;
};

export const PaymentMethodModal = ({ open, onClose, onSubmit }: PaymentMethodModalProps) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [errors, setErrors] = useState<PaymentMethodErrors>({});

  const handleClose = () => {
    setCardNumber('');
    setCardholderName('');
    setExpiry('');
    setSetAsDefault(true);
    setErrors({});
    onClose();
  };

  const handleSubmit = () => {
    const validationErrors = validatePaymentMethod({ cardNumber, cardholderName, expiry });
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;
    onSubmit({ cardNumber, cardholderName, expiry, setAsDefault });
    handleClose();
  };

  return (
    <VaultModal
      open={open}
      onClose={handleClose}
      title="Agregar método de pago"
      size="md"
      footer={(
        <>
          <ActionButton label="Cancelar" variant="ghost" fullWidth={false} onClick={handleClose} />
          <ActionButton label="Guardar tarjeta" variant="primary" fullWidth={false} onClick={handleSubmit} />
        </>
      )}
    >
      <div className="space-y-4">
        <InputText
          label="Número de tarjeta"
          value={cardNumber}
          error={errors.cardNumber}
          onChange={(event) => setCardNumber(event.target.value)}
          placeholder="4242 4242 4242 4242"
        />
        <InputText
          label="Nombre en la tarjeta"
          value={cardholderName}
          error={errors.cardholderName}
          onChange={(event) => setCardholderName(event.target.value)}
        />
        <InputText
          label="Fecha de expiración"
          value={expiry}
          error={errors.expiry}
          onChange={(event) => setExpiry(event.target.value)}
          placeholder="MM / AA"
        />
        <Checkbox
          label="Establecer como método predeterminado"
          checked={setAsDefault}
          onChange={(event) => setSetAsDefault(event.target.checked)}
        />
      </div>
    </VaultModal>
  );
};
