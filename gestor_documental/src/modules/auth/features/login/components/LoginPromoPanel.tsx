import { LOGIN_PROMO } from '../types/login.types';
import { MANROPE_STYLE, PROMO_PANEL_GRADIENT } from '@shared/utils/authTheme';

export const LoginPromoPanel = () => (
  <div
    className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 xl:px-20"
    style={{ background: PROMO_PANEL_GRADIENT }}
  >
    <div className="mx-auto w-full max-w-lg">
      <h2 className="text-4xl font-bold leading-tight text-white xl:text-5xl" style={MANROPE_STYLE}>
        {LOGIN_PROMO.title}
      </h2>
      <p className="mt-4 text-base leading-relaxed text-white/85">{LOGIN_PROMO.description}</p>

      <div className="mt-10 space-y-4">
        {LOGIN_PROMO.features.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="flex items-start gap-4 rounded-xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white/20">
                <Icon className="h-5 w-5 text-white" strokeWidth={1.75} />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white" style={MANROPE_STYLE}>
                  {feature.title}
                </h3>
                <p className="mt-1 text-sm leading-relaxed text-white/80">{feature.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);
