export const evaluatePasswordRequirements = ({ newPassword = '' }) => ({
  minLength: newPassword.length >= 8,
  hasUppercase: /[A-Z]/.test(newPassword),
  hasSpecialCharacter: /[^A-Za-z0-9]/.test(newPassword),
});

export const arePasswordRequirementsMet = (requirements = {}) =>
  Object.values(requirements).every(Boolean);

export const validateRegisterForm = (formData, { areRequirementsMet, doesConfirmationMatch }) => {
  const errors = {};

  if (!formData.name.trim()) errors.name = 'El nombre es obligatorio.';
  if (!formData.surname.trim()) errors.surname = 'El apellido paterno es obligatorio.';
  if (!formData.email.trim()) errors.email = 'El correo es obligatorio.';

  if (!formData.password) {
    errors.password = 'La contraseña es obligatoria.';
  } else if (!areRequirementsMet) {
    errors.password = 'La contraseña aún no cumple todos los requisitos.';
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = 'Debes confirmar la contraseña.';
  } else if (!doesConfirmationMatch) {
    errors.confirmPassword = 'La confirmación no coincide con la contraseña.';
  }

  if (!formData.termsAccepted) {
    errors.termsAccepted = 'Debes aceptar los términos y condiciones.';
  }

  return errors;
};

export const hasRegisterRequiredFields = (formData) =>
  Boolean(
    formData.name.trim()
    && formData.surname.trim()
    && formData.email.trim()
    && formData.password
    && formData.confirmPassword
    && formData.termsAccepted,
  );
