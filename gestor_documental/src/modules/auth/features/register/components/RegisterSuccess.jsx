import PropTypes from 'prop-types';
import { MailCheck } from 'lucide-react';
import { AuthGradientButton } from '../../../components/AuthGradientButton';
import { MANROPE_STYLE, primaryAuthButtonStyle } from '../../../constants/theme';

export const RegisterSuccess = ({ email, onGoToLogin }) => (
  <div className="rounded-2xl border border-[var(--border-subtle,#e5e7eb)] bg-white p-8 text-center shadow-[0_12px_32px_-4px_rgba(25,27,35,0.08)] sm:p-10">
    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-[var(--accent-subtle,#eff6ff)] text-[var(--accent,#3b82f6)]">
      <MailCheck className="h-8 w-8" />
    </div>

    <h1 className="text-2xl font-bold text-[var(--text-primary,#111827)]" style={MANROPE_STYLE}>
      Cuenta creada
    </h1>
    <p className="mt-2 text-[var(--text-secondary,#6b7280)]">
      Tu cuenta fue creada correctamente. Ya puedes iniciar sesión con tus credenciales.
    </p>
    {email && (
      <p className="mt-2 text-sm font-medium text-[var(--text-primary,#111827)]">Correo: {email}</p>
    )}

    <div className="mt-8">
      <AuthGradientButton
        label="Ir a iniciar sesión"
        onClick={onGoToLogin}
        styleOverrides={primaryAuthButtonStyle}
      />
    </div>
  </div>
);

RegisterSuccess.propTypes = {
  email: PropTypes.string,
  onGoToLogin: PropTypes.func.isRequired,
};
