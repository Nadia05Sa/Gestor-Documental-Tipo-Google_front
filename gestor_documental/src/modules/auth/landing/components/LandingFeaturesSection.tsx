import { LANDING_FEATURES } from '../types/landing.types';
import { MANROPE_STYLE } from '@shared/utils/authTheme';
import { SectionHeading } from './SectionHeading';

export const LandingFeaturesSection = () => (
  <section id="funciones" className="bg-[var(--bg-surface)] py-16 md:py-20">
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <SectionHeading
        className="mb-16 text-center"
        title={LANDING_FEATURES.title}
        description={LANDING_FEATURES.description}
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {LANDING_FEATURES.items.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className="rounded-[2rem] border border-[var(--border-subtle)] bg-[var(--bg-elevated)] p-6 transition-shadow hover:shadow-md sm:p-8"
            >
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-subtle)]">
                <Icon className="h-8 w-8 text-[var(--accent)]" strokeWidth={1.75} />
              </div>
              <h3 className="mb-3 text-lg font-bold" style={MANROPE_STYLE}>
                {card.title}
              </h3>
              <p className="leading-relaxed text-[var(--text-secondary)]">{card.description}</p>
            </article>
          );
        })}
      </div>
    </div>
  </section>
);
