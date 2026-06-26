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
