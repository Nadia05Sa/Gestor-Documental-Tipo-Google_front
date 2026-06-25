import PropTypes from 'prop-types';
import { Sparkles } from 'lucide-react';
import { ActionButton } from '@shared/components/inputs/ActionButton';
import { LANDING_HERO } from '../../../constants/landingContent';
import {
  BRAND_GRADIENT,
  MANROPE_STYLE,
  SOFT_GLOW_GRADIENT,
  gradientButtonHoverStyle,
  gradientButtonStyle,
} from '../../../constants/theme';

export const LandingHeroSection = ({ onRegister, onLogin, isBusy, isLoginLoading, isRegisterLoading }) => (
  <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-6 pb-12 sm:px-6 md:pt-10 md:pb-20">
    <div className="grid grid-cols-1 items-start gap-8 md:gap-12 lg:grid-cols-2">
      <div className="z-10 space-y-6 md:space-y-8">
        <div className="inline-flex items-center rounded-full bg-[var(--accent-subtle)] px-4 py-1.5 text-xs font-semibold tracking-wide text-[var(--accent)] md:text-sm">
          {LANDING_HERO.badge}
        </div>

        <h1
          className="text-3xl font-extrabold leading-[1.1] tracking-tighter text-[var(--text-primary)] sm:text-4xl md:text-6xl"
          style={MANROPE_STYLE}
        >
          {LANDING_HERO.titlePrefix}{' '}
          <span className="bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] bg-clip-text text-transparent">
            {LANDING_HERO.titleHighlight}
          </span>
        </h1>

        <p className="max-w-xl text-base leading-relaxed text-[var(--text-secondary)] md:text-lg">
          {LANDING_HERO.description}
        </p>

        <div className="flex flex-col gap-4 pt-4 sm:flex-row">
          <ActionButton
            onClick={onRegister}
            label="Comenzar gratis"
            loading={isRegisterLoading}
            loadingLabel="Cargando..."
            disabled={isBusy}
            variant="default"
            colorVariant="default"
            size="hero"
            fullWidth={false}
            className="w-full rounded-xl shadow-lg hover:shadow-xl sm:w-auto"
            customStyle={gradientButtonStyle()}
            customHoverStyle={gradientButtonHoverStyle()}
          />

          <ActionButton
            onClick={onLogin}
            label="Iniciar sesión"
            loading={isLoginLoading}
            loadingLabel="Cargando..."
            disabled={isBusy}
            variant="outline"
            colorVariant="default"
            size="hero"
            fullWidth={false}
            className="w-full rounded-xl sm:w-auto"
            customStyle={{ fontWeight: '600' }}
          />
        </div>
      </div>

      <div className="group relative mt-2 lg:mt-0">
        <div
          className="absolute -inset-4 rounded-3xl opacity-60 blur-3xl transition-opacity group-hover:opacity-80"
          style={{ background: SOFT_GLOW_GRADIENT }}
        />

        <div className="relative rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-2xl">
          <img
            alt={LANDING_HERO.imageAlt}
            className="h-auto w-full rounded-2xl object-cover"
            src={LANDING_HERO.imageUrl}
          />

          <div className="absolute bottom-4 left-4 flex max-w-[190px] items-center gap-3 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-4 shadow-xl md:-bottom-6 md:-left-6 md:max-w-[200px] md:gap-4 md:p-6">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-full text-white md:h-12 md:w-12"
              style={{ background: BRAND_GRADIENT }}
            >
              <Sparkles className="h-5 w-5 md:h-6 md:w-6" />
            </div>
            <div>
              <p className="text-xs font-medium text-[var(--text-secondary)]">Protegido</p>
              <p className="text-sm font-bold">AES-256</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

LandingHeroSection.propTypes = {
  onRegister: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
  isBusy: PropTypes.bool.isRequired,
  isLoginLoading: PropTypes.bool.isRequired,
  isRegisterLoading: PropTypes.bool.isRequired,
};
