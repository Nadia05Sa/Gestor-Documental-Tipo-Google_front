import { Check } from 'lucide-react';
import { LANDING_BENEFITS } from '../../../constants/landingContent';
import { BRAND_GRADIENT, MANROPE_STYLE, SOFT_GLOW_GRADIENT } from '../../../constants/theme';

export const LandingBenefitsSection = () => (
  <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24">
    <div className="flex flex-col items-center gap-10 md:gap-16 lg:flex-row">
      <div className="order-2 flex-1 space-y-10 lg:order-1">
        <h2 className="text-2xl font-bold leading-tight sm:text-3xl md:text-4xl" style={MANROPE_STYLE}>
          {LANDING_BENEFITS.title}
        </h2>

        <div className="space-y-6">
          {LANDING_BENEFITS.items.map((item) => (
            <div key={item.title} className="flex items-start gap-4">
              <div
                className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                style={{ background: BRAND_GRADIENT }}
              >
                <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
              </div>
              <div>
                <p className="text-base font-bold md:text-lg">{item.title}</p>
                <p className="text-[var(--text-secondary)]">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="order-1 flex-1 lg:order-2">
        <div className="relative">
          <div
            className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
            style={{ background: SOFT_GLOW_GRADIENT, opacity: 0.5 }}
          />

          <div className="relative grid grid-cols-2 gap-4">
            {LANDING_BENEFITS.stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className={`transform rounded-3xl border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-5 shadow-lg transition-transform md:p-6 md:hover:-translate-y-2 ${stat.offset}`}
                >
                  <Icon className="mb-4 h-8 w-8 text-[var(--accent)]" strokeWidth={1.75} />
                  <h4 className="text-2xl font-bold md:text-3xl">{stat.value}</h4>
                  <p className="text-sm text-[var(--text-secondary)]">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  </section>
);
