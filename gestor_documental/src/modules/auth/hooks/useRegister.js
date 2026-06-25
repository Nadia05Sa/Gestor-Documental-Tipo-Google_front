import { useState } from 'react';
import { useAuth } from '@context/AuthContext';

const normalizeFieldError = (value) => {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
};

const mapRegisterFieldErrors = (fieldErrors) => {
  if (!fieldErrors || typeof fieldErrors !== 'object') return {};
  return {
    name: normalizeFieldError(fieldErrors.name),
    surname: normalizeFieldError(fieldErrors.surname),
    email: normalizeFieldError(fieldErrors.email),
    password: normalizeFieldError(fieldErrors.password),
    confirmPassword: normalizeFieldError(fieldErrors.confirmPassword),
    termsAccepted: normalizeFieldError(fieldErrors.termsAccepted),
  };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const registerUser = async (formData) => {
    setError('');
    setLoading(true);

    try {
      const data = await register(formData);
      return {
        success: true,
        message: 'Cuenta creada exitosamente',
        data,
        fieldErrors: {},
      };
    } catch (requestError) {
      const message = requestError?.message || 'No se pudo crear la cuenta. Intenta nuevamente.';
      setError(message);
      return {
        success: false,
        message,
        data: null,
        fieldErrors: mapRegisterFieldErrors(requestError?.fieldErrors),
      };
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    setError,
    registerUser,
  };
};
