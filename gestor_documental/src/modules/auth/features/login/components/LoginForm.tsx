import { Link } from 'react-router-dom';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import Checkbox from '@shared/components/inputs/Checkbox';
import InputText from '@shared/components/inputs/InputText';
import { AuthFormError } from '@shared/components/auth/AuthFormError';
import { AuthGradientButton } from '@shared/components/auth/AuthGradientButton';
import { GoogleIcon } from '@shared/components/auth/GoogleIcon';
import { InfinityVaultLogo } from '@shared/components/auth/InfinityVaultLogo';
import {
  BRAND_LINK_COLOR,
  INPUT_LABEL_STYLE,
  MANROPE_STYLE,
  primaryAuthButtonStyle,
} from '@shared/utils/authTheme';

export const LoginForm = ({
  email,
  password,
  rememberMe,
  error,
  loading,
  onEmailChange,
  onPasswordChange,
  onRememberMeChange,
  onSubmit,
}) => (
  <div className="mx-auto w-full max-w-md">
    <div className="mb-10 text-center">
      <InfinityVaultLogo />
      <h1 className="mt-8 text-3xl font-bold text-[var(--text-primary,#111827)]" style={MANROPE_STYLE}>
        Bienvenido de vuelta
      </h1>
      <p className="mt-2 text-sm text-[var(--text-secondary,#6b7280)]">
        Inicia sesión para acceder a tus archivos
      </p>
    </div>

    <form onSubmit={onSubmit} className="space-y-5">
      <InputText
        label="Correo electrónico"
        type="email"
        icon="mail"
        value={email}
        onChange={onEmailChange}
        placeholder="tu@email.com"
        required
        colorVariant="default"
        labelStyle={INPUT_LABEL_STYLE}
      />

      <InputText
        label="Contraseña"
        type="password"
        icon="lock"
        enablePasswordToggle
        value={password}
        onChange={onPasswordChange}
        placeholder="••••••••"
        required
        colorVariant="default"
        labelStyle={INPUT_LABEL_STYLE}
      />

      <div className="flex items-center justify-between gap-4">
        <Checkbox
          label="Recordarme"
          checked={rememberMe}
          onChange={onRememberMeChange}
          colorVariant="default"
          className="!w-auto"
        />
        <button
          type="button"
          className="text-sm font-medium transition-colors hover:underline"
          style={{ color: BRAND_LINK_COLOR }}
        >
          ¿Olvidaste tu contraseña?
        </button>
      </div>

      <AuthFormError message={error} />

      <AuthGradientButton
        type="submit"
        label="Iniciar sesión"
        loading={loading}
        loadingLabel="Iniciando sesión..."
        disabled={loading}
        styleOverrides={primaryAuthButtonStyle}
      />

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-[var(--border-subtle,#e5e7eb)]" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-[var(--text-secondary,#6b7280)]">O continuar con</span>
        </div>
      </div>

      <ActionButton
        type="button"
        variant="secondary"
        colorVariant="default"
        fullWidth
        customStyle={{
          backgroundColor: '#f0f4ff',
          borderColor: '#e0e7ff',
          color: BRAND_LINK_COLOR,
          borderRadius: '0.625rem',
          padding: '0.75rem 1rem',
          fontSize: '0.9375rem',
          boxShadow: 'none',
        }}
        customHoverStyle={{
          backgroundColor: '#e8eeff',
          borderColor: '#c7d2fe',
        }}
      >
        <span className="flex w-full items-center justify-center gap-3">
          <GoogleIcon />
          Continuar con Google
        </span>
      </ActionButton>
    </form>

    <p className="mt-8 text-center text-sm text-[var(--text-secondary,#6b7280)]">
      ¿No tienes una cuenta?{' '}
      <Link to="/register" className="font-semibold hover:underline" style={{ color: BRAND_LINK_COLOR }}>
        Regístrate
      </Link>
    </p>
  </div>
);
