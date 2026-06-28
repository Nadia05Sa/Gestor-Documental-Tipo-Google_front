export const validateLoginForm = ({ email, password }: { email: string; password: string }) => {
  const errors: { email?: string; password?: string } = {};

  if (!email.trim()) errors.email = 'El correo es obligatorio.';
  if (!password) errors.password = 'La contraseña es obligatoria.';

  return errors;
};
