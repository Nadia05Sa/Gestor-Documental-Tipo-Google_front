import { ActionButton } from '@shared/components/atoms/ActionButton';
import { LANDING_CTA, type LandingCtaSectionProps } from '../types/landing.types';
import { CTA_BANNER_GRADIENT, MANROPE_STYLE } from '@shared/utils/authTheme';

export const LandingCtaSection = ({ onRegister, isBusy, isRegisterLoading }: LandingCtaSectionProps) => (
  <section id="cta" className="scroll-mt-24 px-4 py-16 sm:px-6 md:py-20">
    <div
      className="relative mx-auto max-w-5xl overflow-hidden rounded-[3rem] p-8 text-center shadow-2xl sm:p-10 md:p-20"
      style={{ background: CTA_BANNER_GRADIENT }}
    >
      <div className="absolute top-0 right-0 -mt-32 -mr-32 h-64 w-64 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

      <div className="relative z-10 space-y-8">
        <h2 className="text-3xl font-extrabold leading-tight text-white md:text-4xl" style={MANROPE_STYLE}>
          {LANDING_CTA.title}
        </h2>
        <p className="mx-auto max-w-2xl text-base text-white/85 md:text-lg">{LANDING_CTA.description}</p>

        <ActionButton
          onClick={onRegister}
          label="Comenzar ahora"
          loading={isRegisterLoading}
          loadingLabel="Cargando..."
          disabled={isBusy}
          variant="default"
          size="hero"
          fullWidth={false}
          className="w-full rounded-2xl shadow-lg hover:shadow-2xl sm:w-auto"
          customStyle={{
            backgroundColor: 'var(--bg-elevated)',
            color: '#3b82f6',
            fontWeight: '700',
          }}
          customHoverStyle={{
            backgroundColor: 'var(--bg-elevated)',
            opacity: '0.95',
          }}
        />
      </div>
    </div>
  </section>
);
