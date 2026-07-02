import type { ChangeEvent, FormEvent } from 'react';

export type RegisterFormData = {
  name: string;
  surname: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
};

export type PasswordRequirements = {
  minLength: boolean;
  hasUppercase: boolean;
  hasSpecialCharacter: boolean;
};

export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string | null>>;

export type RegisterFormProps = {
  formData: RegisterFormData;
  formErrors: RegisterFormErrors;
  requirements: PasswordRequirements;
  error: string;
  loading: boolean;
  isSubmitEnabled: boolean;
  onFieldChange: (fieldName: keyof RegisterFormData) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export type RegisterSuccessProps = {
  email: string;
  onGoToLogin: () => void;
};
