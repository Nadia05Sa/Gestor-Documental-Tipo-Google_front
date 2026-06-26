import { useState } from 'react';
import { useAuth } from '@context/AuthContext';
import type { RegisterFormData } from '../types/register.types';

const normalizeFieldError = (value: unknown) => {
  if (Array.isArray(value)) return value[0] || null;
  return value || null;
};

const mapRegisterFieldErrors = (fieldErrors: unknown) => {
  if (!fieldErrors || typeof fieldErrors !== 'object') return {};

  const errors = fieldErrors as Record<string, unknown>;
  return {
    name: normalizeFieldError(errors.name),
    surname: normalizeFieldError(errors.surname),
    email: normalizeFieldError(errors.email),
    password: normalizeFieldError(errors.password),
    confirmPassword: normalizeFieldError(errors.confirmPassword),
    termsAccepted: normalizeFieldError(errors.termsAccepted),
  };
};

export const useRegister = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();

  const registerUser = async (formData: RegisterFormData) => {
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
      const errorValue = requestError as { message?: string; fieldErrors?: unknown };
      const message = errorValue?.message || 'No se pudo crear la cuenta. Intenta nuevamente.';
      setError(message);
      return {
        success: false,
        message,
        data: null,
        fieldErrors: mapRegisterFieldErrors(errorValue?.fieldErrors),
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
