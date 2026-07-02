import { Link } from 'react-router-dom';
import Checkbox from '@shared/components/inputs/Checkbox';
import InputText from '@shared/components/inputs/InputText';
import { AuthFormError } from '@shared/components/auth/AuthFormError';
import { AuthGradientButton } from '@shared/components/auth/AuthGradientButton';
import { InfinityVaultLogo } from '@shared/components/auth/InfinityVaultLogo';
import { PasswordRequirementsChecklist } from '@shared/components/auth/PasswordRequirementsChecklist';
import {
  BRAND_LINK_COLOR,
  BRAND_NAVY,
  BRAND_PURPLE,
  INPUT_LABEL_STYLE,
  MANROPE_STYLE,
  primaryAuthButtonStyle,
} from '@shared/utils/authTheme';

export const RegisterForm = ({
  formData,
  formErrors,
  requirements,
  error,
  loading,
  isSubmitEnabled,
  onFieldChange,
  onSubmit,
}) => (
  <>
    <div className="mb-8 text-center">
      <InfinityVaultLogo />
      <h1 className="mt-6 text-3xl font-bold tracking-tight" style={{ ...MANROPE_STYLE, color: BRAND_NAVY }}>
        Crear cuenta en <span style={{ color: BRAND_PURPLE }}>VAULT</span>
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary,#6b7280)]">
        Comienza a gestionar tus archivos de forma segura
      </p>
    </div>

    <div className="rounded-2xl border border-[var(--border-subtle,#e5e7eb)] bg-white p-6 shadow-[0_12px_32px_-4px_rgba(25,27,35,0.08)] sm:p-8">
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputText
            label="Nombre(s)"
            value={formData.name}
            onChange={onFieldChange('name')}
            placeholder="Juan"
            required
            error={formErrors.name}
            colorVariant="default"
            labelStyle={INPUT_LABEL_STYLE}
          />
          <InputText
            label="Apellido paterno"
            value={formData.surname}
            onChange={onFieldChange('surname')}
            placeholder="Pérez"
            required
            error={formErrors.surname}
            colorVariant="default"
            labelStyle={INPUT_LABEL_STYLE}
          />
        </div>

        <InputText
          label="Correo electrónico"
          type="email"
          icon="mail"
          value={formData.email}
          onChange={onFieldChange('email')}
          placeholder="tu@email.com"
          required
          error={formErrors.email}
          colorVariant="default"
          labelStyle={INPUT_LABEL_STYLE}
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <InputText
            label="Contraseña"
            type="password"
            icon="lock"
            enablePasswordToggle
            value={formData.password}
            onChange={onFieldChange('password')}
            placeholder="••••••••"
            required
            error={formErrors.password}
            colorVariant="default"
            labelStyle={INPUT_LABEL_STYLE}
          />
          <InputText
            label="Confirmar contraseña"
            type="password"
            icon="lock"
            enablePasswordToggle
            value={formData.confirmPassword}
            onChange={onFieldChange('confirmPassword')}
            placeholder="••••••••"
            required
            error={formErrors.confirmPassword}
            colorVariant="default"
            labelStyle={INPUT_LABEL_STYLE}
          />
        </div>

        {formData.password.length > 0 && (
          <PasswordRequirementsChecklist requirements={requirements} />
        )}

        <Checkbox
          label="Acepto los términos y condiciones"
          checked={formData.termsAccepted}
          onChange={onFieldChange('termsAccepted')}
          error={formErrors.termsAccepted}
          colorVariant="default"
        />

        <AuthFormError message={error} />

        <AuthGradientButton
          type="submit"
          label="Registrarse"
          loading={loading}
          loadingLabel="Registrando..."
          disabled={!isSubmitEnabled}
          styleOverrides={primaryAuthButtonStyle}
        />
      </form>
    </div>

    <p className="mt-8 text-center text-sm text-[var(--text-secondary,#6b7280)]">
      ¿Ya tienes una cuenta?{' '}
      <Link to="/login" className="font-semibold hover:underline" style={{ color: BRAND_LINK_COLOR }}>
        Inicia sesión
      </Link>
    </p>
  </>
);
