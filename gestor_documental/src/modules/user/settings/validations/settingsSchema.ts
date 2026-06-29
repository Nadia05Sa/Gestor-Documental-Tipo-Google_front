const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ProfileErrors = {
  name?: string;
  email?: string;
};

/**
 * Valida los campos editables del perfil. Devuelve un objeto con los errores
 * encontrados (vacío si todo es válido).
 */
export const validateProfile = (values: { name: string; email: string }): ProfileErrors => {
  const errors: ProfileErrors = {};
  if (!values.name.trim()) {
    errors.name = 'El nombre es obligatorio.';
  }
  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'Email inválido';
  }
  return errors;
};
